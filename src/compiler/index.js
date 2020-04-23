// 虚拟DOM: 用对象来描述DOM节点 AST语法树: 用对象来描述原生语法
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // abc-aaa
// 一些正则
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function compileToFunction(template) {
  return function render() {

  }
}
