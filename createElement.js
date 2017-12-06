import {h} from './h'
import {mixin} from './mixin'

/**
 * Function to set properties and attributes on element.
 * @param {node} element 
 * @param {string} name 
 * @param {string|number|boolean} value 
 * @param {string|number|boolean} oldValue 
 */
function setProps(element, name, value, oldValue) {
  if (name === 'key') {
  } else if (name === 'style') {
    for (let name in mixin(oldValue, (value = value || {}))) {
      element.style[name] = String(value[name]) || ''
    }
  } else {
    try {
      if (value === 0) value = String(value)
      element[name] = value
    } catch (err) {}

    if (typeof value !== 'function') {
      if (!!value) {
        // Support SVG 'xlink:href' property:
        if (name === 'xlink-href') {
          element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value)
          element.setAttribute('href', value)
        } else {
          element.setAttribute(name, value)
        }
      } else {
        element.removeAttribute(name)
      }
    }
  }
}

/**
 * Function to create an HTML or SVG node.
 * @param {node} node node A node to create.
 * @param {svg} svg Whether the node is SVG or not.
 */
function createNode(node, svg) {
  const element = (svg = svg || node.type === "svg")
  ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
  : document.createElement(node.type)

  Object.keys(node.props).forEach(key => setProps(element, key, node.props[key]))
  node.children.map(child => element.appendChild(createElement(child, svg)))
  return element
}

/**
 * Function to convert hyperscript/JSX into DOM nodes.
 * @param {jsx|hyperscript} node A node to create.
 * @param {svg} svg Whether the node is SVG or not.
 */
export function createElement(node, svg) {
  return typeof node === "string" ? document.createTextNode(node) : createNode(node, svg)
}
