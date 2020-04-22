import { observe } from './observer/index.js'
export function initState(vm) {
  const opts = vm.$options
  console.log(opts, '1123123')
  // vue的数据来源 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
} 

function initProps() {}
function initMethods() {}
function initData(vm) {
  // 数据初始化工作
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 对象劫持 用户改变了数据时得到通知->刷新页面
  // MVVM 数据变化驱动视图变化
  // Object.defineProperty() 给属性增加get方法和set方法
  observe(data) // 响应式原理
}
function initComputed() {}
function initWatch() {}