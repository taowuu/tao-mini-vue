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
