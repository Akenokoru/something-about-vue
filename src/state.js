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
  console.log('初始化数据', vm.$options.data)
}
function initComputed() {}
function initWatch() {}