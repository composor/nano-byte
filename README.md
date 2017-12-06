# Nano-byte
A library for React-style functional components and virtual dom in 1KB.


Nano-byte is minimalistic. The core code when gzipped will be 656 bytes. If you go for the version with a virtual dom, it will be 1KB when gzipped.

Why
---

Size matters. More people access the Web from mobile devices than from the Desktop. For many millions of people, this is the only way they  access the Web. Mobile devices and connections are not always the best. In fact, many people have rather old mobile devices and live in areas with poor connectivity. Nano-byte loads faster than most images. This means your app can reach interactivity in record time, even on poor networks.

If you intend to build a PWA, one of your biggest concerns will be load time and time to interaction. Nano-byte can help you achieve those goals while providing powerful development patterns that were popularized by React.

The Goods
---------

Nano-byte lets you use JSX just like with React, but without the React restrictions. You use `class` instead of `className` and `for` instead of `htmlFor`. You use inline events, such as `onclick` without having to camel case them like with React. In fact, you use your properties and attributes like normal HTML. 

Because you're creating React-style functional components with JSX, you pass props from the parent to the children--passing data down. You can pass anything as a prop--a parent's function or property, so that children can access it.

Installation
------------

```bash
npm i -D nano-byte
```

Babel Setup
-----------

In order for Babel to know how to convert the JSX into virtual nodes, you'll need to let it know to use Nano-byte's `h` function. You have two options. Use a pragma in the file's where you have JSX or configure your project's `.babelrc` file.

Pragma
------

To use a pragma in your code, put this at the top of every file with JSX.

```javascript
import {h} from 'nano-byte'
import {render} from 'nano-byte/render-vdom'

/** @jsx h */

// JSX:
function Title({title}) {
  return (
    <h1>{title}</h1>
  )
}
```

Or you can configure your `.babelrc` file to do this for you automatically. Notice how we use the React JSX transformer with the pragma declaration.

```javascript
{
  "presets": [
    ["env", {"modules": false}]
  ],
  "plugins": [
    "external-helpers",
    ["transform-react-jsx", {"pragma": "h"}]
  ]
}
```

Babel Requirements
------------------

For Babel to transform JSX, you do need to have both Babel and the right plugins installed:

```bash
npm i -D babel-cli
npm i -D babel-plugin-external-helpers
npm i -D babel-plugin-transform-react-jsx
npm i -D babel-preset-env
```

Use whatever build setup you want: Webpack, Rollup, Gulp, etc.

Hello World
-----------

```javascript
import {h, render} from 'nano-byte'

// Define functional component:
function Hello({name}) {
  return (
    <h1>Hello, {name}!</h1>
  )
}

// Render it to the DOM:
render(<Hello name='World' />)
```

The above code when transpiled and bundled with Nano-byte will result in a file that is only 656 bytes. 

API
---

There are only two functions: `h` and `render`. `h` gets used by Babel to convert the JSX into virtual nodes that the `render` function can convert into actual nodes and inject into the DOM. `render` takes two arguments: a tag to render and a container to inject into. If no container is provided or the container provided does not exist, `render` will insert the tag into `document.body`. For a container you can provide a node, or a valid selector:

```javascript
// Render it to the header tag:
render(<Hello name='World' />, 'header')
```

Check out the example live on [Codepen](https://codepen.io/rbiggs/pen/380dc599ea8dd1304e7832f8b8d12e5c).

**Note:** When you render to a container, whatever was in it gets replaced with what you are rendering.

Complex Example
---------------

Here's an example of a list component with subcomponents. It passes data and event handlers down to the child components. We can add items and click on inidividual items to get an alert of their value.

```javascript
// Define list item component:
function ListItem({fruit, announce}) {
  return (
    <li onclick={(e) => announce(e)}>{fruit}</li>
  )
}

// Define list component.
// This will consume the list item component.
function List({fruits}) {
  // Event handlers:
  function announce(e) {
    alert(e.target.textContent)
  }

  function addItem() {
    const input = document.querySelector('#add-item__input')
    const value = input.value
    if (value) {
      fruits.push(value)
      render(<List fruits={fruits} />, 'section')
    } else {
      alert('Please provide a value before submitting!')
    }
  }

  return (
    <div>
      <h3>List of Stuff</h3>
      <p class='add-item'>
        <input id='add-item__input' type='text' placeholder='Add new item...' />
        <button onclick={() => addItem()}>Add</button>
      </p>
      <ul class='list'>
        {
          fruits.map(fruit => <ListItem {...{fruit, announce}}/>)
        }
      </ul>
    </div>
  )
}
// Data for list:
const fruits = ['Apples', 'Oranges', 'Bananas']

// Render the list:
render(<List fruits={fruits} />, 'section')
```

You can see this example live on [Codepen](https://codepen.io/rbiggs/pen/cd594ad6246abc9081bd4dae0e7992c9?editors=0110).

Virtual DOM
-----------

The previous examples used the smallest version of `nano-byte`. This simply replaces whatever is in the container every time you render the component. You can take a step up and use this with a virtual dom for more efficient renders with less layout thrashing. To do so, just change how you import the `render` function:


```javascript
// Normal import:
import {h, render} from 'nano-byte'

// Import with support for virtual-dom:
import {h} from 'nano-byte'
import {render} from 'nano-byte/render-vdom'
```

Even with the extra code for a virtual dom, Nano-byte will stay within the range of 1KB when gzipped.

**Note:** Unlike the plain `render` function, when you use the virtual dom version of `render` it will not replace what is already in a container. It will append to it. That means you can have a container with static HTML and render a dynamic function component into it. When you render the component again only its markup will be updated in the container, leaving static markup untouched.

Dynamic Attribute Values
------------------------

Because Nano-byte uses JSX, when you want to have a dynamic attribute value, you need to enclose that value in curly braces. Do not enclose that in quotes or the value will not get computed:

```javascript
// This will not work:
function ListItem({fruit, announce}) {
  return (
    <li onclick={(e) => announce(e)}>{fruit}</li>
  )
}
// This will not work because the value of `onlick` is quoted:
function ListItem({fruit, announce}) {
  return (
    <li onclick="{(e) => announce(e)}">{fruit}</li>
  )
}
```

This applies to attributes with partial updates as well. You'll need to have the entire value enclosed in curly braces and perform your interpolation:

```javascript
function Welcome({name}) {
  if (!name) name = 'anonymous'
  return (
    <p class={`welcome ${name === 'anonymous' ? 'anonymous' : 'name'}`}>Welcome, {name}</p>
  )
}
```

State Management
----------------

Since Nano-byte has no classes and is purely functional, all components are stateless. You can use Redux or Mobx to manage your component state. You could also use any event bus (`pubsub`) from NPM to enable communication between unrelated components.
