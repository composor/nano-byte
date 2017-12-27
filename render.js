import {h} from './h'
import {createElement} from './createElement'

/**
 * A function to create and inject a virtual node into the document. On the first render, the node will be appended to the container. After that, each subsequential render will patch and update the DOM. The first argument can be either a JSX tag or an h function.
 * 
 * @param {function} tag A JSX tag or hyperscript function to render.
 * @param {Element|boolean} [container] The element into which the tag will be rendered.
 */
export function render(tag, container) {
  if (typeof container === 'string') container = document.querySelector(container)
  
  const ret = document.createDocumentFragment('div')
  ret.appendChild(createElement(tag))
  container.textContent = ''
  container.appendChild(ret)
}
