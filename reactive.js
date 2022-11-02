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
