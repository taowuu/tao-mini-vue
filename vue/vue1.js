class Vue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 对data做响应式处理
    observe(options.data)

    // 属性代理
    proxy(this)
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
  // 对多属性
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]))
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
