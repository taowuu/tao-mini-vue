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

## 