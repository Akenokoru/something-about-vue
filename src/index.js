import { initMixin } from './init'
function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options)
}
initMixin(Vue) // 给vue原型添加_init方法
export default Vue