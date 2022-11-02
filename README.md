# tao-vue

## 认识数据响应式
- 数据响应式就是数据的变更能自动体现在视图中
- Vue2 中通过 `Object.defineProperty` 实现
- 通过 `get` 劫持数据的取值
- 通过 `set` 劫持数据的赋值
- 代码样例 `reactive.js`
```js
// 要拦截的对象
const obj = {}
// 对数据取值、赋值进行拦截
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}:${val}`)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
      console.log(`set ${key}:${newVal}`)
      val = newVal
    }
    }
  })
}
// 效果展示
defineReactive(obj, 'foo', 'foo')
obj.foo // get foo:foo
obj.foo = 'foooooooooooo' // set foo:foooooooooooo
```

## 数据驱动视图
- 在劫持数据时更新视图上的数据
- 代码样例 `reactive.html`
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>reactive</title>
</head>
<body>
  <div id="app"></div>
</body>
<script>
  // 要拦截的对象
  const obj = {}
  // 对数据取值、赋值进行拦截
  function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        console.log(`get ${key}:${val}`)
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          console.log(`set ${key}:${newVal}`)
          val = newVal
          // 每秒改变数据并更新在视图上
          update()
        }
      }
    })
  }
  // 效果展示
  defineReactive(obj, 'foo', 'foo')

  obj.foo = new Date().toLocaleTimeString()

  function update() {
    app.innerText = obj.foo
  }

  setInterval(() => {
    obj.foo = new Date().toLocaleTimeString()
  }, 1000)
</script>
</html>
```

## 增强数据响应式操作
- 对嵌套属性进行递归遍历
- 对新增数据进行响应式
- 代码样例 `reactive-observe.js`
```js
// 对数据取值、赋值进行拦截
function defineReactive(obj, key, val) {
  // val 如果是个对象，就需要递归处理
  observe(val)
  
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}:${val}`)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log(`set ${key}:${newVal}`)
        val = newVal
        // 新值如果是对象，仍然需要递归遍历处理
        observe(newVal)
      }
    }
  })
}
// 遍历响应式处理
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj
  }
  // 对多属性
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
}
// 新增属性响应式
function set(obj, key, val) {
  defineReactive(obj, key, val)
}
// 效果展示
let obj = {
  name: 'tao',
  hobbies: {
    sport: 'run',
  }
}

observe(obj)
obj.name // get name:tao
// 解决嵌套对象问题
obj.hobbies.sport // get sport:run
// 解决赋的值是对象的情况
obj.hobbies = {
  food: 'apple'
}
obj.hobbies.food // get food:apple
// 新增属性
set(obj, 'dong', 'dong')
obj.dong // get dong:dong
```

## 属性代理
- 将 data 中的属性代理到 Vue 实例上
- 以至于可以直接通过 Vue 实例访问属性
- `app.$data.count -> app.count`
- 代码样例 `utils.js`
```js
// 能够将传入对象中的所有 key 代理到指定对象上
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      },
    })
  })
}
```

## 开始实现自己的 Vue1
- 新建 Vue 实例
- 对传入的选项进行解析
- 对数据进行相应化、代理
- 样例代码 `vue1.html`
- 样例代码 `vue1.js`


## 开始实现自己的 Vue2
- 新增 Observer 处理不同数据的响应式

- 样例代码 `vue2.html`
- 样例代码 `vue2.js`
