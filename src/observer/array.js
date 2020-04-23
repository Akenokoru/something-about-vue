// 重写数组的基本方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
// slice不会 因此不需要劫持
let oldArrayMethods = Array.prototype
// value.__proto__ = arrayMethods 原型链向上查找，先查找重写的，没有重写的继续向上查找
export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]
methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log(`用户调用了${method}方法`) // AOP切片编程
    const result = oldArrayMethods[method].apply(this, args) // 调用原生数组方法
    // push unshift 添加的元素还可能是个对象
    let inserted // 当前插入的元素
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': //
        inserted = args.slice(2)
      default:
        break;
    }
    if (inserted) {
      ob.observerArray(inserted)
    }
    return result
  }
})