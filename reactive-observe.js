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
// 效果展示
let obj = {
  name: 'tao',
  hobbies: {
    sport: 'run',
  }
}

observe(obj)
obj.name // get name:tao
obj.hobbies.sport // get sport:run
obj.age = 20
obj.age // get age:20
