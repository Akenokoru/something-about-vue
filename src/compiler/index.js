// 虚拟DOM: 用对象来描述DOM节点 AST语法树: 用对象来描述原生语法
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // abc-aaa
// 一些正则
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root = null
let currentParent
let stack = []

function start(tagName, attrs) {
  console.log('开始标签:', tagName, '属性是:', attrs)
}

function end(text) {
  console.log('文本:', text)
}

function chars(tagName) {
  console.log('结束标签:', tagName)
}

function parseHTML(html) {
  while (html) {
    // 不停地解析html
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      // 如果当前索引为0 肯定是一个标签 两种情况（开始标签，结束标签）
      let startTagMatch = parseStartTag() // 通过这个方法获取匹配的结果 tagName attrs
      console.log(startTagMatch)
      break
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除
      let end, attr
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 将属性解析
        advance(attr[0].length) // 将属性去掉
        match.attrs.push({name: attr[1], value:attr[3] || attr[4] || attr[5]})
      }
      if (end) { // 去掉开始标签的>
        advance(end[0].length)
        return match
      }
    }
  }
}
export function compileToFunction(template) {
  let root = parseHTML(template)
  return function render() {
    
  }
}