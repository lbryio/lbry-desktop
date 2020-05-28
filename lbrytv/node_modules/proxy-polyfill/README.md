This is a polyfill for the `Proxy` object, part of ES6.
See the [MDN docs](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) or [Introducing ES2015 Proxies](https://developers.google.com/web/updates/2016/02/es2015-proxies) for more information on `Proxy` itself.

The polyfill supports just a limited subset of proxy 'traps', and comes with a caveat: it invokes [seal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) on any proxied object so that no additional properties can be defined.
Additionally, your objects' prototypes will be snapshotted at the time a proxy is created.
The properties of your objects can still change - you're just unable to define new ones. For example, proxying unrestricted dictionaries is not a good use-case for this polyfill.

Currently, the following traps are supported-

* get
* set
* apply
* construct

The `Proxy.revocable` [method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable) is also supported, but only for calls to the above traps.

This has no external dependencies.
Skip down to [usage](#usage) to get started.

# Example

The most compelling use case for `Proxy` is to provide change notifications.

```js
function observe(o, fn) {
  return new Proxy(o, {
    set(target, property, value) {
      fn(property, value);
      target[property] = value;
    },
  })
}

let x = {'name': 'BB-8'};
let p = observe(x, function(property, value) { console.info(property, value) });
p.name = 'BB-9';
// name BB-9
```

You can extend this to generate change notifications for anywhere in an object tree-

```js
function observe(o, fn) {
  function buildProxy(prefix, o) {
    return new Proxy(o, {
      set(target, property, value) {
        // same as before, but add prefix
        fn(prefix + property, value);
        target[property] = value;
      },
      get(target, property) {
        // return a new proxy if possible, add to prefix
        let out = target[property];
        if (out instanceof Object) {
          return buildProxy(prefix + property + '.', out);
        }
        return out;  // primitive, ignore
      },
    });
  }

  return buildProxy('', o);
}

let x = {'model': {name: 'Falcon'}};
let p = observe(x, function(property, value) { console.info(property, value) });
p.model.name = 'Commodore';
// model.name Commodore
```

## Adding new properties

The following line will fail (with a `TypeError` in strict mode) with the polyfill, as it's unable to intercept new properties-

```js
p.model.year = 2016;  // error in polyfill
```

However, you can replace the entire object at once - once you access it again, your code will see the proxied version.

```js
p.model = {name: 'Falcon', year: 2016};
// model Object {name: "Falcon", year: 2016}
```

# Usage

Include the JavaScript at the start of your page, or include it as a dependency to your build steps.
The source is in ES6, but the included, minified version is ES5.

## Installation

Available via NPM or Bower-

```bash
$ npm install proxy-polyfill
$ bower install proxy-polyfill
```

If this is imported as a Node module, it will polyfill the global namespace rather than returning the `Proxy` object.

## Supports

The polyfill supports browsers that implement the full [ES5 spec](http://kangax.github.io/compat-table/es5/), such as IE9+ and Safari 6+.
Firefox, Chrome and Edge support `Proxy` natively.

# Release

Compile code with [Closure Compiler](https://closure-compiler.appspot.com/home).

```
// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name proxy.min.js
// ==/ClosureCompiler==

// code here
```
