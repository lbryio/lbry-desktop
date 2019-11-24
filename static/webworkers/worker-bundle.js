!(function() {
  'use strict'
  const e = {
    32768: 'FILE',
    16384: 'DIR',
    40960: 'SYMBOLIC_LINK',
    49152: 'SOCKET',
    8192: 'CHARACTER_DEVICE',
    24576: 'BLOCK_DEVICE',
    4096: 'NAMED_PIPE',
  }
  class r {
    constructor(e) {
      ;(this._wasmModule = e),
        (this._runCode = e.runCode),
        (this._file = null),
        (this._passphrase = null)
    }
    open(e) {
      null !== this._file && (console.warn('Closing previous file'), this.close())
      const { promise: r, resolve: t, reject: n } = this._promiseHandles()
      this._file = e
      const o = new FileReader()
      return (o.onload = () => this._loadFile(o.result, t, n)), o.readAsArrayBuffer(e), r
    }
    close() {
      this._runCode.closeArchive(this._archive),
        this._wasmModule._free(this._filePtr),
        (this._file = null),
        (this._filePtr = null),
        (this._archive = null)
    }
    hasEncryptedData() {
      ;(this._archive = this._runCode.openArchive(
        this._filePtr,
        this._fileLength,
        this._passphrase
      )),
        this._runCode.getNextEntry(this._archive)
      const e = this._runCode.hasEncryptedEntries(this._archive)
      return 0 !== e && (e > 0 || null)
    }
    setPassphrase(e) {
      this._passphrase = e
    }
    *entries(r = !1, t = null) {
      let n
      for (
        this._archive = this._runCode.openArchive(
          this._filePtr,
          this._fileLength,
          this._passphrase
        );
        0 !== (n = this._runCode.getNextEntry(this._archive));

      ) {
        const o = {
          size: this._runCode.getEntrySize(n),
          path: this._runCode.getEntryName(n),
          type: e[this._runCode.getEntryType(n)],
          ref: n,
        }
        if ('FILE' === o.type) {
          let e = o.path.split('/')
          o.fileName = e[e.length - 1]
        }
        if (r && t !== o.path) this._runCode.skipEntry(this._archive)
        else {
          const e = this._runCode.getFileData(this._archive, o.size)
          if (e < 0) throw new Error(this._runCode.getError(this._archive))
          ;(o.fileData = this._wasmModule.HEAP8.slice(e, e + o.size)),
            this._wasmModule._free(e)
        }
        yield o
      }
    }
    _loadFile(e, r, t) {
      try {
        const n = new Uint8Array(e)
        ;(this._fileLength = n.length),
          (this._filePtr = this._runCode.malloc(this._fileLength)),
          this._wasmModule.HEAP8.set(n, this._filePtr),
          r()
      } catch (e) {
        t(e)
      }
    }
    _promiseHandles() {
      let e = null,
        r = null
      return {
        promise: new Promise((t, n) => {
          ;(e = t), (r = n)
        }),
        resolve: e,
        reject: r,
      }
    }
  }
  var t,
    n =
      ((t =
        'undefined' != typeof document && document.currentScript
          ? document.currentScript.src
          : void 0),
      function(e) {
        var r,
          n = void 0 !== (e = e || {}) ? e : {},
          o = {}
        for (r in n) n.hasOwnProperty(r) && (o[r] = n[r])
        ;(n.arguments = []),
          (n.thisProgram = './this.program'),
          (n.quit = function(e, r) {
            throw r
          }),
          (n.preRun = []),
          (n.postRun = [])
        var i,
          a,
          s = !1,
          u = !1
        ;(s = 'object' == typeof window),
          (u = 'function' == typeof importScripts),
          (i = 'object' == typeof process && 'function' == typeof require && !s && !u),
          (a = !s && !i && !u)
        var c,
          f,
          l = ''
        i
          ? ((l = __dirname + '/'),
            (n.read = function(e, r) {
              var t
              return (
                c || (c = require('fs')),
                f || (f = require('path')),
                (e = f.normalize(e)),
                (t = c.readFileSync(e)),
                r ? t : t.toString()
              )
            }),
            (n.readBinary = function(e) {
              var r = n.read(e, !0)
              return r.buffer || (r = new Uint8Array(r)), E(r.buffer), r
            }),
            process.argv.length > 1 &&
              (n.thisProgram = process.argv[1].replace(/\\/g, '/')),
            (n.arguments = process.argv.slice(2)),
            process.on('uncaughtException', function(e) {
              if (!(e instanceof qe)) throw e
            }),
            process.on('unhandledRejection', Ze),
            (n.quit = function(e) {
              process.exit(e)
            }),
            (n.inspect = function() {
              return '[Emscripten Module object]'
            }))
          : a
          ? ('undefined' != typeof read &&
              (n.read = function(e) {
                return read(e)
              }),
            (n.readBinary = function(e) {
              var r
              return 'function' == typeof readbuffer
                ? new Uint8Array(readbuffer(e))
                : (E('object' == typeof (r = read(e, 'binary'))), r)
            }),
            'undefined' != typeof scriptArgs
              ? (n.arguments = scriptArgs)
              : void 0 !== arguments && (n.arguments = arguments),
            'function' == typeof quit &&
              (n.quit = function(e) {
                quit(e)
              }))
          : (s || u) &&
            (u
              ? (l = self.location.href)
              : document.currentScript && (l = document.currentScript.src),
            t && (l = t),
            (l = 0 !== l.indexOf('blob:') ? l.substr(0, l.lastIndexOf('/') + 1) : ''),
            (n.read = function(e) {
              var r = new XMLHttpRequest()
              return r.open('GET', e, !1), r.send(null), r.responseText
            }),
            u &&
              (n.readBinary = function(e) {
                var r = new XMLHttpRequest()
                return (
                  r.open('GET', e, !1),
                  (r.responseType = 'arraybuffer'),
                  r.send(null),
                  new Uint8Array(r.response)
                )
              }),
            (n.readAsync = function(e, r, t) {
              var n = new XMLHttpRequest()
              n.open('GET', e, !0),
                (n.responseType = 'arraybuffer'),
                (n.onload = function() {
                  200 == n.status || (0 == n.status && n.response) ? r(n.response) : t()
                }),
                (n.onerror = t),
                n.send(null)
            }),
            (n.setWindowTitle = function(e) {
              document.title = e
            }))
        var d =
            n.print ||
            ('undefined' != typeof console
              ? console.log.bind(console)
              : 'undefined' != typeof print
              ? print
              : null),
          p =
            n.printErr ||
            ('undefined' != typeof printErr
              ? printErr
              : ('undefined' != typeof console && console.warn.bind(console)) || d)
        for (r in o) o.hasOwnProperty(r) && (n[r] = o[r])
        function m(e) {
          var r = M[q >> 2],
            t = (r + e + 15) & -16
          if (t <= Ae()) M[q >> 2] = t
          else if (!Re(t)) return 0
          return r
        }
        function h(e) {
          switch (e) {
            case 'i1':
            case 'i8':
              return 1
            case 'i16':
              return 2
            case 'i32':
              return 4
            case 'i64':
              return 8
            case 'float':
              return 4
            case 'double':
              return 8
            default:
              if ('*' === e[e.length - 1]) return 4
              if ('i' === e[0]) {
                var r = parseInt(e.substr(1))
                return (
                  E(r % 8 == 0, 'getNativeTypeSize invalid bits ' + r + ', type ' + e),
                  r / 8
                )
              }
              return 0
          }
        }
        o = void 0
        var v,
          w = {
            'f64-rem': function(e, r) {
              return e % r
            },
            debugger: function() {},
          }
        'object' != typeof WebAssembly && p('no native wasm support detected')
        var y = !1
        function E(e, r) {
          e || Ze('Assertion failed: ' + r)
        }
        function g(e) {
          var r = n['_' + e]
          return (
            E(r, 'Cannot call unknown function ' + e + ', make sure it is exported'), r
          )
        }
        function _(e, r, t, n, o) {
          var i = {
              string: function(e) {
                var r = 0
                if (null != e && 0 !== e) {
                  var t = 1 + (e.length << 2)
                  C(e, (r = je(t)), t)
                }
                return r
              },
              array: function(e) {
                var r,
                  t,
                  n = je(e.length)
                return (r = e), (t = n), R.set(r, t), n
              },
            },
            a = g(e),
            s = [],
            u = 0
          if (n)
            for (var c = 0; c < n.length; c++) {
              var f = i[t[c]]
              f ? (0 === u && (u = We()), (s[c] = f(n[c]))) : (s[c] = n[c])
            }
          var l = a.apply(null, s)
          return (
            (l = (function(e) {
              return 'string' === r ? I(e) : 'boolean' === r ? Boolean(e) : e
            })(l)),
            0 !== u && He(u),
            l
          )
        }
        function b(e, r, t, n) {
          switch (('*' === (t = t || 'i8').charAt(t.length - 1) && (t = 'i32'), t)) {
            case 'i1':
            case 'i8':
              R[e >> 0] = r
              break
            case 'i16':
              P[e >> 1] = r
              break
            case 'i32':
              M[e >> 2] = r
              break
            case 'i64':
              ;(tempI64 = [
                r >>> 0,
                ((tempDouble = r),
                +J(tempDouble) >= 1
                  ? tempDouble > 0
                    ? (0 | re(+ee(tempDouble / 4294967296), 4294967295)) >>> 0
                    : ~~+Q((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                  : 0),
              ]),
                (M[e >> 2] = tempI64[0]),
                (M[(e + 4) >> 2] = tempI64[1])
              break
            case 'float':
              B[e >> 2] = r
              break
            case 'double':
              N[e >> 3] = r
              break
            default:
              Ze('invalid type for setValue: ' + t)
          }
        }
        var k = 0,
          D = 3
        function S(e, r, t, n) {
          var o, i
          'number' == typeof e ? ((o = !0), (i = e)) : ((o = !1), (i = e.length))
          var a,
            s = 'string' == typeof r ? r : null
          if (((a = t == D ? n : [Ue, je, m][t](Math.max(i, s ? 1 : r.length))), o)) {
            var u
            for (n = a, E(0 == (3 & a)), u = a + (-4 & i); n < u; n += 4) M[n >> 2] = 0
            for (u = a + i; n < u; ) R[n++ >> 0] = 0
            return a
          }
          if ('i8' === s)
            return e.subarray || e.slice ? T.set(e, a) : T.set(new Uint8Array(e), a), a
          for (var c, f, l, d = 0; d < i; ) {
            var p = e[d]
            0 !== (c = s || r[d])
              ? ('i64' == c && (c = 'i32'),
                b(a + d, p, c),
                l !== c && ((f = h(c)), (l = c)),
                (d += f))
              : d++
          }
          return a
        }
        function F(e) {
          return $ ? Ue(e) : m(e)
        }
        var A,
          R,
          T,
          P,
          M,
          B,
          N,
          O = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0
        function x(e, r, t) {
          for (var n = r + t, o = r; e[o] && !(o >= n); ) ++o
          if (o - r > 16 && e.subarray && O) return O.decode(e.subarray(r, o))
          for (var i = ''; r < o; ) {
            var a = e[r++]
            if (128 & a) {
              var s = 63 & e[r++]
              if (192 != (224 & a)) {
                var u = 63 & e[r++]
                if (
                  (a =
                    224 == (240 & a)
                      ? ((15 & a) << 12) | (s << 6) | u
                      : ((7 & a) << 18) | (s << 12) | (u << 6) | (63 & e[r++])) < 65536
                )
                  i += String.fromCharCode(a)
                else {
                  var c = a - 65536
                  i += String.fromCharCode(55296 | (c >> 10), 56320 | (1023 & c))
                }
              } else i += String.fromCharCode(((31 & a) << 6) | s)
            } else i += String.fromCharCode(a)
          }
          return i
        }
        function I(e, r) {
          return e ? x(T, e, r) : ''
        }
        function z(e, r, t, n) {
          if (!(n > 0)) return 0
          for (var o = t, i = t + n - 1, a = 0; a < e.length; ++a) {
            var s = e.charCodeAt(a)
            if (
              (s >= 55296 &&
                s <= 57343 &&
                (s = (65536 + ((1023 & s) << 10)) | (1023 & e.charCodeAt(++a))),
              s <= 127)
            ) {
              if (t >= i) break
              r[t++] = s
            } else if (s <= 2047) {
              if (t + 1 >= i) break
              ;(r[t++] = 192 | (s >> 6)), (r[t++] = 128 | (63 & s))
            } else if (s <= 65535) {
              if (t + 2 >= i) break
              ;(r[t++] = 224 | (s >> 12)),
                (r[t++] = 128 | ((s >> 6) & 63)),
                (r[t++] = 128 | (63 & s))
            } else {
              if (t + 3 >= i) break
              ;(r[t++] = 240 | (s >> 18)),
                (r[t++] = 128 | ((s >> 12) & 63)),
                (r[t++] = 128 | ((s >> 6) & 63)),
                (r[t++] = 128 | (63 & s))
            }
          }
          return (r[t] = 0), t - o
        }
        function C(e, r, t) {
          return z(e, T, r, t)
        }
        function L(e) {
          for (var r = 0, t = 0; t < e.length; ++t) {
            var n = e.charCodeAt(t)
            n >= 55296 &&
              n <= 57343 &&
              (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++t))),
              n <= 127 ? ++r : (r += n <= 2047 ? 2 : n <= 65535 ? 3 : 4)
          }
          return r
        }
        function U(e, r, t) {
          for (var n = 0; n < e.length; ++n) R[r++ >> 0] = e.charCodeAt(n)
          t || (R[r >> 0] = 0)
        }
        function j() {
          var e = (function() {
            var e = new Error()
            if (!e.stack) {
              try {
                throw new Error(0)
              } catch (r) {
                e = r
              }
              if (!e.stack) return '(no stack trace available)'
            }
            return e.stack.toString()
          })()
          return (
            n.extraStackTrace && (e += '\n' + n.extraStackTrace()),
            e.replace(/__Z[\w\d_]+/g, function(e) {
              var r = e
              return e === r ? e : r + ' [' + e + ']'
            })
          )
        }
        function H(e, r) {
          return e % r > 0 && (e += r - (e % r)), e
        }
        function W() {
          ;(n.HEAP8 = R = new Int8Array(A)),
            (n.HEAP16 = P = new Int16Array(A)),
            (n.HEAP32 = M = new Int32Array(A)),
            (n.HEAPU8 = T = new Uint8Array(A)),
            (n.HEAPU16 = new Uint16Array(A)),
            (n.HEAPU32 = new Uint32Array(A)),
            (n.HEAPF32 = B = new Float32Array(A)),
            (n.HEAPF64 = N = new Float64Array(A))
        }
        'undefined' != typeof TextDecoder && new TextDecoder('utf-16le')
        var q = 277552,
          K = n.TOTAL_MEMORY || 16777216
        function Z(e) {
          for (; e.length > 0; ) {
            var r = e.shift()
            if ('function' != typeof r) {
              var t = r.func
              'number' == typeof t
                ? void 0 === r.arg
                  ? n.dynCall_v(t)
                  : n.dynCall_vi(t, r.arg)
                : t(void 0 === r.arg ? null : r.arg)
            } else r()
          }
        }
        K < 5242880 &&
          p(
            'TOTAL_MEMORY should be larger than TOTAL_STACK, was ' +
              K +
              '! (TOTAL_STACK=5242880)'
          ),
          n.buffer
            ? (A = n.buffer)
            : 'object' == typeof WebAssembly && 'function' == typeof WebAssembly.Memory
            ? ((v = new WebAssembly.Memory({ initial: K / 65536 })), (A = v.buffer))
            : (A = new ArrayBuffer(K)),
          W(),
          (M[q >> 2] = 5520464)
        var V = [],
          X = [],
          Y = [],
          G = [],
          $ = !1,
          J = Math.abs,
          Q = Math.ceil,
          ee = Math.floor,
          re = Math.min,
          te = 0,
          ne = null,
          oe = null
        function ie(e) {
          te++, n.monitorRunDependencies && n.monitorRunDependencies(te)
        }
        function ae(e) {
          if (
            (te--,
            n.monitorRunDependencies && n.monitorRunDependencies(te),
            0 == te && (null !== ne && (clearInterval(ne), (ne = null)), oe))
          ) {
            var r = oe
            ;(oe = null), r()
          }
        }
        ;(n.preloadedImages = {}), (n.preloadedAudios = {})
        var se = 'data:application/octet-stream;base64,'
        function ue(e) {
          return String.prototype.startsWith ? e.startsWith(se) : 0 === e.indexOf(se)
        }
        var ce,
          fe = 'libarchive.wasm'
        function le() {
          try {
            if (n.wasmBinary) return new Uint8Array(n.wasmBinary)
            if (n.readBinary) return n.readBinary(fe)
            throw 'both async and sync fetching of the wasm failed'
          } catch (e) {
            Ze(e)
          }
        }
        function de(e) {
          var r = {
            env: e,
            global: { NaN: NaN, Infinity: 1 / 0 },
            'global.Math': Math,
            asm2wasm: w,
          }
          function t(e, r) {
            var t = e.exports
            ;(n.asm = t), ae()
          }
          if ((ie(), n.instantiateWasm))
            try {
              return n.instantiateWasm(r, t)
            } catch (e) {
              return p('Module.instantiateWasm callback failed with error: ' + e), !1
            }
          function o(e) {
            t(e.instance)
          }
          function i(e) {
            ;(n.wasmBinary || (!s && !u) || 'function' != typeof fetch
              ? new Promise(function(e, r) {
                  e(le())
                })
              : fetch(fe, { credentials: 'same-origin' })
                  .then(function(e) {
                    if (!e.ok) throw "failed to load wasm binary file at '" + fe + "'"
                    return e.arrayBuffer()
                  })
                  .catch(function() {
                    return le()
                  })
            )
              .then(function(e) {
                return WebAssembly.instantiate(e, r)
              })
              .then(e, function(e) {
                p('failed to asynchronously prepare wasm: ' + e), Ze(e)
              })
          }
          return (
            n.wasmBinary ||
            'function' != typeof WebAssembly.instantiateStreaming ||
            ue(fe) ||
            'function' != typeof fetch
              ? i(o)
              : WebAssembly.instantiateStreaming(
                  fetch(fe, { credentials: 'same-origin' }),
                  r
                ).then(o, function(e) {
                  p('wasm streaming compile failed: ' + e),
                    p('falling back to ArrayBuffer instantiation'),
                    i(o)
                }),
            {}
          )
        }
        ue(fe) || ((ce = fe), (fe = n.locateFile ? n.locateFile(ce, l) : l + ce)),
          (n.asm = function(e, r, t) {
            return (
              (r.memory = v),
              (r.table = new WebAssembly.Table({
                initial: 507,
                maximum: 507,
                element: 'anyfunc',
              })),
              (r.__memory_base = 1024),
              (r.__table_base = 0),
              de(r)
            )
          }),
          X.push({
            func: function() {
              Ie()
            },
          })
        var pe = {},
          me = {
            splitPath: function(e) {
              return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                .exec(e)
                .slice(1)
            },
            normalizeArray: function(e, r) {
              for (var t = 0, n = e.length - 1; n >= 0; n--) {
                var o = e[n]
                '.' === o
                  ? e.splice(n, 1)
                  : '..' === o
                  ? (e.splice(n, 1), t++)
                  : t && (e.splice(n, 1), t--)
              }
              if (r) for (; t; t--) e.unshift('..')
              return e
            },
            normalize: function(e) {
              var r = '/' === e.charAt(0),
                t = '/' === e.substr(-1)
              return (
                (e = me
                  .normalizeArray(
                    e.split('/').filter(function(e) {
                      return !!e
                    }),
                    !r
                  )
                  .join('/')) ||
                  r ||
                  (e = '.'),
                e && t && (e += '/'),
                (r ? '/' : '') + e
              )
            },
            dirname: function(e) {
              var r = me.splitPath(e),
                t = r[0],
                n = r[1]
              return t || n ? (n && (n = n.substr(0, n.length - 1)), t + n) : '.'
            },
            basename: function(e) {
              if ('/' === e) return '/'
              var r = e.lastIndexOf('/')
              return -1 === r ? e : e.substr(r + 1)
            },
            extname: function(e) {
              return me.splitPath(e)[3]
            },
            join: function() {
              var e = Array.prototype.slice.call(arguments, 0)
              return me.normalize(e.join('/'))
            },
            join2: function(e, r) {
              return me.normalize(e + '/' + r)
            },
          }
        function he(e) {
          return n.___errno_location && (M[n.___errno_location() >> 2] = e), e
        }
        var ve = {
            resolve: function() {
              for (var e = '', r = !1, t = arguments.length - 1; t >= -1 && !r; t--) {
                var n = t >= 0 ? arguments[t] : be.cwd()
                if ('string' != typeof n)
                  throw new TypeError('Arguments to path.resolve must be strings')
                if (!n) return ''
                ;(e = n + '/' + e), (r = '/' === n.charAt(0))
              }
              return (
                (r ? '/' : '') +
                  (e = me
                    .normalizeArray(
                      e.split('/').filter(function(e) {
                        return !!e
                      }),
                      !r
                    )
                    .join('/')) || '.'
              )
            },
            relative: function(e, r) {
              function t(e) {
                for (var r = 0; r < e.length && '' === e[r]; r++);
                for (var t = e.length - 1; t >= 0 && '' === e[t]; t--);
                return r > t ? [] : e.slice(r, t - r + 1)
              }
              ;(e = ve.resolve(e).substr(1)), (r = ve.resolve(r).substr(1))
              for (
                var n = t(e.split('/')),
                  o = t(r.split('/')),
                  i = Math.min(n.length, o.length),
                  a = i,
                  s = 0;
                s < i;
                s++
              )
                if (n[s] !== o[s]) {
                  a = s
                  break
                }
              var u = []
              for (s = a; s < n.length; s++) u.push('..')
              return (u = u.concat(o.slice(a))).join('/')
            },
          },
          we = {
            ttys: [],
            init: function() {},
            shutdown: function() {},
            register: function(e, r) {
              ;(we.ttys[e] = { input: [], output: [], ops: r }),
                be.registerDevice(e, we.stream_ops)
            },
            stream_ops: {
              open: function(e) {
                var r = we.ttys[e.node.rdev]
                if (!r) throw new be.ErrnoError(19)
                ;(e.tty = r), (e.seekable = !1)
              },
              close: function(e) {
                e.tty.ops.flush(e.tty)
              },
              flush: function(e) {
                e.tty.ops.flush(e.tty)
              },
              read: function(e, r, t, n, o) {
                if (!e.tty || !e.tty.ops.get_char) throw new be.ErrnoError(6)
                for (var i = 0, a = 0; a < n; a++) {
                  var s
                  try {
                    s = e.tty.ops.get_char(e.tty)
                  } catch (e) {
                    throw new be.ErrnoError(5)
                  }
                  if (void 0 === s && 0 === i) throw new be.ErrnoError(11)
                  if (null == s) break
                  i++, (r[t + a] = s)
                }
                return i && (e.node.timestamp = Date.now()), i
              },
              write: function(e, r, t, n, o) {
                if (!e.tty || !e.tty.ops.put_char) throw new be.ErrnoError(6)
                try {
                  for (var i = 0; i < n; i++) e.tty.ops.put_char(e.tty, r[t + i])
                } catch (e) {
                  throw new be.ErrnoError(5)
                }
                return n && (e.node.timestamp = Date.now()), i
              },
            },
            default_tty_ops: {
              get_char: function(e) {
                if (!e.input.length) {
                  var r = null
                  if (i) {
                    var t = new Buffer(256),
                      n = 0,
                      o = 'win32' != process.platform,
                      a = process.stdin.fd
                    if (o) {
                      var s = !1
                      try {
                        ;(a = Me.openSync('/dev/stdin', 'r')), (s = !0)
                      } catch (e) {}
                    }
                    try {
                      n = Me.readSync(a, t, 0, 256, null)
                    } catch (e) {
                      if (-1 == e.toString().indexOf('EOF')) throw e
                      n = 0
                    }
                    s && Me.closeSync(a),
                      (r = n > 0 ? t.slice(0, n).toString('utf-8') : null)
                  } else
                    'undefined' != typeof window && 'function' == typeof window.prompt
                      ? null !== (r = window.prompt('Input: ')) && (r += '\n')
                      : 'function' == typeof readline &&
                        null !== (r = readline()) &&
                        (r += '\n')
                  if (!r) return null
                  e.input = Ne(r, !0)
                }
                return e.input.shift()
              },
              put_char: function(e, r) {
                null === r || 10 === r
                  ? (d(x(e.output, 0)), (e.output = []))
                  : 0 != r && e.output.push(r)
              },
              flush: function(e) {
                e.output && e.output.length > 0 && (d(x(e.output, 0)), (e.output = []))
              },
            },
            default_tty1_ops: {
              put_char: function(e, r) {
                null === r || 10 === r
                  ? (p(x(e.output, 0)), (e.output = []))
                  : 0 != r && e.output.push(r)
              },
              flush: function(e) {
                e.output && e.output.length > 0 && (p(x(e.output, 0)), (e.output = []))
              },
            },
          },
          ye = {
            ops_table: null,
            mount: function(e) {
              return ye.createNode(null, '/', 16895, 0)
            },
            createNode: function(e, r, t, n) {
              if (be.isBlkdev(t) || be.isFIFO(t)) throw new be.ErrnoError(1)
              ye.ops_table ||
                (ye.ops_table = {
                  dir: {
                    node: {
                      getattr: ye.node_ops.getattr,
                      setattr: ye.node_ops.setattr,
                      lookup: ye.node_ops.lookup,
                      mknod: ye.node_ops.mknod,
                      rename: ye.node_ops.rename,
                      unlink: ye.node_ops.unlink,
                      rmdir: ye.node_ops.rmdir,
                      readdir: ye.node_ops.readdir,
                      symlink: ye.node_ops.symlink,
                    },
                    stream: { llseek: ye.stream_ops.llseek },
                  },
                  file: {
                    node: { getattr: ye.node_ops.getattr, setattr: ye.node_ops.setattr },
                    stream: {
                      llseek: ye.stream_ops.llseek,
                      read: ye.stream_ops.read,
                      write: ye.stream_ops.write,
                      allocate: ye.stream_ops.allocate,
                      mmap: ye.stream_ops.mmap,
                      msync: ye.stream_ops.msync,
                    },
                  },
                  link: {
                    node: {
                      getattr: ye.node_ops.getattr,
                      setattr: ye.node_ops.setattr,
                      readlink: ye.node_ops.readlink,
                    },
                    stream: {},
                  },
                  chrdev: {
                    node: { getattr: ye.node_ops.getattr, setattr: ye.node_ops.setattr },
                    stream: be.chrdev_stream_ops,
                  },
                })
              var o = be.createNode(e, r, t, n)
              return (
                be.isDir(o.mode)
                  ? ((o.node_ops = ye.ops_table.dir.node),
                    (o.stream_ops = ye.ops_table.dir.stream),
                    (o.contents = {}))
                  : be.isFile(o.mode)
                  ? ((o.node_ops = ye.ops_table.file.node),
                    (o.stream_ops = ye.ops_table.file.stream),
                    (o.usedBytes = 0),
                    (o.contents = null))
                  : be.isLink(o.mode)
                  ? ((o.node_ops = ye.ops_table.link.node),
                    (o.stream_ops = ye.ops_table.link.stream))
                  : be.isChrdev(o.mode) &&
                    ((o.node_ops = ye.ops_table.chrdev.node),
                    (o.stream_ops = ye.ops_table.chrdev.stream)),
                (o.timestamp = Date.now()),
                e && (e.contents[r] = o),
                o
              )
            },
            getFileDataAsRegularArray: function(e) {
              if (e.contents && e.contents.subarray) {
                for (var r = [], t = 0; t < e.usedBytes; ++t) r.push(e.contents[t])
                return r
              }
              return e.contents
            },
            getFileDataAsTypedArray: function(e) {
              return e.contents
                ? e.contents.subarray
                  ? e.contents.subarray(0, e.usedBytes)
                  : new Uint8Array(e.contents)
                : new Uint8Array()
            },
            expandFileStorage: function(e, r) {
              var t = e.contents ? e.contents.length : 0
              if (!(t >= r)) {
                ;(r = Math.max(r, (t * (t < 1048576 ? 2 : 1.125)) | 0)),
                  0 != t && (r = Math.max(r, 256))
                var n = e.contents
                ;(e.contents = new Uint8Array(r)),
                  e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0)
              }
            },
            resizeFileStorage: function(e, r) {
              if (e.usedBytes != r) {
                if (0 == r) return (e.contents = null), void (e.usedBytes = 0)
                if (!e.contents || e.contents.subarray) {
                  var t = e.contents
                  return (
                    (e.contents = new Uint8Array(new ArrayBuffer(r))),
                    t && e.contents.set(t.subarray(0, Math.min(r, e.usedBytes))),
                    void (e.usedBytes = r)
                  )
                }
                if ((e.contents || (e.contents = []), e.contents.length > r))
                  e.contents.length = r
                else for (; e.contents.length < r; ) e.contents.push(0)
                e.usedBytes = r
              }
            },
            node_ops: {
              getattr: function(e) {
                var r = {}
                return (
                  (r.dev = be.isChrdev(e.mode) ? e.id : 1),
                  (r.ino = e.id),
                  (r.mode = e.mode),
                  (r.nlink = 1),
                  (r.uid = 0),
                  (r.gid = 0),
                  (r.rdev = e.rdev),
                  be.isDir(e.mode)
                    ? (r.size = 4096)
                    : be.isFile(e.mode)
                    ? (r.size = e.usedBytes)
                    : be.isLink(e.mode)
                    ? (r.size = e.link.length)
                    : (r.size = 0),
                  (r.atime = new Date(e.timestamp)),
                  (r.mtime = new Date(e.timestamp)),
                  (r.ctime = new Date(e.timestamp)),
                  (r.blksize = 4096),
                  (r.blocks = Math.ceil(r.size / r.blksize)),
                  r
                )
              },
              setattr: function(e, r) {
                void 0 !== r.mode && (e.mode = r.mode),
                  void 0 !== r.timestamp && (e.timestamp = r.timestamp),
                  void 0 !== r.size && ye.resizeFileStorage(e, r.size)
              },
              lookup: function(e, r) {
                throw be.genericErrors[2]
              },
              mknod: function(e, r, t, n) {
                return ye.createNode(e, r, t, n)
              },
              rename: function(e, r, t) {
                if (be.isDir(e.mode)) {
                  var n
                  try {
                    n = be.lookupNode(r, t)
                  } catch (e) {}
                  if (n) for (var o in n.contents) throw new be.ErrnoError(39)
                }
                delete e.parent.contents[e.name],
                  (e.name = t),
                  (r.contents[t] = e),
                  (e.parent = r)
              },
              unlink: function(e, r) {
                delete e.contents[r]
              },
              rmdir: function(e, r) {
                var t = be.lookupNode(e, r)
                for (var n in t.contents) throw new be.ErrnoError(39)
                delete e.contents[r]
              },
              readdir: function(e) {
                var r = ['.', '..']
                for (var t in e.contents) e.contents.hasOwnProperty(t) && r.push(t)
                return r
              },
              symlink: function(e, r, t) {
                var n = ye.createNode(e, r, 41471, 0)
                return (n.link = t), n
              },
              readlink: function(e) {
                if (!be.isLink(e.mode)) throw new be.ErrnoError(22)
                return e.link
              },
            },
            stream_ops: {
              read: function(e, r, t, n, o) {
                var i = e.node.contents
                if (o >= e.node.usedBytes) return 0
                var a = Math.min(e.node.usedBytes - o, n)
                if (a > 8 && i.subarray) r.set(i.subarray(o, o + a), t)
                else for (var s = 0; s < a; s++) r[t + s] = i[o + s]
                return a
              },
              write: function(e, r, t, n, o, i) {
                if (!n) return 0
                var a = e.node
                if (
                  ((a.timestamp = Date.now()),
                  r.subarray && (!a.contents || a.contents.subarray))
                ) {
                  if (0 === a.usedBytes && 0 === o)
                    return (
                      (a.contents = new Uint8Array(r.subarray(t, t + n))),
                      (a.usedBytes = n),
                      n
                    )
                  if (o + n <= a.usedBytes)
                    return a.contents.set(r.subarray(t, t + n), o), n
                }
                if ((ye.expandFileStorage(a, o + n), a.contents.subarray && r.subarray))
                  a.contents.set(r.subarray(t, t + n), o)
                else for (var s = 0; s < n; s++) a.contents[o + s] = r[t + s]
                return (a.usedBytes = Math.max(a.usedBytes, o + n)), n
              },
              llseek: function(e, r, t) {
                var n = r
                if (
                  (1 === t
                    ? (n += e.position)
                    : 2 === t && be.isFile(e.node.mode) && (n += e.node.usedBytes),
                  n < 0)
                )
                  throw new be.ErrnoError(22)
                return n
              },
              allocate: function(e, r, t) {
                ye.expandFileStorage(e.node, r + t),
                  (e.node.usedBytes = Math.max(e.node.usedBytes, r + t))
              },
              mmap: function(e, r, t, n, o, i, a) {
                if (!be.isFile(e.node.mode)) throw new be.ErrnoError(19)
                var s,
                  u,
                  c = e.node.contents
                if (2 & a || (c.buffer !== r && c.buffer !== r.buffer)) {
                  if (
                    ((o > 0 || o + n < e.node.usedBytes) &&
                      (c = c.subarray
                        ? c.subarray(o, o + n)
                        : Array.prototype.slice.call(c, o, o + n)),
                    (u = !0),
                    !(s = Ue(n)))
                  )
                    throw new be.ErrnoError(12)
                  r.set(c, s)
                } else (u = !1), (s = c.byteOffset)
                return { ptr: s, allocated: u }
              },
              msync: function(e, r, t, n, o) {
                if (!be.isFile(e.node.mode)) throw new be.ErrnoError(19)
                return 2 & o ? 0 : (ye.stream_ops.write(e, r, 0, n, t, !1), 0)
              },
            },
          },
          Ee = {
            dbs: {},
            indexedDB: function() {
              if ('undefined' != typeof indexedDB) return indexedDB
              var e = null
              return (
                'object' == typeof window &&
                  (e =
                    window.indexedDB ||
                    window.mozIndexedDB ||
                    window.webkitIndexedDB ||
                    window.msIndexedDB),
                E(e, 'IDBFS used, but indexedDB not supported'),
                e
              )
            },
            DB_VERSION: 21,
            DB_STORE_NAME: 'FILE_DATA',
            mount: function(e) {
              return ye.mount.apply(null, arguments)
            },
            syncfs: function(e, r, t) {
              Ee.getLocalSet(e, function(n, o) {
                if (n) return t(n)
                Ee.getRemoteSet(e, function(e, n) {
                  if (e) return t(e)
                  var i = r ? n : o,
                    a = r ? o : n
                  Ee.reconcile(i, a, t)
                })
              })
            },
            getDB: function(e, r) {
              var t,
                n = Ee.dbs[e]
              if (n) return r(null, n)
              try {
                t = Ee.indexedDB().open(e, Ee.DB_VERSION)
              } catch (e) {
                return r(e)
              }
              if (!t) return r('Unable to connect to IndexedDB')
              ;(t.onupgradeneeded = function(e) {
                var r,
                  t = e.target.result,
                  n = e.target.transaction
                ;(r = t.objectStoreNames.contains(Ee.DB_STORE_NAME)
                  ? n.objectStore(Ee.DB_STORE_NAME)
                  : t.createObjectStore(Ee.DB_STORE_NAME)).indexNames.contains(
                  'timestamp'
                ) || r.createIndex('timestamp', 'timestamp', { unique: !1 })
              }),
                (t.onsuccess = function() {
                  ;(n = t.result), (Ee.dbs[e] = n), r(null, n)
                }),
                (t.onerror = function(e) {
                  r(this.error), e.preventDefault()
                })
            },
            getLocalSet: function(e, r) {
              var t = {}
              function n(e) {
                return '.' !== e && '..' !== e
              }
              function o(e) {
                return function(r) {
                  return me.join2(e, r)
                }
              }
              for (
                var i = be
                  .readdir(e.mountpoint)
                  .filter(n)
                  .map(o(e.mountpoint));
                i.length;

              ) {
                var a,
                  s = i.pop()
                try {
                  a = be.stat(s)
                } catch (e) {
                  return r(e)
                }
                be.isDir(a.mode) &&
                  i.push.apply(
                    i,
                    be
                      .readdir(s)
                      .filter(n)
                      .map(o(s))
                  ),
                  (t[s] = { timestamp: a.mtime })
              }
              return r(null, { type: 'local', entries: t })
            },
            getRemoteSet: function(e, r) {
              var t = {}
              Ee.getDB(e.mountpoint, function(e, n) {
                if (e) return r(e)
                try {
                  var o = n.transaction([Ee.DB_STORE_NAME], 'readonly')
                  ;(o.onerror = function(e) {
                    r(this.error), e.preventDefault()
                  }),
                    (o
                      .objectStore(Ee.DB_STORE_NAME)
                      .index('timestamp')
                      .openKeyCursor().onsuccess = function(e) {
                      var o = e.target.result
                      if (!o) return r(null, { type: 'remote', db: n, entries: t })
                      ;(t[o.primaryKey] = { timestamp: o.key }), o.continue()
                    })
                } catch (e) {
                  return r(e)
                }
              })
            },
            loadLocalEntry: function(e, r) {
              var t, n
              try {
                ;(n = be.lookupPath(e).node), (t = be.stat(e))
              } catch (e) {
                return r(e)
              }
              return be.isDir(t.mode)
                ? r(null, { timestamp: t.mtime, mode: t.mode })
                : be.isFile(t.mode)
                ? ((n.contents = ye.getFileDataAsTypedArray(n)),
                  r(null, { timestamp: t.mtime, mode: t.mode, contents: n.contents }))
                : r(new Error('node type not supported'))
            },
            storeLocalEntry: function(e, r, t) {
              try {
                if (be.isDir(r.mode)) be.mkdir(e, r.mode)
                else {
                  if (!be.isFile(r.mode)) return t(new Error('node type not supported'))
                  be.writeFile(e, r.contents, { canOwn: !0 })
                }
                be.chmod(e, r.mode), be.utime(e, r.timestamp, r.timestamp)
              } catch (e) {
                return t(e)
              }
              t(null)
            },
            removeLocalEntry: function(e, r) {
              try {
                be.lookupPath(e)
                var t = be.stat(e)
                be.isDir(t.mode) ? be.rmdir(e) : be.isFile(t.mode) && be.unlink(e)
              } catch (e) {
                return r(e)
              }
              r(null)
            },
            loadRemoteEntry: function(e, r, t) {
              var n = e.get(r)
              ;(n.onsuccess = function(e) {
                t(null, e.target.result)
              }),
                (n.onerror = function(e) {
                  t(this.error), e.preventDefault()
                })
            },
            storeRemoteEntry: function(e, r, t, n) {
              var o = e.put(t, r)
              ;(o.onsuccess = function() {
                n(null)
              }),
                (o.onerror = function(e) {
                  n(this.error), e.preventDefault()
                })
            },
            removeRemoteEntry: function(e, r, t) {
              var n = e.delete(r)
              ;(n.onsuccess = function() {
                t(null)
              }),
                (n.onerror = function(e) {
                  t(this.error), e.preventDefault()
                })
            },
            reconcile: function(e, r, t) {
              var n = 0,
                o = []
              Object.keys(e.entries).forEach(function(t) {
                var i = e.entries[t],
                  a = r.entries[t]
                ;(!a || i.timestamp > a.timestamp) && (o.push(t), n++)
              })
              var i = []
              if (
                (Object.keys(r.entries).forEach(function(t) {
                  r.entries[t], e.entries[t] || (i.push(t), n++)
                }),
                !n)
              )
                return t(null)
              var a = 0,
                s = ('remote' === e.type ? e.db : r.db).transaction(
                  [Ee.DB_STORE_NAME],
                  'readwrite'
                ),
                u = s.objectStore(Ee.DB_STORE_NAME)
              function c(e) {
                return e
                  ? c.errored
                    ? void 0
                    : ((c.errored = !0), t(e))
                  : ++a >= n
                  ? t(null)
                  : void 0
              }
              ;(s.onerror = function(e) {
                c(this.error), e.preventDefault()
              }),
                o.sort().forEach(function(e) {
                  'local' === r.type
                    ? Ee.loadRemoteEntry(u, e, function(r, t) {
                        if (r) return c(r)
                        Ee.storeLocalEntry(e, t, c)
                      })
                    : Ee.loadLocalEntry(e, function(r, t) {
                        if (r) return c(r)
                        Ee.storeRemoteEntry(u, e, t, c)
                      })
                }),
                i
                  .sort()
                  .reverse()
                  .forEach(function(e) {
                    'local' === r.type
                      ? Ee.removeLocalEntry(e, c)
                      : Ee.removeRemoteEntry(u, e, c)
                  })
            },
          },
          ge = {
            isWindows: !1,
            staticInit: function() {
              ge.isWindows = !!process.platform.match(/^win/)
              var e = process.binding('constants')
              e.fs && (e = e.fs),
                (ge.flagsForNodeMap = {
                  1024: e.O_APPEND,
                  64: e.O_CREAT,
                  128: e.O_EXCL,
                  0: e.O_RDONLY,
                  2: e.O_RDWR,
                  4096: e.O_SYNC,
                  512: e.O_TRUNC,
                  1: e.O_WRONLY,
                })
            },
            bufferFrom: function(e) {
              return Buffer.alloc ? Buffer.from(e) : new Buffer(e)
            },
            mount: function(e) {
              return E(i), ge.createNode(null, '/', ge.getMode(e.opts.root), 0)
            },
            createNode: function(e, r, t, n) {
              if (!be.isDir(t) && !be.isFile(t) && !be.isLink(t))
                throw new be.ErrnoError(22)
              var o = be.createNode(e, r, t)
              return (o.node_ops = ge.node_ops), (o.stream_ops = ge.stream_ops), o
            },
            getMode: function(e) {
              var r
              try {
                ;(r = Me.lstatSync(e)),
                  ge.isWindows && (r.mode = r.mode | ((292 & r.mode) >> 2))
              } catch (e) {
                if (!e.code) throw e
                throw new be.ErrnoError(-e.errno)
              }
              return r.mode
            },
            realPath: function(e) {
              for (var r = []; e.parent !== e; ) r.push(e.name), (e = e.parent)
              return r.push(e.mount.opts.root), r.reverse(), me.join.apply(null, r)
            },
            flagsForNode: function(e) {
              ;(e &= -2097153), (e &= -2049), (e &= -32769), (e &= -524289)
              var r = 0
              for (var t in ge.flagsForNodeMap)
                e & t && ((r |= ge.flagsForNodeMap[t]), (e ^= t))
              if (e) throw new be.ErrnoError(22)
              return r
            },
            node_ops: {
              getattr: function(e) {
                var r,
                  t = ge.realPath(e)
                try {
                  r = Me.lstatSync(t)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
                return (
                  ge.isWindows && !r.blksize && (r.blksize = 4096),
                  ge.isWindows &&
                    !r.blocks &&
                    (r.blocks = ((r.size + r.blksize - 1) / r.blksize) | 0),
                  {
                    dev: r.dev,
                    ino: r.ino,
                    mode: r.mode,
                    nlink: r.nlink,
                    uid: r.uid,
                    gid: r.gid,
                    rdev: r.rdev,
                    size: r.size,
                    atime: r.atime,
                    mtime: r.mtime,
                    ctime: r.ctime,
                    blksize: r.blksize,
                    blocks: r.blocks,
                  }
                )
              },
              setattr: function(e, r) {
                var t = ge.realPath(e)
                try {
                  if (
                    (void 0 !== r.mode && (Me.chmodSync(t, r.mode), (e.mode = r.mode)),
                    void 0 !== r.timestamp)
                  ) {
                    var n = new Date(r.timestamp)
                    Me.utimesSync(t, n, n)
                  }
                  void 0 !== r.size && Me.truncateSync(t, r.size)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              lookup: function(e, r) {
                var t = me.join2(ge.realPath(e), r),
                  n = ge.getMode(t)
                return ge.createNode(e, r, n)
              },
              mknod: function(e, r, t, n) {
                var o = ge.createNode(e, r, t, n),
                  i = ge.realPath(o)
                try {
                  be.isDir(o.mode)
                    ? Me.mkdirSync(i, o.mode)
                    : Me.writeFileSync(i, '', { mode: o.mode })
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
                return o
              },
              rename: function(e, r, t) {
                var n = ge.realPath(e),
                  o = me.join2(ge.realPath(r), t)
                try {
                  Me.renameSync(n, o)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              unlink: function(e, r) {
                var t = me.join2(ge.realPath(e), r)
                try {
                  Me.unlinkSync(t)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              rmdir: function(e, r) {
                var t = me.join2(ge.realPath(e), r)
                try {
                  Me.rmdirSync(t)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              readdir: function(e) {
                var r = ge.realPath(e)
                try {
                  return Me.readdirSync(r)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              symlink: function(e, r, t) {
                var n = me.join2(ge.realPath(e), r)
                try {
                  Me.symlinkSync(t, n)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              readlink: function(e) {
                var r = ge.realPath(e)
                try {
                  return (
                    (r = Me.readlinkSync(r)),
                    (r = Be.relative(Be.resolve(e.mount.opts.root), r))
                  )
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
            },
            stream_ops: {
              open: function(e) {
                var r = ge.realPath(e.node)
                try {
                  be.isFile(e.node.mode) &&
                    (e.nfd = Me.openSync(r, ge.flagsForNode(e.flags)))
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              close: function(e) {
                try {
                  be.isFile(e.node.mode) && e.nfd && Me.closeSync(e.nfd)
                } catch (e) {
                  if (!e.code) throw e
                  throw new be.ErrnoError(-e.errno)
                }
              },
              read: function(e, r, t, n, o) {
                if (0 === n) return 0
                try {
                  return Me.readSync(e.nfd, ge.bufferFrom(r.buffer), t, n, o)
                } catch (e) {
                  throw new be.ErrnoError(-e.errno)
                }
              },
              write: function(e, r, t, n, o) {
                try {
                  return Me.writeSync(e.nfd, ge.bufferFrom(r.buffer), t, n, o)
                } catch (e) {
                  throw new be.ErrnoError(-e.errno)
                }
              },
              llseek: function(e, r, t) {
                var n = r
                if (1 === t) n += e.position
                else if (2 === t && be.isFile(e.node.mode))
                  try {
                    n += Me.fstatSync(e.nfd).size
                  } catch (e) {
                    throw new be.ErrnoError(-e.errno)
                  }
                if (n < 0) throw new be.ErrnoError(22)
                return n
              },
            },
          },
          _e = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            reader: null,
            mount: function(e) {
              E(u), _e.reader || (_e.reader = new FileReaderSync())
              var r = _e.createNode(null, '/', _e.DIR_MODE, 0),
                t = {}
              function n(e) {
                for (var n = e.split('/'), o = r, i = 0; i < n.length - 1; i++) {
                  var a = n.slice(0, i + 1).join('/')
                  t[a] || (t[a] = _e.createNode(o, n[i], _e.DIR_MODE, 0)), (o = t[a])
                }
                return o
              }
              function o(e) {
                var r = e.split('/')
                return r[r.length - 1]
              }
              return (
                Array.prototype.forEach.call(e.opts.files || [], function(e) {
                  _e.createNode(
                    n(e.name),
                    o(e.name),
                    _e.FILE_MODE,
                    0,
                    e,
                    e.lastModifiedDate
                  )
                }),
                (e.opts.blobs || []).forEach(function(e) {
                  _e.createNode(n(e.name), o(e.name), _e.FILE_MODE, 0, e.data)
                }),
                (e.opts.packages || []).forEach(function(e) {
                  e.metadata.files.forEach(function(r) {
                    var t = r.filename.substr(1)
                    _e.createNode(
                      n(t),
                      o(t),
                      _e.FILE_MODE,
                      0,
                      e.blob.slice(r.start, r.end)
                    )
                  })
                }),
                r
              )
            },
            createNode: function(e, r, t, n, o, i) {
              var a = be.createNode(e, r, t)
              return (
                (a.mode = t),
                (a.node_ops = _e.node_ops),
                (a.stream_ops = _e.stream_ops),
                (a.timestamp = (i || new Date()).getTime()),
                E(_e.FILE_MODE !== _e.DIR_MODE),
                t === _e.FILE_MODE
                  ? ((a.size = o.size), (a.contents = o))
                  : ((a.size = 4096), (a.contents = {})),
                e && (e.contents[r] = a),
                a
              )
            },
            node_ops: {
              getattr: function(e) {
                return {
                  dev: 1,
                  ino: void 0,
                  mode: e.mode,
                  nlink: 1,
                  uid: 0,
                  gid: 0,
                  rdev: void 0,
                  size: e.size,
                  atime: new Date(e.timestamp),
                  mtime: new Date(e.timestamp),
                  ctime: new Date(e.timestamp),
                  blksize: 4096,
                  blocks: Math.ceil(e.size / 4096),
                }
              },
              setattr: function(e, r) {
                void 0 !== r.mode && (e.mode = r.mode),
                  void 0 !== r.timestamp && (e.timestamp = r.timestamp)
              },
              lookup: function(e, r) {
                throw new be.ErrnoError(2)
              },
              mknod: function(e, r, t, n) {
                throw new be.ErrnoError(1)
              },
              rename: function(e, r, t) {
                throw new be.ErrnoError(1)
              },
              unlink: function(e, r) {
                throw new be.ErrnoError(1)
              },
              rmdir: function(e, r) {
                throw new be.ErrnoError(1)
              },
              readdir: function(e) {
                var r = ['.', '..']
                for (var t in e.contents) e.contents.hasOwnProperty(t) && r.push(t)
                return r
              },
              symlink: function(e, r, t) {
                throw new be.ErrnoError(1)
              },
              readlink: function(e) {
                throw new be.ErrnoError(1)
              },
            },
            stream_ops: {
              read: function(e, r, t, n, o) {
                if (o >= e.node.size) return 0
                var i = e.node.contents.slice(o, o + n),
                  a = _e.reader.readAsArrayBuffer(i)
                return r.set(new Uint8Array(a), t), i.size
              },
              write: function(e, r, t, n, o) {
                throw new be.ErrnoError(5)
              },
              llseek: function(e, r, t) {
                var n = r
                if (
                  (1 === t
                    ? (n += e.position)
                    : 2 === t && be.isFile(e.node.mode) && (n += e.node.size),
                  n < 0)
                )
                  throw new be.ErrnoError(22)
                return n
              },
            },
          },
          be = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: '/',
            initialized: !1,
            ignorePermissions: !0,
            trackingDelegate: {},
            tracking: { openFlags: { READ: 1, WRITE: 2 } },
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            handleFSError: function(e) {
              if (!(e instanceof be.ErrnoError)) throw e + ' : ' + j()
              return he(e.errno)
            },
            lookupPath: function(e, r) {
              if (((r = r || {}), !(e = ve.resolve(be.cwd(), e))))
                return { path: '', node: null }
              var t = { follow_mount: !0, recurse_count: 0 }
              for (var n in t) void 0 === r[n] && (r[n] = t[n])
              if (r.recurse_count > 8) throw new be.ErrnoError(40)
              for (
                var o = me.normalizeArray(
                    e.split('/').filter(function(e) {
                      return !!e
                    }),
                    !1
                  ),
                  i = be.root,
                  a = '/',
                  s = 0;
                s < o.length;
                s++
              ) {
                var u = s === o.length - 1
                if (u && r.parent) break
                if (
                  ((i = be.lookupNode(i, o[s])),
                  (a = me.join2(a, o[s])),
                  be.isMountpoint(i) &&
                    (!u || (u && r.follow_mount)) &&
                    (i = i.mounted.root),
                  !u || r.follow)
                )
                  for (var c = 0; be.isLink(i.mode); ) {
                    var f = be.readlink(a)
                    if (
                      ((a = ve.resolve(me.dirname(a), f)),
                      (i = be.lookupPath(a, { recurse_count: r.recurse_count }).node),
                      c++ > 40)
                    )
                      throw new be.ErrnoError(40)
                  }
              }
              return { path: a, node: i }
            },
            getPath: function(e) {
              for (var r; ; ) {
                if (be.isRoot(e)) {
                  var t = e.mount.mountpoint
                  return r ? ('/' !== t[t.length - 1] ? t + '/' + r : t + r) : t
                }
                ;(r = r ? e.name + '/' + r : e.name), (e = e.parent)
              }
            },
            hashName: function(e, r) {
              for (var t = 0, n = 0; n < r.length; n++)
                t = ((t << 5) - t + r.charCodeAt(n)) | 0
              return ((e + t) >>> 0) % be.nameTable.length
            },
            hashAddNode: function(e) {
              var r = be.hashName(e.parent.id, e.name)
              ;(e.name_next = be.nameTable[r]), (be.nameTable[r] = e)
            },
            hashRemoveNode: function(e) {
              var r = be.hashName(e.parent.id, e.name)
              if (be.nameTable[r] === e) be.nameTable[r] = e.name_next
              else
                for (var t = be.nameTable[r]; t; ) {
                  if (t.name_next === e) {
                    t.name_next = e.name_next
                    break
                  }
                  t = t.name_next
                }
            },
            lookupNode: function(e, r) {
              var t = be.mayLookup(e)
              if (t) throw new be.ErrnoError(t, e)
              for (
                var n = be.hashName(e.id, r), o = be.nameTable[n];
                o;
                o = o.name_next
              ) {
                var i = o.name
                if (o.parent.id === e.id && i === r) return o
              }
              return be.lookup(e, r)
            },
            createNode: function(e, r, t, n) {
              be.FSNode ||
                ((be.FSNode = function(e, r, t, n) {
                  e || (e = this),
                    (this.parent = e),
                    (this.mount = e.mount),
                    (this.mounted = null),
                    (this.id = be.nextInode++),
                    (this.name = r),
                    (this.mode = t),
                    (this.node_ops = {}),
                    (this.stream_ops = {}),
                    (this.rdev = n)
                }),
                (be.FSNode.prototype = {}),
                Object.defineProperties(be.FSNode.prototype, {
                  read: {
                    get: function() {
                      return 365 == (365 & this.mode)
                    },
                    set: function(e) {
                      e ? (this.mode |= 365) : (this.mode &= -366)
                    },
                  },
                  write: {
                    get: function() {
                      return 146 == (146 & this.mode)
                    },
                    set: function(e) {
                      e ? (this.mode |= 146) : (this.mode &= -147)
                    },
                  },
                  isFolder: {
                    get: function() {
                      return be.isDir(this.mode)
                    },
                  },
                  isDevice: {
                    get: function() {
                      return be.isChrdev(this.mode)
                    },
                  },
                }))
              var o = new be.FSNode(e, r, t, n)
              return be.hashAddNode(o), o
            },
            destroyNode: function(e) {
              be.hashRemoveNode(e)
            },
            isRoot: function(e) {
              return e === e.parent
            },
            isMountpoint: function(e) {
              return !!e.mounted
            },
            isFile: function(e) {
              return 32768 == (61440 & e)
            },
            isDir: function(e) {
              return 16384 == (61440 & e)
            },
            isLink: function(e) {
              return 40960 == (61440 & e)
            },
            isChrdev: function(e) {
              return 8192 == (61440 & e)
            },
            isBlkdev: function(e) {
              return 24576 == (61440 & e)
            },
            isFIFO: function(e) {
              return 4096 == (61440 & e)
            },
            isSocket: function(e) {
              return 49152 == (49152 & e)
            },
            flagModes: {
              r: 0,
              rs: 1052672,
              'r+': 2,
              w: 577,
              wx: 705,
              xw: 705,
              'w+': 578,
              'wx+': 706,
              'xw+': 706,
              a: 1089,
              ax: 1217,
              xa: 1217,
              'a+': 1090,
              'ax+': 1218,
              'xa+': 1218,
            },
            modeStringToFlags: function(e) {
              var r = be.flagModes[e]
              if (void 0 === r) throw new Error('Unknown file open mode: ' + e)
              return r
            },
            flagsToPermissionString: function(e) {
              var r = ['r', 'w', 'rw'][3 & e]
              return 512 & e && (r += 'w'), r
            },
            nodePermissions: function(e, r) {
              return be.ignorePermissions
                ? 0
                : (-1 === r.indexOf('r') || 292 & e.mode) &&
                  (-1 === r.indexOf('w') || 146 & e.mode) &&
                  (-1 === r.indexOf('x') || 73 & e.mode)
                ? 0
                : 13
            },
            mayLookup: function(e) {
              var r = be.nodePermissions(e, 'x')
              return r || (e.node_ops.lookup ? 0 : 13)
            },
            mayCreate: function(e, r) {
              try {
                return be.lookupNode(e, r), 17
              } catch (e) {}
              return be.nodePermissions(e, 'wx')
            },
            mayDelete: function(e, r, t) {
              var n
              try {
                n = be.lookupNode(e, r)
              } catch (e) {
                return e.errno
              }
              var o = be.nodePermissions(e, 'wx')
              if (o) return o
              if (t) {
                if (!be.isDir(n.mode)) return 20
                if (be.isRoot(n) || be.getPath(n) === be.cwd()) return 16
              } else if (be.isDir(n.mode)) return 21
              return 0
            },
            mayOpen: function(e, r) {
              return e
                ? be.isLink(e.mode)
                  ? 40
                  : be.isDir(e.mode) && ('r' !== be.flagsToPermissionString(r) || 512 & r)
                  ? 21
                  : be.nodePermissions(e, be.flagsToPermissionString(r))
                : 2
            },
            MAX_OPEN_FDS: 4096,
            nextfd: function(e, r) {
              ;(e = e || 0), (r = r || be.MAX_OPEN_FDS)
              for (var t = e; t <= r; t++) if (!be.streams[t]) return t
              throw new be.ErrnoError(24)
            },
            getStream: function(e) {
              return be.streams[e]
            },
            createStream: function(e, r, t) {
              be.FSStream ||
                ((be.FSStream = function() {}),
                (be.FSStream.prototype = {}),
                Object.defineProperties(be.FSStream.prototype, {
                  object: {
                    get: function() {
                      return this.node
                    },
                    set: function(e) {
                      this.node = e
                    },
                  },
                  isRead: {
                    get: function() {
                      return 1 != (2097155 & this.flags)
                    },
                  },
                  isWrite: {
                    get: function() {
                      return 0 != (2097155 & this.flags)
                    },
                  },
                  isAppend: {
                    get: function() {
                      return 1024 & this.flags
                    },
                  },
                }))
              var n = new be.FSStream()
              for (var o in e) n[o] = e[o]
              e = n
              var i = be.nextfd(r, t)
              return (e.fd = i), (be.streams[i] = e), e
            },
            closeStream: function(e) {
              be.streams[e] = null
            },
            chrdev_stream_ops: {
              open: function(e) {
                var r = be.getDevice(e.node.rdev)
                ;(e.stream_ops = r.stream_ops), e.stream_ops.open && e.stream_ops.open(e)
              },
              llseek: function() {
                throw new be.ErrnoError(29)
              },
            },
            major: function(e) {
              return e >> 8
            },
            minor: function(e) {
              return 255 & e
            },
            makedev: function(e, r) {
              return (e << 8) | r
            },
            registerDevice: function(e, r) {
              be.devices[e] = { stream_ops: r }
            },
            getDevice: function(e) {
              return be.devices[e]
            },
            getMounts: function(e) {
              for (var r = [], t = [e]; t.length; ) {
                var n = t.pop()
                r.push(n), t.push.apply(t, n.mounts)
              }
              return r
            },
            syncfs: function(e, r) {
              'function' == typeof e && ((r = e), (e = !1)),
                be.syncFSRequests++,
                be.syncFSRequests > 1 &&
                  console.log(
                    'warning: ' +
                      be.syncFSRequests +
                      ' FS.syncfs operations in flight at once, probably just doing extra work'
                  )
              var t = be.getMounts(be.root.mount),
                n = 0
              function o(e) {
                return be.syncFSRequests--, r(e)
              }
              function i(e) {
                if (e) return i.errored ? void 0 : ((i.errored = !0), o(e))
                ++n >= t.length && o(null)
              }
              t.forEach(function(r) {
                if (!r.type.syncfs) return i(null)
                r.type.syncfs(r, e, i)
              })
            },
            mount: function(e, r, t) {
              var n,
                o = '/' === t,
                i = !t
              if (o && be.root) throw new be.ErrnoError(16)
              if (!o && !i) {
                var a = be.lookupPath(t, { follow_mount: !1 })
                if (((t = a.path), (n = a.node), be.isMountpoint(n)))
                  throw new be.ErrnoError(16)
                if (!be.isDir(n.mode)) throw new be.ErrnoError(20)
              }
              var s = { type: e, opts: r, mountpoint: t, mounts: [] },
                u = e.mount(s)
              return (
                (u.mount = s),
                (s.root = u),
                o
                  ? (be.root = u)
                  : n && ((n.mounted = s), n.mount && n.mount.mounts.push(s)),
                u
              )
            },
            unmount: function(e) {
              var r = be.lookupPath(e, { follow_mount: !1 })
              if (!be.isMountpoint(r.node)) throw new be.ErrnoError(22)
              var t = r.node,
                n = t.mounted,
                o = be.getMounts(n)
              Object.keys(be.nameTable).forEach(function(e) {
                for (var r = be.nameTable[e]; r; ) {
                  var t = r.name_next
                  ;-1 !== o.indexOf(r.mount) && be.destroyNode(r), (r = t)
                }
              }),
                (t.mounted = null)
              var i = t.mount.mounts.indexOf(n)
              t.mount.mounts.splice(i, 1)
            },
            lookup: function(e, r) {
              return e.node_ops.lookup(e, r)
            },
            mknod: function(e, r, t) {
              var n = be.lookupPath(e, { parent: !0 }).node,
                o = me.basename(e)
              if (!o || '.' === o || '..' === o) throw new be.ErrnoError(22)
              var i = be.mayCreate(n, o)
              if (i) throw new be.ErrnoError(i)
              if (!n.node_ops.mknod) throw new be.ErrnoError(1)
              return n.node_ops.mknod(n, o, r, t)
            },
            create: function(e, r) {
              return (
                (r = void 0 !== r ? r : 438), (r &= 4095), (r |= 32768), be.mknod(e, r, 0)
              )
            },
            mkdir: function(e, r) {
              return (
                (r = void 0 !== r ? r : 511), (r &= 1023), (r |= 16384), be.mknod(e, r, 0)
              )
            },
            mkdirTree: function(e, r) {
              for (var t = e.split('/'), n = '', o = 0; o < t.length; ++o)
                if (t[o]) {
                  n += '/' + t[o]
                  try {
                    be.mkdir(n, r)
                  } catch (e) {
                    if (17 != e.errno) throw e
                  }
                }
            },
            mkdev: function(e, r, t) {
              return void 0 === t && ((t = r), (r = 438)), (r |= 8192), be.mknod(e, r, t)
            },
            symlink: function(e, r) {
              if (!ve.resolve(e)) throw new be.ErrnoError(2)
              var t = be.lookupPath(r, { parent: !0 }).node
              if (!t) throw new be.ErrnoError(2)
              var n = me.basename(r),
                o = be.mayCreate(t, n)
              if (o) throw new be.ErrnoError(o)
              if (!t.node_ops.symlink) throw new be.ErrnoError(1)
              return t.node_ops.symlink(t, n, e)
            },
            rename: function(e, r) {
              var t,
                n,
                o = me.dirname(e),
                i = me.dirname(r),
                a = me.basename(e),
                s = me.basename(r)
              try {
                ;(t = be.lookupPath(e, { parent: !0 }).node),
                  (n = be.lookupPath(r, { parent: !0 }).node)
              } catch (e) {
                throw new be.ErrnoError(16)
              }
              if (!t || !n) throw new be.ErrnoError(2)
              if (t.mount !== n.mount) throw new be.ErrnoError(18)
              var u,
                c = be.lookupNode(t, a),
                f = ve.relative(e, i)
              if ('.' !== f.charAt(0)) throw new be.ErrnoError(22)
              if ('.' !== (f = ve.relative(r, o)).charAt(0)) throw new be.ErrnoError(39)
              try {
                u = be.lookupNode(n, s)
              } catch (e) {}
              if (c !== u) {
                var l = be.isDir(c.mode),
                  d = be.mayDelete(t, a, l)
                if (d) throw new be.ErrnoError(d)
                if ((d = u ? be.mayDelete(n, s, l) : be.mayCreate(n, s)))
                  throw new be.ErrnoError(d)
                if (!t.node_ops.rename) throw new be.ErrnoError(1)
                if (be.isMountpoint(c) || (u && be.isMountpoint(u)))
                  throw new be.ErrnoError(16)
                if (n !== t && (d = be.nodePermissions(t, 'w')))
                  throw new be.ErrnoError(d)
                be.hashRemoveNode(c)
                try {
                  t.node_ops.rename(c, n, s)
                } catch (e) {
                  throw e
                } finally {
                  be.hashAddNode(c)
                }
              }
            },
            rmdir: function(e) {
              var r = be.lookupPath(e, { parent: !0 }).node,
                t = me.basename(e),
                n = be.lookupNode(r, t),
                o = be.mayDelete(r, t, !0)
              if (o) throw new be.ErrnoError(o)
              if (!r.node_ops.rmdir) throw new be.ErrnoError(1)
              if (be.isMountpoint(n)) throw new be.ErrnoError(16)
              r.node_ops.rmdir(r, t), be.destroyNode(n)
            },
            readdir: function(e) {
              var r = be.lookupPath(e, { follow: !0 }).node
              if (!r.node_ops.readdir) throw new be.ErrnoError(20)
              return r.node_ops.readdir(r)
            },
            unlink: function(e) {
              var r = be.lookupPath(e, { parent: !0 }).node,
                t = me.basename(e),
                n = be.lookupNode(r, t),
                o = be.mayDelete(r, t, !1)
              if (o) throw new be.ErrnoError(o)
              if (!r.node_ops.unlink) throw new be.ErrnoError(1)
              if (be.isMountpoint(n)) throw new be.ErrnoError(16)
              r.node_ops.unlink(r, t), be.destroyNode(n)
            },
            readlink: function(e) {
              var r = be.lookupPath(e).node
              if (!r) throw new be.ErrnoError(2)
              if (!r.node_ops.readlink) throw new be.ErrnoError(22)
              return ve.resolve(be.getPath(r.parent), r.node_ops.readlink(r))
            },
            stat: function(e, r) {
              var t = be.lookupPath(e, { follow: !r }).node
              if (!t) throw new be.ErrnoError(2)
              if (!t.node_ops.getattr) throw new be.ErrnoError(1)
              return t.node_ops.getattr(t)
            },
            lstat: function(e) {
              return be.stat(e, !0)
            },
            chmod: function(e, r, t) {
              var n
              if (
                !(n = 'string' == typeof e ? be.lookupPath(e, { follow: !t }).node : e)
                  .node_ops.setattr
              )
                throw new be.ErrnoError(1)
              n.node_ops.setattr(n, {
                mode: (4095 & r) | (-4096 & n.mode),
                timestamp: Date.now(),
              })
            },
            lchmod: function(e, r) {
              be.chmod(e, r, !0)
            },
            fchmod: function(e, r) {
              var t = be.getStream(e)
              if (!t) throw new be.ErrnoError(9)
              be.chmod(t.node, r)
            },
            chown: function(e, r, t, n) {
              var o
              if (
                !(o = 'string' == typeof e ? be.lookupPath(e, { follow: !n }).node : e)
                  .node_ops.setattr
              )
                throw new be.ErrnoError(1)
              o.node_ops.setattr(o, { timestamp: Date.now() })
            },
            lchown: function(e, r, t) {
              be.chown(e, r, t, !0)
            },
            fchown: function(e, r, t) {
              var n = be.getStream(e)
              if (!n) throw new be.ErrnoError(9)
              be.chown(n.node, r, t)
            },
            truncate: function(e, r) {
              if (r < 0) throw new be.ErrnoError(22)
              var t
              if (
                !(t = 'string' == typeof e ? be.lookupPath(e, { follow: !0 }).node : e)
                  .node_ops.setattr
              )
                throw new be.ErrnoError(1)
              if (be.isDir(t.mode)) throw new be.ErrnoError(21)
              if (!be.isFile(t.mode)) throw new be.ErrnoError(22)
              var n = be.nodePermissions(t, 'w')
              if (n) throw new be.ErrnoError(n)
              t.node_ops.setattr(t, { size: r, timestamp: Date.now() })
            },
            ftruncate: function(e, r) {
              var t = be.getStream(e)
              if (!t) throw new be.ErrnoError(9)
              if (0 == (2097155 & t.flags)) throw new be.ErrnoError(22)
              be.truncate(t.node, r)
            },
            utime: function(e, r, t) {
              var n = be.lookupPath(e, { follow: !0 }).node
              n.node_ops.setattr(n, { timestamp: Math.max(r, t) })
            },
            open: function(e, r, t, o, i) {
              if ('' === e) throw new be.ErrnoError(2)
              var a
              if (
                ((t = void 0 === t ? 438 : t),
                (t =
                  64 & (r = 'string' == typeof r ? be.modeStringToFlags(r) : r)
                    ? (4095 & t) | 32768
                    : 0),
                'object' == typeof e)
              )
                a = e
              else {
                e = me.normalize(e)
                try {
                  a = be.lookupPath(e, { follow: !(131072 & r) }).node
                } catch (e) {}
              }
              var s = !1
              if (64 & r)
                if (a) {
                  if (128 & r) throw new be.ErrnoError(17)
                } else (a = be.mknod(e, t, 0)), (s = !0)
              if (!a) throw new be.ErrnoError(2)
              if ((be.isChrdev(a.mode) && (r &= -513), 65536 & r && !be.isDir(a.mode)))
                throw new be.ErrnoError(20)
              if (!s) {
                var u = be.mayOpen(a, r)
                if (u) throw new be.ErrnoError(u)
              }
              512 & r && be.truncate(a, 0), (r &= -641)
              var c = be.createStream(
                {
                  node: a,
                  path: be.getPath(a),
                  flags: r,
                  seekable: !0,
                  position: 0,
                  stream_ops: a.stream_ops,
                  ungotten: [],
                  error: !1,
                },
                o,
                i
              )
              return (
                c.stream_ops.open && c.stream_ops.open(c),
                !n.logReadFiles ||
                  1 & r ||
                  (be.readFiles || (be.readFiles = {}),
                  e in be.readFiles ||
                    ((be.readFiles[e] = 1),
                    console.log('FS.trackingDelegate error on read file: ' + e))),
                c
              )
            },
            close: function(e) {
              if (be.isClosed(e)) throw new be.ErrnoError(9)
              e.getdents && (e.getdents = null)
              try {
                e.stream_ops.close && e.stream_ops.close(e)
              } catch (e) {
                throw e
              } finally {
                be.closeStream(e.fd)
              }
              e.fd = null
            },
            isClosed: function(e) {
              return null === e.fd
            },
            llseek: function(e, r, t) {
              if (be.isClosed(e)) throw new be.ErrnoError(9)
              if (!e.seekable || !e.stream_ops.llseek) throw new be.ErrnoError(29)
              if (0 != t && 1 != t && 2 != t) throw new be.ErrnoError(22)
              return (
                (e.position = e.stream_ops.llseek(e, r, t)), (e.ungotten = []), e.position
              )
            },
            read: function(e, r, t, n, o) {
              if (n < 0 || o < 0) throw new be.ErrnoError(22)
              if (be.isClosed(e)) throw new be.ErrnoError(9)
              if (1 == (2097155 & e.flags)) throw new be.ErrnoError(9)
              if (be.isDir(e.node.mode)) throw new be.ErrnoError(21)
              if (!e.stream_ops.read) throw new be.ErrnoError(22)
              var i = void 0 !== o
              if (i) {
                if (!e.seekable) throw new be.ErrnoError(29)
              } else o = e.position
              var a = e.stream_ops.read(e, r, t, n, o)
              return i || (e.position += a), a
            },
            write: function(e, r, t, n, o, i) {
              if (n < 0 || o < 0) throw new be.ErrnoError(22)
              if (be.isClosed(e)) throw new be.ErrnoError(9)
              if (0 == (2097155 & e.flags)) throw new be.ErrnoError(9)
              if (be.isDir(e.node.mode)) throw new be.ErrnoError(21)
              if (!e.stream_ops.write) throw new be.ErrnoError(22)
              1024 & e.flags && be.llseek(e, 0, 2)
              var a = void 0 !== o
              if (a) {
                if (!e.seekable) throw new be.ErrnoError(29)
              } else o = e.position
              var s = e.stream_ops.write(e, r, t, n, o, i)
              a || (e.position += s)
              try {
                e.path &&
                  be.trackingDelegate.onWriteToFile &&
                  be.trackingDelegate.onWriteToFile(e.path)
              } catch (r) {
                console.log(
                  "FS.trackingDelegate['onWriteToFile']('" +
                    e.path +
                    "') threw an exception: " +
                    r.message
                )
              }
              return s
            },
            allocate: function(e, r, t) {
              if (be.isClosed(e)) throw new be.ErrnoError(9)
              if (r < 0 || t <= 0) throw new be.ErrnoError(22)
              if (0 == (2097155 & e.flags)) throw new be.ErrnoError(9)
              if (!be.isFile(e.node.mode) && !be.isDir(e.node.mode))
                throw new be.ErrnoError(19)
              if (!e.stream_ops.allocate) throw new be.ErrnoError(95)
              e.stream_ops.allocate(e, r, t)
            },
            mmap: function(e, r, t, n, o, i, a) {
              if (1 == (2097155 & e.flags)) throw new be.ErrnoError(13)
              if (!e.stream_ops.mmap) throw new be.ErrnoError(19)
              return e.stream_ops.mmap(e, r, t, n, o, i, a)
            },
            msync: function(e, r, t, n, o) {
              return e && e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, o) : 0
            },
            munmap: function(e) {
              return 0
            },
            ioctl: function(e, r, t) {
              if (!e.stream_ops.ioctl) throw new be.ErrnoError(25)
              return e.stream_ops.ioctl(e, r, t)
            },
            readFile: function(e, r) {
              if (
                (((r = r || {}).flags = r.flags || 'r'),
                (r.encoding = r.encoding || 'binary'),
                'utf8' !== r.encoding && 'binary' !== r.encoding)
              )
                throw new Error('Invalid encoding type "' + r.encoding + '"')
              var t,
                n = be.open(e, r.flags),
                o = be.stat(e).size,
                i = new Uint8Array(o)
              return (
                be.read(n, i, 0, o, 0),
                'utf8' === r.encoding
                  ? (t = x(i, 0))
                  : 'binary' === r.encoding && (t = i),
                be.close(n),
                t
              )
            },
            writeFile: function(e, r, t) {
              ;(t = t || {}).flags = t.flags || 'w'
              var n = be.open(e, t.flags, t.mode)
              if ('string' == typeof r) {
                var o = new Uint8Array(L(r) + 1),
                  i = z(r, o, 0, o.length)
                be.write(n, o, 0, i, void 0, t.canOwn)
              } else {
                if (!ArrayBuffer.isView(r)) throw new Error('Unsupported data type')
                be.write(n, r, 0, r.byteLength, void 0, t.canOwn)
              }
              be.close(n)
            },
            cwd: function() {
              return be.currentPath
            },
            chdir: function(e) {
              var r = be.lookupPath(e, { follow: !0 })
              if (null === r.node) throw new be.ErrnoError(2)
              if (!be.isDir(r.node.mode)) throw new be.ErrnoError(20)
              var t = be.nodePermissions(r.node, 'x')
              if (t) throw new be.ErrnoError(t)
              be.currentPath = r.path
            },
            createDefaultDirectories: function() {
              be.mkdir('/tmp'), be.mkdir('/home'), be.mkdir('/home/web_user')
            },
            createDefaultDevices: function() {
              var e
              if (
                (be.mkdir('/dev'),
                be.registerDevice(be.makedev(1, 3), {
                  read: function() {
                    return 0
                  },
                  write: function(e, r, t, n, o) {
                    return n
                  },
                }),
                be.mkdev('/dev/null', be.makedev(1, 3)),
                we.register(be.makedev(5, 0), we.default_tty_ops),
                we.register(be.makedev(6, 0), we.default_tty1_ops),
                be.mkdev('/dev/tty', be.makedev(5, 0)),
                be.mkdev('/dev/tty1', be.makedev(6, 0)),
                'object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
              ) {
                var r = new Uint8Array(1)
                e = function() {
                  return crypto.getRandomValues(r), r[0]
                }
              } else if (i)
                try {
                  var t = require('crypto')
                  e = function() {
                    return t.randomBytes(1)[0]
                  }
                } catch (e) {}
              e ||
                (e = function() {
                  Ze('random_device')
                }),
                be.createDevice('/dev', 'random', e),
                be.createDevice('/dev', 'urandom', e),
                be.mkdir('/dev/shm'),
                be.mkdir('/dev/shm/tmp')
            },
            createSpecialDirectories: function() {
              be.mkdir('/proc'),
                be.mkdir('/proc/self'),
                be.mkdir('/proc/self/fd'),
                be.mount(
                  {
                    mount: function() {
                      var e = be.createNode('/proc/self', 'fd', 16895, 73)
                      return (
                        (e.node_ops = {
                          lookup: function(e, r) {
                            var t = +r,
                              n = be.getStream(t)
                            if (!n) throw new be.ErrnoError(9)
                            var o = {
                              parent: null,
                              mount: { mountpoint: 'fake' },
                              node_ops: {
                                readlink: function() {
                                  return n.path
                                },
                              },
                            }
                            return (o.parent = o), o
                          },
                        }),
                        e
                      )
                    },
                  },
                  {},
                  '/proc/self/fd'
                )
            },
            createStandardStreams: function() {
              n.stdin
                ? be.createDevice('/dev', 'stdin', n.stdin)
                : be.symlink('/dev/tty', '/dev/stdin'),
                n.stdout
                  ? be.createDevice('/dev', 'stdout', null, n.stdout)
                  : be.symlink('/dev/tty', '/dev/stdout'),
                n.stderr
                  ? be.createDevice('/dev', 'stderr', null, n.stderr)
                  : be.symlink('/dev/tty1', '/dev/stderr'),
                be.open('/dev/stdin', 'r'),
                be.open('/dev/stdout', 'w'),
                be.open('/dev/stderr', 'w')
            },
            ensureErrnoError: function() {
              be.ErrnoError ||
                ((be.ErrnoError = function(e, r) {
                  ;(this.node = r),
                    (this.setErrno = function(e) {
                      this.errno = e
                    }),
                    this.setErrno(e),
                    (this.message = 'FS error'),
                    this.stack &&
                      Object.defineProperty(this, 'stack', {
                        value: new Error().stack,
                        writable: !0,
                      })
                }),
                (be.ErrnoError.prototype = new Error()),
                (be.ErrnoError.prototype.constructor = be.ErrnoError),
                [2].forEach(function(e) {
                  ;(be.genericErrors[e] = new be.ErrnoError(e)),
                    (be.genericErrors[e].stack = '<generic error, no stack>')
                }))
            },
            staticInit: function() {
              be.ensureErrnoError(),
                (be.nameTable = new Array(4096)),
                be.mount(ye, {}, '/'),
                be.createDefaultDirectories(),
                be.createDefaultDevices(),
                be.createSpecialDirectories(),
                (be.filesystems = { MEMFS: ye, IDBFS: Ee, NODEFS: ge, WORKERFS: _e })
            },
            init: function(e, r, t) {
              ;(be.init.initialized = !0),
                be.ensureErrnoError(),
                (n.stdin = e || n.stdin),
                (n.stdout = r || n.stdout),
                (n.stderr = t || n.stderr),
                be.createStandardStreams()
            },
            quit: function() {
              be.init.initialized = !1
              var e = n._fflush
              e && e(0)
              for (var r = 0; r < be.streams.length; r++) {
                var t = be.streams[r]
                t && be.close(t)
              }
            },
            getMode: function(e, r) {
              var t = 0
              return e && (t |= 365), r && (t |= 146), t
            },
            joinPath: function(e, r) {
              var t = me.join.apply(null, e)
              return r && '/' == t[0] && (t = t.substr(1)), t
            },
            absolutePath: function(e, r) {
              return ve.resolve(r, e)
            },
            standardizePath: function(e) {
              return me.normalize(e)
            },
            findObject: function(e, r) {
              var t = be.analyzePath(e, r)
              return t.exists ? t.object : (he(t.error), null)
            },
            analyzePath: function(e, r) {
              try {
                e = (n = be.lookupPath(e, { follow: !r })).path
              } catch (e) {}
              var t = {
                isRoot: !1,
                exists: !1,
                error: 0,
                name: null,
                path: null,
                object: null,
                parentExists: !1,
                parentPath: null,
                parentObject: null,
              }
              try {
                var n = be.lookupPath(e, { parent: !0 })
                ;(t.parentExists = !0),
                  (t.parentPath = n.path),
                  (t.parentObject = n.node),
                  (t.name = me.basename(e)),
                  (n = be.lookupPath(e, { follow: !r })),
                  (t.exists = !0),
                  (t.path = n.path),
                  (t.object = n.node),
                  (t.name = n.node.name),
                  (t.isRoot = '/' === n.path)
              } catch (e) {
                t.error = e.errno
              }
              return t
            },
            createFolder: function(e, r, t, n) {
              var o = me.join2('string' == typeof e ? e : be.getPath(e), r),
                i = be.getMode(t, n)
              return be.mkdir(o, i)
            },
            createPath: function(e, r, t, n) {
              e = 'string' == typeof e ? e : be.getPath(e)
              for (var o = r.split('/').reverse(); o.length; ) {
                var i = o.pop()
                if (i) {
                  var a = me.join2(e, i)
                  try {
                    be.mkdir(a)
                  } catch (e) {}
                  e = a
                }
              }
              return a
            },
            createFile: function(e, r, t, n, o) {
              var i = me.join2('string' == typeof e ? e : be.getPath(e), r),
                a = be.getMode(n, o)
              return be.create(i, a)
            },
            createDataFile: function(e, r, t, n, o, i) {
              var a = r ? me.join2('string' == typeof e ? e : be.getPath(e), r) : e,
                s = be.getMode(n, o),
                u = be.create(a, s)
              if (t) {
                if ('string' == typeof t) {
                  for (var c = new Array(t.length), f = 0, l = t.length; f < l; ++f)
                    c[f] = t.charCodeAt(f)
                  t = c
                }
                be.chmod(u, 146 | s)
                var d = be.open(u, 'w')
                be.write(d, t, 0, t.length, 0, i), be.close(d), be.chmod(u, s)
              }
              return u
            },
            createDevice: function(e, r, t, n) {
              var o = me.join2('string' == typeof e ? e : be.getPath(e), r),
                i = be.getMode(!!t, !!n)
              be.createDevice.major || (be.createDevice.major = 64)
              var a = be.makedev(be.createDevice.major++, 0)
              return (
                be.registerDevice(a, {
                  open: function(e) {
                    e.seekable = !1
                  },
                  close: function(e) {
                    n && n.buffer && n.buffer.length && n(10)
                  },
                  read: function(e, r, n, o, i) {
                    for (var a = 0, s = 0; s < o; s++) {
                      var u
                      try {
                        u = t()
                      } catch (e) {
                        throw new be.ErrnoError(5)
                      }
                      if (void 0 === u && 0 === a) throw new be.ErrnoError(11)
                      if (null == u) break
                      a++, (r[n + s] = u)
                    }
                    return a && (e.node.timestamp = Date.now()), a
                  },
                  write: function(e, r, t, o, i) {
                    for (var a = 0; a < o; a++)
                      try {
                        n(r[t + a])
                      } catch (e) {
                        throw new be.ErrnoError(5)
                      }
                    return o && (e.node.timestamp = Date.now()), a
                  },
                }),
                be.mkdev(o, i, a)
              )
            },
            createLink: function(e, r, t, n, o) {
              var i = me.join2('string' == typeof e ? e : be.getPath(e), r)
              return be.symlink(t, i)
            },
            forceLoadFile: function(e) {
              if (e.isDevice || e.isFolder || e.link || e.contents) return !0
              var r = !0
              if ('undefined' != typeof XMLHttpRequest)
                throw new Error(
                  'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
                )
              if (!n.read)
                throw new Error('Cannot load without read() or XMLHttpRequest.')
              try {
                ;(e.contents = Ne(n.read(e.url), !0)), (e.usedBytes = e.contents.length)
              } catch (e) {
                r = !1
              }
              return r || he(5), r
            },
            createLazyFile: function(e, r, t, n, o) {
              function i() {
                ;(this.lengthKnown = !1), (this.chunks = [])
              }
              if (
                ((i.prototype.get = function(e) {
                  if (!(e > this.length - 1 || e < 0)) {
                    var r = e % this.chunkSize,
                      t = (e / this.chunkSize) | 0
                    return this.getter(t)[r]
                  }
                }),
                (i.prototype.setDataGetter = function(e) {
                  this.getter = e
                }),
                (i.prototype.cacheLength = function() {
                  var e = new XMLHttpRequest()
                  if (
                    (e.open('HEAD', t, !1),
                    e.send(null),
                    !((e.status >= 200 && e.status < 300) || 304 === e.status))
                  )
                    throw new Error("Couldn't load " + t + '. Status: ' + e.status)
                  var r,
                    n = Number(e.getResponseHeader('Content-length')),
                    o = (r = e.getResponseHeader('Accept-Ranges')) && 'bytes' === r,
                    i = (r = e.getResponseHeader('Content-Encoding')) && 'gzip' === r,
                    a = 1048576
                  o || (a = n)
                  var s = this
                  s.setDataGetter(function(e) {
                    var r = e * a,
                      o = (e + 1) * a - 1
                    if (
                      ((o = Math.min(o, n - 1)),
                      void 0 === s.chunks[e] &&
                        (s.chunks[e] = (function(e, r) {
                          if (e > r)
                            throw new Error(
                              'invalid range (' +
                                e +
                                ', ' +
                                r +
                                ') or no bytes requested!'
                            )
                          if (r > n - 1)
                            throw new Error(
                              'only ' + n + ' bytes available! programmer error!'
                            )
                          var o = new XMLHttpRequest()
                          if (
                            (o.open('GET', t, !1),
                            n !== a &&
                              o.setRequestHeader('Range', 'bytes=' + e + '-' + r),
                            'undefined' != typeof Uint8Array &&
                              (o.responseType = 'arraybuffer'),
                            o.overrideMimeType &&
                              o.overrideMimeType('text/plain; charset=x-user-defined'),
                            o.send(null),
                            !((o.status >= 200 && o.status < 300) || 304 === o.status))
                          )
                            throw new Error(
                              "Couldn't load " + t + '. Status: ' + o.status
                            )
                          return void 0 !== o.response
                            ? new Uint8Array(o.response || [])
                            : Ne(o.responseText || '', !0)
                        })(r, o)),
                      void 0 === s.chunks[e])
                    )
                      throw new Error('doXHR failed!')
                    return s.chunks[e]
                  }),
                    (!i && n) ||
                      ((a = n = 1),
                      (n = this.getter(0).length),
                      (a = n),
                      console.log(
                        'LazyFiles on gzip forces download of the whole file when length is accessed'
                      )),
                    (this._length = n),
                    (this._chunkSize = a),
                    (this.lengthKnown = !0)
                }),
                'undefined' != typeof XMLHttpRequest)
              ) {
                if (!u)
                  throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc'
                var a = new i()
                Object.defineProperties(a, {
                  length: {
                    get: function() {
                      return this.lengthKnown || this.cacheLength(), this._length
                    },
                  },
                  chunkSize: {
                    get: function() {
                      return this.lengthKnown || this.cacheLength(), this._chunkSize
                    },
                  },
                })
                var s = { isDevice: !1, contents: a }
              } else s = { isDevice: !1, url: t }
              var c = be.createFile(e, r, s, n, o)
              s.contents
                ? (c.contents = s.contents)
                : s.url && ((c.contents = null), (c.url = s.url)),
                Object.defineProperties(c, {
                  usedBytes: {
                    get: function() {
                      return this.contents.length
                    },
                  },
                })
              var f = {}
              return (
                Object.keys(c.stream_ops).forEach(function(e) {
                  var r = c.stream_ops[e]
                  f[e] = function() {
                    if (!be.forceLoadFile(c)) throw new be.ErrnoError(5)
                    return r.apply(null, arguments)
                  }
                }),
                (f.read = function(e, r, t, n, o) {
                  if (!be.forceLoadFile(c)) throw new be.ErrnoError(5)
                  var i = e.node.contents
                  if (o >= i.length) return 0
                  var a = Math.min(i.length - o, n)
                  if (i.slice) for (var s = 0; s < a; s++) r[t + s] = i[o + s]
                  else for (s = 0; s < a; s++) r[t + s] = i.get(o + s)
                  return a
                }),
                (c.stream_ops = f),
                c
              )
            },
            createPreloadedFile: function(e, r, t, o, i, a, s, u, c, f) {
              Browser.init()
              var l = r ? ve.resolve(me.join2(e, r)) : e
              function d(t) {
                function d(t) {
                  f && f(), u || be.createDataFile(e, r, t, o, i, c), a && a(), ae()
                }
                var p = !1
                n.preloadPlugins.forEach(function(e) {
                  p ||
                    (e.canHandle(l) &&
                      (e.handle(t, l, d, function() {
                        s && s(), ae()
                      }),
                      (p = !0)))
                }),
                  p || d(t)
              }
              ie(),
                'string' == typeof t
                  ? Browser.asyncLoad(
                      t,
                      function(e) {
                        d(e)
                      },
                      s
                    )
                  : d(t)
            },
            indexedDB: function() {
              return (
                window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB
              )
            },
            DB_NAME: function() {
              return 'EM_FS_' + window.location.pathname
            },
            DB_VERSION: 20,
            DB_STORE_NAME: 'FILE_DATA',
            saveFilesToDB: function(e, r, t) {
              ;(r = r || function() {}), (t = t || function() {})
              var n = be.indexedDB()
              try {
                var o = n.open(be.DB_NAME(), be.DB_VERSION)
              } catch (e) {
                return t(e)
              }
              ;(o.onupgradeneeded = function() {
                console.log('creating db'), o.result.createObjectStore(be.DB_STORE_NAME)
              }),
                (o.onsuccess = function() {
                  var n = o.result.transaction([be.DB_STORE_NAME], 'readwrite'),
                    i = n.objectStore(be.DB_STORE_NAME),
                    a = 0,
                    s = 0,
                    u = e.length
                  function c() {
                    0 == s ? r() : t()
                  }
                  e.forEach(function(e) {
                    var r = i.put(be.analyzePath(e).object.contents, e)
                    ;(r.onsuccess = function() {
                      ++a + s == u && c()
                    }),
                      (r.onerror = function() {
                        a + ++s == u && c()
                      })
                  }),
                    (n.onerror = t)
                }),
                (o.onerror = t)
            },
            loadFilesFromDB: function(e, r, t) {
              ;(r = r || function() {}), (t = t || function() {})
              var n = be.indexedDB()
              try {
                var o = n.open(be.DB_NAME(), be.DB_VERSION)
              } catch (e) {
                return t(e)
              }
              ;(o.onupgradeneeded = t),
                (o.onsuccess = function() {
                  var n = o.result
                  try {
                    var i = n.transaction([be.DB_STORE_NAME], 'readonly')
                  } catch (e) {
                    return void t(e)
                  }
                  var a = i.objectStore(be.DB_STORE_NAME),
                    s = 0,
                    u = 0,
                    c = e.length
                  function f() {
                    0 == u ? r() : t()
                  }
                  e.forEach(function(e) {
                    var r = a.get(e)
                    ;(r.onsuccess = function() {
                      be.analyzePath(e).exists && be.unlink(e),
                        be.createDataFile(
                          me.dirname(e),
                          me.basename(e),
                          r.result,
                          !0,
                          !0,
                          !0
                        ),
                        ++s + u == c && f()
                    }),
                      (r.onerror = function() {
                        s + ++u == c && f()
                      })
                  }),
                    (i.onerror = t)
                }),
                (o.onerror = t)
            },
          },
          ke = {
            DEFAULT_POLLMASK: 5,
            mappings: {},
            umask: 511,
            calculateAt: function(e, r) {
              if ('/' !== r[0]) {
                var t
                if (-100 === e) t = be.cwd()
                else {
                  var n = be.getStream(e)
                  if (!n) throw new be.ErrnoError(9)
                  t = n.path
                }
                r = me.join2(t, r)
              }
              return r
            },
            doStat: function(e, r, t) {
              try {
                var n = e(r)
              } catch (e) {
                if (e && e.node && me.normalize(r) !== me.normalize(be.getPath(e.node)))
                  return -20
                throw e
              }
              return (
                (M[t >> 2] = n.dev),
                (M[(t + 4) >> 2] = 0),
                (M[(t + 8) >> 2] = n.ino),
                (M[(t + 12) >> 2] = n.mode),
                (M[(t + 16) >> 2] = n.nlink),
                (M[(t + 20) >> 2] = n.uid),
                (M[(t + 24) >> 2] = n.gid),
                (M[(t + 28) >> 2] = n.rdev),
                (M[(t + 32) >> 2] = 0),
                (tempI64 = [
                  n.size >>> 0,
                  ((tempDouble = n.size),
                  +J(tempDouble) >= 1
                    ? tempDouble > 0
                      ? (0 | re(+ee(tempDouble / 4294967296), 4294967295)) >>> 0
                      : ~~+Q((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                    : 0),
                ]),
                (M[(t + 40) >> 2] = tempI64[0]),
                (M[(t + 44) >> 2] = tempI64[1]),
                (M[(t + 48) >> 2] = 4096),
                (M[(t + 52) >> 2] = n.blocks),
                (M[(t + 56) >> 2] = (n.atime.getTime() / 1e3) | 0),
                (M[(t + 60) >> 2] = 0),
                (M[(t + 64) >> 2] = (n.mtime.getTime() / 1e3) | 0),
                (M[(t + 68) >> 2] = 0),
                (M[(t + 72) >> 2] = (n.ctime.getTime() / 1e3) | 0),
                (M[(t + 76) >> 2] = 0),
                (tempI64 = [
                  n.ino >>> 0,
                  ((tempDouble = n.ino),
                  +J(tempDouble) >= 1
                    ? tempDouble > 0
                      ? (0 | re(+ee(tempDouble / 4294967296), 4294967295)) >>> 0
                      : ~~+Q((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                    : 0),
                ]),
                (M[(t + 80) >> 2] = tempI64[0]),
                (M[(t + 84) >> 2] = tempI64[1]),
                0
              )
            },
            doMsync: function(e, r, t, n) {
              var o = new Uint8Array(T.subarray(e, e + t))
              be.msync(r, o, 0, t, n)
            },
            doMkdir: function(e, r) {
              return (
                '/' === (e = me.normalize(e))[e.length - 1] &&
                  (e = e.substr(0, e.length - 1)),
                be.mkdir(e, r, 0),
                0
              )
            },
            doMknod: function(e, r, t) {
              switch (61440 & r) {
                case 32768:
                case 8192:
                case 24576:
                case 4096:
                case 49152:
                  break
                default:
                  return -22
              }
              return be.mknod(e, r, t), 0
            },
            doReadlink: function(e, r, t) {
              if (t <= 0) return -22
              var n = be.readlink(e),
                o = Math.min(t, L(n)),
                i = R[r + o]
              return C(n, r, t + 1), (R[r + o] = i), o
            },
            doAccess: function(e, r) {
              if (-8 & r) return -22
              var t
              t = be.lookupPath(e, { follow: !0 }).node
              var n = ''
              return (
                4 & r && (n += 'r'),
                2 & r && (n += 'w'),
                1 & r && (n += 'x'),
                n && be.nodePermissions(t, n) ? -13 : 0
              )
            },
            doDup: function(e, r, t) {
              var n = be.getStream(t)
              return n && be.close(n), be.open(e, r, 0, t, t).fd
            },
            doReadv: function(e, r, t, n) {
              for (var o = 0, i = 0; i < t; i++) {
                var a = M[(r + 8 * i) >> 2],
                  s = M[(r + (8 * i + 4)) >> 2],
                  u = be.read(e, R, a, s, n)
                if (u < 0) return -1
                if (((o += u), u < s)) break
              }
              return o
            },
            doWritev: function(e, r, t, n) {
              for (var o = 0, i = 0; i < t; i++) {
                var a = M[(r + 8 * i) >> 2],
                  s = M[(r + (8 * i + 4)) >> 2],
                  u = be.write(e, R, a, s, n)
                if (u < 0) return -1
                o += u
              }
              return o
            },
            varargs: 0,
            get: function(e) {
              return (ke.varargs += 4), M[(ke.varargs - 4) >> 2]
            },
            getStr: function() {
              return I(ke.get())
            },
            getStreamFromFD: function() {
              var e = be.getStream(ke.get())
              if (!e) throw new be.ErrnoError(9)
              return e
            },
            get64: function() {
              var e = ke.get()
              return ke.get(), e
            },
            getZero: function() {
              ke.get()
            },
          },
          De = 11,
          Se = 22,
          Fe = {
            BUCKET_BUFFER_SIZE: 8192,
            mount: function(e) {
              return be.createNode(null, '/', 16895, 0)
            },
            createPipe: function() {
              var e = { buckets: [] }
              e.buckets.push({
                buffer: new Uint8Array(Fe.BUCKET_BUFFER_SIZE),
                offset: 0,
                roffset: 0,
              })
              var r = Fe.nextname(),
                t = Fe.nextname(),
                n = be.createNode(Fe.root, r, 4096, 0),
                o = be.createNode(Fe.root, t, 4096, 0)
              ;(n.pipe = e), (o.pipe = e)
              var i = be.createStream({
                path: r,
                node: n,
                flags: be.modeStringToFlags('r'),
                seekable: !1,
                stream_ops: Fe.stream_ops,
              })
              n.stream = i
              var a = be.createStream({
                path: t,
                node: o,
                flags: be.modeStringToFlags('w'),
                seekable: !1,
                stream_ops: Fe.stream_ops,
              })
              return (o.stream = a), { readable_fd: i.fd, writable_fd: a.fd }
            },
            stream_ops: {
              poll: function(e) {
                var r = e.node.pipe
                if (1 == (2097155 & e.flags)) return 260
                if (r.buckets.length > 0)
                  for (var t = 0; t < r.buckets.length; t++) {
                    var n = r.buckets[t]
                    if (n.offset - n.roffset > 0) return 65
                  }
                return 0
              },
              ioctl: function(e, r, t) {
                return Se
              },
              read: function(e, r, t, n, o) {
                for (var i = e.node.pipe, a = 0, s = 0; s < i.buckets.length; s++) {
                  var u = i.buckets[s]
                  a += u.offset - u.roffset
                }
                E(r instanceof ArrayBuffer || ArrayBuffer.isView(r))
                var c = r.subarray(t, t + n)
                if (n <= 0) return 0
                if (0 == a) throw new be.ErrnoError(De)
                var f = Math.min(a, n),
                  l = f,
                  d = 0
                for (s = 0; s < i.buckets.length; s++) {
                  var p = i.buckets[s],
                    m = p.offset - p.roffset
                  if (f <= m) {
                    var h = p.buffer.subarray(p.roffset, p.offset)
                    f < m ? ((h = h.subarray(0, f)), (p.roffset += f)) : d++, c.set(h)
                    break
                  }
                  ;(h = p.buffer.subarray(p.roffset, p.offset)),
                    c.set(h),
                    (c = c.subarray(h.byteLength)),
                    (f -= h.byteLength),
                    d++
                }
                return (
                  d &&
                    d == i.buckets.length &&
                    (d--, (i.buckets[d].offset = 0), (i.buckets[d].roffset = 0)),
                  i.buckets.splice(0, d),
                  l
                )
              },
              write: function(e, r, t, n, o) {
                var i = e.node.pipe
                E(r instanceof ArrayBuffer || ArrayBuffer.isView(r))
                var a = r.subarray(t, t + n),
                  s = a.byteLength
                if (s <= 0) return 0
                var u = null
                0 == i.buckets.length
                  ? ((u = {
                      buffer: new Uint8Array(Fe.BUCKET_BUFFER_SIZE),
                      offset: 0,
                      roffset: 0,
                    }),
                    i.buckets.push(u))
                  : (u = i.buckets[i.buckets.length - 1]),
                  E(u.offset <= Fe.BUCKET_BUFFER_SIZE)
                var c = Fe.BUCKET_BUFFER_SIZE - u.offset
                if (c >= s) return u.buffer.set(a, u.offset), (u.offset += s), s
                c > 0 &&
                  (u.buffer.set(a.subarray(0, c), u.offset),
                  (u.offset += c),
                  (a = a.subarray(c, a.byteLength)))
                for (
                  var f = (a.byteLength / Fe.BUCKET_BUFFER_SIZE) | 0,
                    l = a.byteLength % Fe.BUCKET_BUFFER_SIZE,
                    d = 0;
                  d < f;
                  d++
                ) {
                  var p = {
                    buffer: new Uint8Array(Fe.BUCKET_BUFFER_SIZE),
                    offset: Fe.BUCKET_BUFFER_SIZE,
                    roffset: 0,
                  }
                  i.buckets.push(p),
                    p.buffer.set(a.subarray(0, Fe.BUCKET_BUFFER_SIZE)),
                    (a = a.subarray(Fe.BUCKET_BUFFER_SIZE, a.byteLength))
                }
                return (
                  l > 0 &&
                    ((p = {
                      buffer: new Uint8Array(Fe.BUCKET_BUFFER_SIZE),
                      offset: a.byteLength,
                      roffset: 0,
                    }),
                    i.buckets.push(p),
                    p.buffer.set(a)),
                  s
                )
              },
              close: function(e) {
                e.node.pipe.buckets = null
              },
            },
            nextname: function() {
              return (
                Fe.nextname.current || (Fe.nextname.current = 0),
                'pipe[' + Fe.nextname.current++ + ']'
              )
            },
          }
        function Ae() {
          return R.length
        }
        function Re(e) {
          var r = Ae()
          if (e > 2147418112) return !1
          for (var t = Math.max(r, 16777216); t < e; )
            t =
              t <= 536870912
                ? H(2 * t, 65536)
                : Math.min(H((3 * t + 2147483648) / 4, 65536), 2147418112)
          return (
            !!(function(e) {
              e = H(e, 65536)
              var r = A.byteLength
              try {
                return -1 !== v.grow((e - r) / 65536) && ((A = v.buffer), !0)
              } catch (e) {
                return !1
              }
            })(t) && (W(), !0)
          )
        }
        var Te = 277408
        function Pe() {
          if (!Pe.called) {
            ;(Pe.called = !0), (M[Ce() >> 2] = 60 * new Date().getTimezoneOffset())
            var e = new Date(2e3, 0, 1),
              r = new Date(2e3, 6, 1)
            M[ze() >> 2] = Number(e.getTimezoneOffset() != r.getTimezoneOffset())
            var t = a(e),
              n = a(r),
              o = S(Ne(t), 'i8', k),
              i = S(Ne(n), 'i8', k)
            r.getTimezoneOffset() < e.getTimezoneOffset()
              ? ((M[Le() >> 2] = o), (M[(Le() + 4) >> 2] = i))
              : ((M[Le() >> 2] = i), (M[(Le() + 4) >> 2] = o))
          }
          function a(e) {
            var r = e.toTimeString().match(/\(([A-Za-z ]+)\)$/)
            return r ? r[1] : 'GMT'
          }
        }
        if ((C('GMT', 277456, 4), be.staticInit(), i)) {
          var Me = require('fs'),
            Be = require('path')
          ge.staticInit()
        }
        function Ne(e, r, t) {
          var n = t > 0 ? t : L(e) + 1,
            o = new Array(n),
            i = z(e, o, 0, o.length)
          return r && (o.length = i), o
        }
        var Oe = {
            b: Ze,
            q: function(e) {},
            G: function e(r) {
              var t, o
              e.called
                ? ((o = M[r >> 2]), (t = M[o >> 2]))
                : ((e.called = !0),
                  (pe.USER = pe.LOGNAME = 'web_user'),
                  (pe.PATH = '/'),
                  (pe.PWD = '/'),
                  (pe.HOME = '/home/web_user'),
                  (pe.LANG = 'C.UTF-8'),
                  (pe._ = n.thisProgram),
                  (t = F(1024)),
                  (o = F(256)),
                  (M[o >> 2] = t),
                  (M[r >> 2] = o))
              var i = [],
                a = 0
              for (var s in pe)
                if ('string' == typeof pe[s]) {
                  var u = s + '=' + pe[s]
                  i.push(u), (a += u.length)
                }
              if (a > 1024) throw new Error('Environment size exceeded TOTAL_ENV_SIZE!')
              for (var c = 0; c < i.length; c++)
                U((u = i[c]), t), (M[(o + 4 * c) >> 2] = t), (t += u.length + 1)
              M[(o + 4 * i.length) >> 2] = 0
            },
            l: he,
            s: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD(),
                  n = ke.get(),
                  o = ke.get(),
                  i = ke.get(),
                  a = ke.get()
                if (!((-1 == n && o < 0) || (0 == n && o >= 0))) return -75
                var s = o
                return (
                  be.llseek(t, s, a),
                  (tempI64 = [
                    t.position >>> 0,
                    ((tempDouble = t.position),
                    +J(tempDouble) >= 1
                      ? tempDouble > 0
                        ? (0 | re(+ee(tempDouble / 4294967296), 4294967295)) >>> 0
                        : ~~+Q((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                      : 0),
                  ]),
                  (M[i >> 2] = tempI64[0]),
                  (M[(i + 4) >> 2] = tempI64[1]),
                  t.getdents && 0 === s && 0 === a && (t.getdents = null),
                  0
                )
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            i: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD(),
                  n = ke.get(),
                  o = ke.get()
                return ke.doWritev(t, n, o)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            p: function(e, r) {
              ke.varargs = r
              try {
                for (
                  var t = ke.get(), n = ke.get(), o = (ke.get(), 0), i = 0;
                  i < n;
                  i++
                ) {
                  var a = t + 8 * i,
                    s = M[a >> 2],
                    u = P[(a + 4) >> 1],
                    c = 32,
                    f = be.getStream(s)
                  f &&
                    ((c = ke.DEFAULT_POLLMASK),
                    f.stream_ops.poll && (c = f.stream_ops.poll(f))),
                    (c &= 24 | u) && o++,
                    (P[(a + 6) >> 1] = c)
                }
                return o
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            o: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStr(),
                  n = ke.get()
                return ke.doStat(be.stat, t, n)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            n: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStr(),
                  n = ke.get()
                return ke.doStat(be.lstat, t, n)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            m: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD(),
                  n = ke.get()
                return ke.doStat(be.stat, t.path, n)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            c: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD()
                switch (ke.get()) {
                  case 0:
                    return (n = ke.get()) < 0 ? -22 : be.open(t.path, t.flags, 0, n).fd
                  case 1:
                  case 2:
                    return 0
                  case 3:
                    return t.flags
                  case 4:
                    var n = ke.get()
                    return (t.flags |= n), 0
                  case 12:
                    return (n = ke.get()), (P[(n + 0) >> 1] = 2), 0
                  case 13:
                  case 14:
                    return 0
                  case 16:
                  case 8:
                    return -22
                  case 9:
                    return he(22), -1
                  default:
                    return -22
                }
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            F: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD(),
                  n = ke.get(),
                  o = ke.get()
                return be.read(t, R, n, o)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            E: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD(),
                  n = ke.get(),
                  o = ke.get()
                return be.write(t, R, n, o)
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            D: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD()
                return be.open(t.path, t.flags, 0).fd
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            C: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.get()
                if (0 == t) throw new be.ErrnoError(14)
                var n = Fe.createPipe()
                return (M[t >> 2] = n.readable_fd), (M[(t + 4) >> 2] = n.writable_fd), 0
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            B: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStr(),
                  n = ke.get(),
                  o = ke.get()
                return be.open(t, n, o).fd
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            h: function(e, r) {
              ke.varargs = r
              try {
                var t = ke.getStreamFromFD()
                return be.close(t), 0
              } catch (e) {
                return (void 0 !== be && e instanceof be.ErrnoError) || Ze(e), -e.errno
              }
            },
            g: function() {
              n.abort()
            },
            A: Ae,
            z: function(e, r, t) {
              T.set(T.subarray(r, r + t), e)
            },
            y: Re,
            f: function(e) {
              !(function(e, r) {
                ;(r && n.noExitRuntime && 0 === e) ||
                  (n.noExitRuntime || ((y = !0), n.onExit && n.onExit(e)),
                  n.quit(e, new qe(e)))
              })(e)
            },
            x: function(e) {
              return (function(e, r) {
                Pe()
                var t = new Date(1e3 * M[e >> 2])
                ;(M[r >> 2] = t.getSeconds()),
                  (M[(r + 4) >> 2] = t.getMinutes()),
                  (M[(r + 8) >> 2] = t.getHours()),
                  (M[(r + 12) >> 2] = t.getDate()),
                  (M[(r + 16) >> 2] = t.getMonth()),
                  (M[(r + 20) >> 2] = t.getFullYear() - 1900),
                  (M[(r + 24) >> 2] = t.getDay())
                var n = new Date(t.getFullYear(), 0, 1),
                  o = ((t.getTime() - n.getTime()) / 864e5) | 0
                ;(M[(r + 28) >> 2] = o), (M[(r + 36) >> 2] = -60 * t.getTimezoneOffset())
                var i = new Date(2e3, 6, 1).getTimezoneOffset(),
                  a = n.getTimezoneOffset(),
                  s = 0 | (i != a && t.getTimezoneOffset() == Math.min(a, i))
                M[(r + 32) >> 2] = s
                var u = M[(Le() + (s ? 4 : 0)) >> 2]
                return (M[(r + 40) >> 2] = u), r
              })(e, Te)
            },
            d: function(e) {
              Pe()
              var r = new Date(
                  M[(e + 20) >> 2] + 1900,
                  M[(e + 16) >> 2],
                  M[(e + 12) >> 2],
                  M[(e + 8) >> 2],
                  M[(e + 4) >> 2],
                  M[e >> 2],
                  0
                ),
                t = M[(e + 32) >> 2],
                n = r.getTimezoneOffset(),
                o = new Date(r.getFullYear(), 0, 1),
                i = new Date(2e3, 6, 1).getTimezoneOffset(),
                a = o.getTimezoneOffset(),
                s = Math.min(a, i)
              if (t < 0) M[(e + 32) >> 2] = Number(i != a && s == n)
              else if (t > 0 != (s == n)) {
                var u = Math.max(a, i),
                  c = t > 0 ? s : u
                r.setTime(r.getTime() + 6e4 * (c - n))
              }
              M[(e + 24) >> 2] = r.getDay()
              var f = ((r.getTime() - o.getTime()) / 864e5) | 0
              return (M[(e + 28) >> 2] = f), (r.getTime() / 1e3) | 0
            },
            e: function() {
              p('missing function: posix_spawn_file_actions_addclose'), Ze(-1)
            },
            k: function() {
              p('missing function: posix_spawn_file_actions_adddup2'), Ze(-1)
            },
            j: function() {
              p('missing function: posix_spawn_file_actions_destroy'), Ze(-1)
            },
            w: function() {
              p('missing function: posix_spawn_file_actions_init'), Ze(-1)
            },
            v: function() {
              return function() {
                return he(11), -1
              }.apply(null, arguments)
            },
            u: function(e) {
              Pe()
              var r = Date.UTC(
                  M[(e + 20) >> 2] + 1900,
                  M[(e + 16) >> 2],
                  M[(e + 12) >> 2],
                  M[(e + 8) >> 2],
                  M[(e + 4) >> 2],
                  M[e >> 2],
                  0
                ),
                t = new Date(r)
              M[(e + 24) >> 2] = t.getUTCDay()
              var n = Date.UTC(t.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
                o = ((t.getTime() - n) / 864e5) | 0
              return (M[(e + 28) >> 2] = o), (t.getTime() / 1e3) | 0
            },
            t: function() {
              return function(e) {
                return he(10), -1
              }.apply(null, arguments)
            },
            r: function(e) {
              Ze('OOM')
            },
            a: q,
          },
          xe = n.asm({}, Oe, A)
        n.asm = xe
        var Ie = (n.___emscripten_environ_constructor = function() {
            return n.asm.H.apply(null, arguments)
          }),
          ze =
            ((n.___errno_location = function() {
              return n.asm.I.apply(null, arguments)
            }),
            (n.__get_daylight = function() {
              return n.asm.J.apply(null, arguments)
            })),
          Ce = (n.__get_timezone = function() {
            return n.asm.K.apply(null, arguments)
          }),
          Le = (n.__get_tzname = function() {
            return n.asm.L.apply(null, arguments)
          }),
          Ue =
            ((n._archive_close = function() {
              return n.asm.M.apply(null, arguments)
            }),
            (n._archive_entry_filetype = function() {
              return n.asm.N.apply(null, arguments)
            }),
            (n._archive_entry_is_encrypted = function() {
              return n.asm.O.apply(null, arguments)
            }),
            (n._archive_entry_pathname = function() {
              return n.asm.P.apply(null, arguments)
            }),
            (n._archive_entry_pathname_utf8 = function() {
              return n.asm.Q.apply(null, arguments)
            }),
            (n._archive_entry_size = function() {
              return n.asm.R.apply(null, arguments)
            }),
            (n._archive_error_string = function() {
              return n.asm.S.apply(null, arguments)
            }),
            (n._archive_open = function() {
              return n.asm.T.apply(null, arguments)
            }),
            (n._archive_read_add_passphrase = function() {
              return n.asm.U.apply(null, arguments)
            }),
            (n._archive_read_data_skip = function() {
              return n.asm.V.apply(null, arguments)
            }),
            (n._archive_read_has_encrypted_entries = function() {
              return n.asm.W.apply(null, arguments)
            }),
            (n._free = function() {
              return n.asm.X.apply(null, arguments)
            }),
            (n._get_filedata = function() {
              return n.asm.Y.apply(null, arguments)
            }),
            (n._get_next_entry = function() {
              return n.asm.Z.apply(null, arguments)
            }),
            (n._get_version = function() {
              return n.asm._.apply(null, arguments)
            }),
            (n._malloc = function() {
              return n.asm.$.apply(null, arguments)
            })),
          je = (n.stackAlloc = function() {
            return n.asm.ca.apply(null, arguments)
          }),
          He = (n.stackRestore = function() {
            return n.asm.da.apply(null, arguments)
          }),
          We = (n.stackSave = function() {
            return n.asm.ea.apply(null, arguments)
          })
        function qe(e) {
          ;(this.name = 'ExitStatus'),
            (this.message = 'Program terminated with exit(' + e + ')'),
            (this.status = e)
        }
        function Ke(e) {
          function r() {
            n.calledRun ||
              ((n.calledRun = !0),
              y ||
                ($ ||
                  (($ = !0),
                  n.noFSInit || be.init.initialized || be.init(),
                  (Fe.root = be.mount(Fe, {}, null)),
                  Z(X)),
                (be.ignorePermissions = !1),
                Z(Y),
                n.onRuntimeInitialized && n.onRuntimeInitialized(),
                (function() {
                  if (n.postRun)
                    for (
                      'function' == typeof n.postRun && (n.postRun = [n.postRun]);
                      n.postRun.length;

                    )
                      (e = n.postRun.shift()), G.unshift(e)
                  var e
                  Z(G)
                })()))
          }
          ;(e = e || n.arguments),
            te > 0 ||
              ((function() {
                if (n.preRun)
                  for (
                    'function' == typeof n.preRun && (n.preRun = [n.preRun]);
                    n.preRun.length;

                  )
                    (e = n.preRun.shift()), V.unshift(e)
                var e
                Z(V)
              })(),
              te > 0 ||
                n.calledRun ||
                (n.setStatus
                  ? (n.setStatus('Running...'),
                    setTimeout(function() {
                      setTimeout(function() {
                        n.setStatus('')
                      }, 1),
                        r()
                    }, 1))
                  : r()))
        }
        function Ze(e) {
          throw (n.onAbort && n.onAbort(e),
          void 0 !== e ? (d(e), p(e), (e = JSON.stringify(e))) : (e = ''),
          (y = !0),
          'abort(' + e + '). Build with -s ASSERTIONS=1 for more info.')
        }
        if (
          ((n.dynCall_v = function() {
            return n.asm.aa.apply(null, arguments)
          }),
          (n.dynCall_vi = function() {
            return n.asm.ba.apply(null, arguments)
          }),
          (n.asm = xe),
          (n.intArrayFromString = Ne),
          (n.cwrap = function(e, r, t, n) {
            var o = (t = t || []).every(function(e) {
              return 'number' === e
            })
            return 'string' !== r && o && !n
              ? g(e)
              : function() {
                  return _(e, r, t, arguments)
                }
          }),
          (n.allocate = S),
          (n.then = function(e) {
            if (n.calledRun) e(n)
            else {
              var r = n.onRuntimeInitialized
              n.onRuntimeInitialized = function() {
                r && r(), e(n)
              }
            }
            return n
          }),
          (qe.prototype = new Error()),
          (qe.prototype.constructor = qe),
          (oe = function e() {
            n.calledRun || Ke(), n.calledRun || (oe = e)
          }),
          (n.run = Ke),
          (n.abort = Ze),
          n.preInit)
        )
          for (
            'function' == typeof n.preInit && (n.preInit = [n.preInit]);
            n.preInit.length > 0;

          )
            n.preInit.pop()()
        return (n.noExitRuntime = !0), Ke(), e
      })
  class o {
    constructor() {
      ;(this.preRun = []), (this.postRun = []), (this.totalDependencies = 0)
    }
    print(...e) {
      console.log(e)
    }
    printErr(...e) {
      console.error(e)
    }
    initFunctions() {
      this.runCode = {
        getVersion: this.cwrap('get_version', 'string', []),
        openArchive: this.cwrap('archive_open', 'number', ['number', 'number', 'string']),
        getNextEntry: this.cwrap('get_next_entry', 'number', ['number']),
        getFileData: this.cwrap('get_filedata', 'number', ['number', 'number']),
        skipEntry: this.cwrap('archive_read_data_skip', 'number', ['number']),
        closeArchive: this.cwrap('archive_close', null, ['number']),
        getEntrySize: this.cwrap('archive_entry_size', 'number', ['number']),
        getEntryName: this.cwrap('archive_entry_pathname', 'string', ['number']),
        getEntryType: this.cwrap('archive_entry_filetype', 'number', ['number']),
        getError: this.cwrap('archive_error_string', 'string', ['number']),
        entryIsEncrypted: this.cwrap('archive_entry_is_encrypted', 'number', ['number']),
        hasEncryptedEntries: this.cwrap('archive_read_has_encrypted_entries', 'number', [
          'number',
        ]),
        addPassphrase: this.cwrap('archive_read_add_passphrase', 'number', [
          'number',
          'string',
        ]),
        string: e => this.allocate(this.intArrayFromString(e), 'i8', 0),
        malloc: this.cwrap('malloc', 'number', ['number']),
        free: this.cwrap('free', null, ['number']),
      }
    }
    monitorRunDependencies() {}
    locateFile(e) {
      return `wasm-gen/${e}`
    }
  }
  let i = null,
    a = !1
  var s
  ;(s = e => {
    ;(i = new r(e)), (a = !1), self.postMessage({ type: 'READY' })
  }),
    n(new o()).then(e => {
      e.initFunctions(), s(e)
    }),
    (self.onmessage = async ({ data: e }) => {
      if (a) return void self.postMessage({ type: 'BUSY' })
      let r = !1
      a = !0
      try {
        switch (e.type) {
          case 'HELLO':
            break
          case 'OPEN':
            await i.open(e.file), self.postMessage({ type: 'OPENED' })
            break
          case 'LIST_FILES':
            r = !0
          case 'EXTRACT_FILES':
            for (const e of i.entries(r)) self.postMessage({ type: 'ENTRY', entry: e })
            self.postMessage({ type: 'END' })
            break
          case 'EXTRACT_SINGLE_FILE':
            for (const r of i.entries(!0, e.target))
              r.fileData && self.postMessage({ type: 'FILE', entry: r })
            break
          case 'CHECK_ENCRYPTION':
            self.postMessage({ type: 'ENCRYPTION_STATUS', status: i.hasEncryptedData() })
            break
          case 'SET_PASSPHRASE':
            i.setPassphrase(e.passphrase),
              self.postMessage({ type: 'PASSPHRASE_STATUS', status: !0 })
            break
          default:
            throw new Error('Invalid Command')
        }
      } catch (e) {
        self.postMessage({
          type: 'ERROR',
          error: { message: e.message, name: e.name, stack: e.stack },
        })
      } finally {
        a = !1
      }
    })
})()
