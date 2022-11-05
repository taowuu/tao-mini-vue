// 响应化
class Observer {
  constructor(obj) {
    // 判断传入obj类型，做相应处理
    if (Array.isArray(obj)) {
      // todo
    } else {
      this.walk(obj)
    }
  }

  walk(obj) {
    // 对多属性
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
  }
}

// 模板编译
class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    // 如果有节点挂载则进行编译
    if(this.$el) {
      this.compile(this.$el)
    }
  }
  // 编译
  compile(node) {
    const childNodes = node.childNodes

    Array.from(childNodes).forEach((n) => {
      // 判断类型
      if (this.isElement(n)) {
        console.log('编译元素', n.nodeName)
        this.compileElement(n)
        // 递归编译
        if (n.childNodes.length > 0) {
          this.compile(n)
        }
      } else if (this.isInter(n)) {
        // 动态插值表达式
        console.log('编译插值', n.textContent)
        this.compileText(n)
      }
    })
  }

  // 节点
  isElement(n) {
    return n.nodeType === 1
  }

  // 形如{{ooxx}}
  isInter(n) {
    return n.nodeType === 3 && /\{\{(.*)\}\}/.test(n.textContent);
  }

  // 编译插值文本 {{ooxx}}
  compileText(n) {
    // 获取表达式
    n.textContent = this.$vm[RegExp.$1]
  }

  // 编译元素：遍历它的所有特性，看是否v-开头指令，或者@事件
  compileElement(n) {
    const attrs = n.attributes
    Array.from(attrs).forEach((attr) => {
      // v-text="xxx"
      // name = v-text, value = xxx
      const attrName = attr.name
      const exp = attr.value
      // 指令
      if (this.isDir(attrName)) {
        // 执行特定指令处理函数
        const dir = attrName.substring(2)
        this[dir] && this[dir](n, exp)
      }
    })
  }

  update(node, exp, dir) {
    // 指令调用初始化
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])

    // 建立 watcher 进行后续更新
    new Watcher(this.$vm, exp, val => {
      fn && fn(node, val)
    })
  }

  // v-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(node, exp, "text")
  }

  // 
  textUpdater(node, val) {
    node.textContent = val
  }

  // v-html
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, "html")
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  // 判断指令
  isDir(attrName) {
    return attrName.startsWith("v-")
  }
}

// 负责dom更新
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm
    this.key = key
    this.updater = updater
  }

  // 将来会被 Dep 调用
  update() {
    this.updater.call(this.vm, this.vm[this.key])
  }
}

class Vue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 对data做响应式处理
    observe(options.data)

    // 属性代理
    proxy(this)

    // 编译
    new Compile(options.el, this)
  }
}

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

  new Observer(obj)
}

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
