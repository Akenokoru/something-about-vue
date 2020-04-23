// 把data中的数据都用Object.defineProperty重新定义 es5
// 不兼容ie8及以下
import { isObject, def } from '../util/index'
import { arrayMethods } from './array'

class Observer {
  constructor(value) {
    // vue如果数据层次过多 需要递归解析对象中属性， 依次增加set和get方法
    // so vue3 -> proxy
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组，不对索引进行监控，会导致性能问题
      // 前端开发中很少操作索引 push shift unshift
      value.__proto__ = arrayMethods
      //如果数组里是对象再监控
      this.observerArray(value)
    } else {
      this.copy(value)
    }
  }
  observerArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
  copy(data) {
    let keys = Object.keys(data) // [name, age, address]
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  observe(value) // 递归实现深度检测
  Object.defineProperty(data, key, {
    get() {
      // 获取值的时候做一些事情
      return value
    },
    set(newValue) {
      console.log(('更新数据'))
      // 设置值的时候做一些事情
      if (newValue === value) {
        return
      }
      console.log('值发生变化')
      observe(newValue) // 继续劫持设置的值，cuz有可能设置的是一个对象
      value = newValue
    }
  })
}

export function observe(data) {
  let isObj = isObject(data)
  if (!isObj) {
    return
  }
  return new Observer(data)
}