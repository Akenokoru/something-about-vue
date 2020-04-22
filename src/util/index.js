/**
 *
 * @param {*} data 当前数据是否为对象
 */
export function isObject(data) {
  return typeof data === 'object' && data !== null
}