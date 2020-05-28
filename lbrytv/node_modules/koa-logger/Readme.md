
# koa-logger

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

 Development style logger middleware for [koa](https://github.com/koajs/koa).  Compatible with [request-received](https://github.com/cabinjs/request-received).

___Notice: `koa-logger@2` supports `koa@2`; if you want to use this module with `koa@1`, please use `koa-logger@1`.___

```
<-- GET /
--> GET / 200 835ms 746b
<-- GET /
--> GET / 200 960ms 1.9kb
<-- GET /users
--> GET /users 200 357ms 922b
<-- GET /users?page=2
--> GET /users?page=2 200 466ms 4.66kb
```

## Installation

```js
$ npm install koa-logger
```

## Example

```js
const logger = require('koa-logger')
const Koa = require('koa')

const app = new Koa()
app.use(logger())
```

## Notes

  Recommended that you `.use()` this middleware near the top
  to "wrap" all subsequent middleware.

## Use Custom Transporter

```js
const logger = require('koa-logger')
const Koa = require('koa')

const app = new Koa()
app.use(logger((str, args) => {
  // redirect koa logger to other output pipe
  // default is process.stdout(by console.log function)
}))
```
or
```js
app.use(logger({
  transporter: (str, args) => {
    // ...
  }
}))
```

  Param `str` is output string with ANSI Color, and you can get pure text with other modules like `strip-ansi`  
  Param `args` is a array by `[format, method, url, status, time, length]`

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa-logger.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-logger
[travis-image]: https://img.shields.io/travis/koajs/logger.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/logger
