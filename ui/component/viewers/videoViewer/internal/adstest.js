/* eslint-disable */
import videojs from 'video.js/dist/alt/video.core.novtt.min.js';

(function t(e, i, n) {
  function r(s, o) {
    if (!i[s]) {
      if (!e[s]) {
        var u = typeof require == 'function' && require;
        if (!o && u) return u(s, !0);
        if (a) return a(s, !0);
        var l = new Error("Cannot find module '" + s + "'");
        throw ((l.code = 'MODULE_NOT_FOUND'), l);
      }
      var c = (i[s] = { exports: {} });
      e[s][0].call(
        c.exports,
        function(t) {
          var i = e[s][1][t];
          return r(i ? i : t);
        },
        c,
        c.exports,
        t,
        e,
        i,
        n
      );
    }
    return i[s].exports;
  }
  var a = typeof require == 'function' && require;
  for (var s = 0; s < n.length; s++) r(n[s]);
  return r;
})(
  {
    1: [
      function(t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: true });
        var n = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function r(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        var a = (i.IVPAIDAdUnit = (function() {
          function t() {
            r(this, t);
          }
          n(t, [
            {
              key: 'handshakeVersion',
              value: function e() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? '2.0' : arguments[0];
                var e = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
              },
            },
            {
              key: 'initAd',
              value: function i(t, e, n, r) {
                var a = arguments.length <= 4 || arguments[4] === undefined ? { AdParameters: '' } : arguments[4];
                var s = arguments.length <= 5 || arguments[5] === undefined ? { flashVars: '' } : arguments[5];
                var o = arguments.length <= 6 || arguments[6] === undefined ? undefined : arguments[6];
              },
            },
            {
              key: 'resizeAd',
              value: function a(t, e, i) {
                var n = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
              },
            },
            {
              key: 'startAd',
              value: function s() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'stopAd',
              value: function o() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'pauseAd',
              value: function u() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'resumeAd',
              value: function l() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'expandAd',
              value: function c() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'collapseAd',
              value: function d() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            {
              key: 'skipAd',
              value: function f() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
              },
            },
            { key: 'getAdLinear', value: function h(t) {} },
            { key: 'getAdWidth', value: function p(t) {} },
            { key: 'getAdHeight', value: function v(t) {} },
            { key: 'getAdExpanded', value: function y(t) {} },
            { key: 'getAdSkippableState', value: function g(t) {} },
            { key: 'getAdRemainingTime', value: function m(t) {} },
            { key: 'getAdDuration', value: function A(t) {} },
            {
              key: 'setAdVolume',
              value: function k(t) {
                var e = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
              },
            },
            { key: 'getAdVolume', value: function _(t) {} },
            { key: 'getAdCompanions', value: function b(t) {} },
            { key: 'getAdIcons', value: function w(t) {} },
          ]);
          return t;
        })());
        Object.defineProperty(a, 'EVENTS', {
          writable: false,
          configurable: false,
          value: [
            'AdLoaded',
            'AdStarted',
            'AdStopped',
            'AdSkipped',
            'AdSkippableStateChange',
            'AdSizeChange',
            'AdLinearChange',
            'AdDurationChange',
            'AdExpandedChange',
            'AdRemainingTimeChange',
            'AdVolumeChange',
            'AdImpression',
            'AdVideoStart',
            'AdVideoFirstQuartile',
            'AdVideoMidpoint',
            'AdVideoThirdQuartile',
            'AdVideoComplete',
            'AdClickThru',
            'AdInteraction',
            'AdUserAcceptInvitation',
            'AdUserMinimize',
            'AdUserClose',
            'AdPaused',
            'AdPlaying',
            'AdLog',
            'AdError',
          ],
        });
      },
      {},
    ],
    2: [
      function(t, e, i) {
        'use strict';
        var n =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function(t) {
                return typeof t;
              }
            : function(t) {
                return t && typeof Symbol === 'function' && t.constructor === Symbol ? 'symbol' : typeof t;
              };
        Object.defineProperty(i, '__esModule', { value: true });
        var r = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function a(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        function s(t, e) {
          if (!t) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }
          return e && ((typeof e === 'undefined' ? 'undefined' : n(e)) === 'object' || typeof e === 'function') ? e : t;
        }
        function o(t, e) {
          if (typeof e !== 'function' && e !== null) {
            throw new TypeError(
              'Super expression must either be null or a function, not ' +
                (typeof e === 'undefined' ? 'undefined' : n(e))
            );
          }
          t.prototype = Object.create(e && e.prototype, {
            constructor: { value: t, enumerable: false, writable: true, configurable: true },
          });
          if (e) Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e);
        }
        var u = t('./IVPAIDAdUnit').IVPAIDAdUnit;
        var l = Object.getOwnPropertyNames(u.prototype).filter(function(t) {
          return ['constructor'].indexOf(t) === -1;
        });
        var c = (i.VPAIDAdUnit = (function(t) {
          o(e, t);
          function e(t) {
            a(this, e);
            var i = s(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
            i._destroyed = false;
            i._flash = t;
            return i;
          }
          r(e, [
            {
              key: '_destroy',
              value: function i() {
                var t = this;
                this._destroyed = true;
                l.forEach(function(e) {
                  t._flash.removeCallbackByMethodName(e);
                });
                u.EVENTS.forEach(function(e) {
                  t._flash.offEvent(e);
                });
                this._flash = null;
              },
            },
            {
              key: 'isDestroyed',
              value: function n() {
                return this._destroyed;
              },
            },
            {
              key: 'on',
              value: function c(t, e) {
                this._flash.on(t, e);
              },
            },
            {
              key: 'off',
              value: function d(t, e) {
                this._flash.off(t, e);
              },
            },
            {
              key: 'handshakeVersion',
              value: function f() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? '2.0' : arguments[0];
                var e = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
                this._flash.callFlashMethod('handshakeVersion', [t], e);
              },
            },
            {
              key: 'initAd',
              value: function h(t, e, i, n) {
                var r = arguments.length <= 4 || arguments[4] === undefined ? { AdParameters: '' } : arguments[4];
                var a = arguments.length <= 5 || arguments[5] === undefined ? { flashVars: '' } : arguments[5];
                var s = arguments.length <= 6 || arguments[6] === undefined ? undefined : arguments[6];
                this._flash.setSize(t, e);
                r = r || { AdParameters: '' };
                a = a || { flashVars: '' };
                this._flash.callFlashMethod(
                  'initAd',
                  [this._flash.getWidth(), this._flash.getHeight(), i, n, r.AdParameters || '', a.flashVars || ''],
                  s
                );
              },
            },
            {
              key: 'resizeAd',
              value: function p(t, e, i) {
                var n = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
                this._flash.setSize(t, e);
                this._flash.callFlashMethod('resizeAd', [this._flash.getWidth(), this._flash.getHeight(), i], n);
              },
            },
            {
              key: 'startAd',
              value: function v() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('startAd', [], t);
              },
            },
            {
              key: 'stopAd',
              value: function y() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('stopAd', [], t);
              },
            },
            {
              key: 'pauseAd',
              value: function g() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('pauseAd', [], t);
              },
            },
            {
              key: 'resumeAd',
              value: function m() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('resumeAd', [], t);
              },
            },
            {
              key: 'expandAd',
              value: function A() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('expandAd', [], t);
              },
            },
            {
              key: 'collapseAd',
              value: function k() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('collapseAd', [], t);
              },
            },
            {
              key: 'skipAd',
              value: function _() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                this._flash.callFlashMethod('skipAd', [], t);
              },
            },
            {
              key: 'getAdLinear',
              value: function b(t) {
                this._flash.callFlashMethod('getAdLinear', [], t);
              },
            },
            {
              key: 'getAdWidth',
              value: function w(t) {
                this._flash.callFlashMethod('getAdWidth', [], t);
              },
            },
            {
              key: 'getAdHeight',
              value: function T(t) {
                this._flash.callFlashMethod('getAdHeight', [], t);
              },
            },
            {
              key: 'getAdExpanded',
              value: function E(t) {
                this._flash.callFlashMethod('getAdExpanded', [], t);
              },
            },
            {
              key: 'getAdSkippableState',
              value: function S(t) {
                this._flash.callFlashMethod('getAdSkippableState', [], t);
              },
            },
            {
              key: 'getAdRemainingTime',
              value: function V(t) {
                this._flash.callFlashMethod('getAdRemainingTime', [], t);
              },
            },
            {
              key: 'getAdDuration',
              value: function C(t) {
                this._flash.callFlashMethod('getAdDuration', [], t);
              },
            },
            {
              key: 'setAdVolume',
              value: function I(t) {
                var e = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
                this._flash.callFlashMethod('setAdVolume', [t], e);
              },
            },
            {
              key: 'getAdVolume',
              value: function F(t) {
                this._flash.callFlashMethod('getAdVolume', [], t);
              },
            },
            {
              key: 'getAdCompanions',
              value: function L(t) {
                this._flash.callFlashMethod('getAdCompanions', [], t);
              },
            },
            {
              key: 'getAdIcons',
              value: function U(t) {
                this._flash.callFlashMethod('getAdIcons', [], t);
              },
            },
          ]);
          return e;
        })(u));
      },
      { './IVPAIDAdUnit': 1 },
    ],
    3: [
      function(t, e, i) {
        'use strict';
        var n = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function r(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        var a = t('swfobject');
        var s = t('./jsFlashBridge').JSFlashBridge;
        var o = t('./VPAIDAdUnit').VPAIDAdUnit;
        var u = t('./utils').noop;
        var l = t('./utils').callbackTimeout;
        var c = t('./utils').isPositiveInt;
        var d = t('./utils').createElementWithID;
        var f = t('./utils').unique('vpaid');
        var h = t('./flashTester.js').createFlashTester;
        var p = 'error';
        var v = '10.1.0';
        var y = {
          isSupported: function _() {
            return true;
          },
        };
        var g = (function() {
          function t(e, i) {
            var n =
              arguments.length <= 2 || arguments[2] === undefined
                ? { data: 'VPAIDFlash.swf', width: 800, height: 400 }
                : arguments[2];
            var o = this;
            var h =
              arguments.length <= 3 || arguments[3] === undefined
                ? {
                    wmode: 'transparent',
                    salign: 'tl',
                    align: 'left',
                    allowScriptAccess: 'always',
                    scale: 'noScale',
                    allowFullScreen: 'true',
                    quality: 'high',
                  }
                : arguments[3];
            var p = arguments.length <= 4 || arguments[4] === undefined ? { debug: false, timeout: 1e4 } : arguments[4];
            r(this, t);
            var y = this;
            this._vpaidParentEl = e;
            this._flashID = f();
            this._destroyed = false;
            i = i || u;
            n.width = c(n.width, 800);
            n.height = c(n.height, 400);
            d(e, this._flashID, true);
            h.movie = n.data;
            h.FlashVars =
              'flashid=' +
              this._flashID +
              '&handler=' +
              s.VPAID_FLASH_HANDLER +
              '&debug=' +
              p.debug +
              '&salign=' +
              h.salign;
            if (!t.isSupported()) {
              return m("user don't support flash or doesn't have the minimum required version of flash " + v);
            }
            this.el = a.createSWF(n, h, this._flashID);
            if (!this.el) {
              return m('swfobject failed to create object in element');
            }
            var g = l(
              p.timeout,
              function(t, e) {
                A.call(o);
                i(t, e);
              },
              function() {
                i('vpaid flash load timeout ' + p.timeout);
              }
            );
            this._flash = new s(this.el, n.data, this._flashID, n.width, n.height, g);
            function m(t) {
              setTimeout(function() {
                i(new Error(t));
              }, 0);
              return y;
            }
          }
          n(t, [
            {
              key: 'destroy',
              value: function e() {
                this._destroyAdUnit();
                if (this._flash) {
                  this._flash.destroy();
                  this._flash = null;
                }
                this.el = null;
                this._destroyed = true;
              },
            },
            {
              key: 'isDestroyed',
              value: function i() {
                return this._destroyed;
              },
            },
            {
              key: '_destroyAdUnit',
              value: function h() {
                delete this._loadLater;
                if (this._adUnitLoad) {
                  this._adUnitLoad = null;
                  this._flash.removeCallback(this._adUnitLoad);
                }
                if (this._adUnit) {
                  this._adUnit._destroy();
                  this._adUnit = null;
                }
              },
            },
            {
              key: 'loadAdUnit',
              value: function p(t, e) {
                var i = this;
                m.call(this);
                if (this._adUnit) {
                  this._destroyAdUnit();
                }
                if (this._flash.isReady()) {
                  this._adUnitLoad = function(t, n) {
                    if (!t) {
                      i._adUnit = new o(i._flash);
                    }
                    i._adUnitLoad = null;
                    e(t, i._adUnit);
                  };
                  this._flash.callFlashMethod('loadAdUnit', [t], this._adUnitLoad);
                } else {
                  this._loadLater = { url: t, callback: e };
                }
              },
            },
            {
              key: 'unloadAdUnit',
              value: function y() {
                var t = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
                m.call(this);
                this._destroyAdUnit();
                this._flash.callFlashMethod('unloadAdUnit', [], t);
              },
            },
            {
              key: 'getFlashID',
              value: function g() {
                m.call(this);
                return this._flash.getFlashID();
              },
            },
            {
              key: 'getFlashURL',
              value: function k() {
                m.call(this);
                return this._flash.getFlashURL();
              },
            },
          ]);
          return t;
        })();
        k(
          'isSupported',
          function() {
            return a.hasFlashPlayerVersion(v) && y.isSupported();
          },
          true
        );
        k('runFlashTest', function(t) {
          y = h(document.body, t);
        });
        function m() {
          if (this._destroyed) {
            throw new Error('VPAIDFlashToJS is destroyed!');
          }
        }
        function A() {
          if (this._loadLater) {
            this.loadAdUnit(this._loadLater.url, this._loadLater.callback);
            delete this._loadLater;
          }
        }
        function k(t, e) {
          var i = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          Object.defineProperty(g, t, { writable: i, configurable: false, value: e });
        }
        g.swfobject = a;
        e.exports = g;
      },
      { './VPAIDAdUnit': 2, './flashTester.js': 4, './jsFlashBridge': 5, './utils': 8, swfobject: 14 },
    ],
    4: [
      function(t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: true });
        var n = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function r(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        var a = t('swfobject');
        var s = 'vpaid_video_flash_tester';
        var o = 'vpaid_video_flash_tester_el';
        var u = t('./jsFlashBridge').JSFlashBridge;
        var l = t('./utils');
        var c = t('./registry').MultipleValuesRegistry;
        var d = (function() {
          function t(e) {
            var i = this;
            var n =
              arguments.length <= 1 || arguments[1] === undefined
                ? { data: 'VPAIDFlash.swf', width: 800, height: 400 }
                : arguments[1];
            r(this, t);
            this.parentEl = l.createElementWithID(e, o);
            l.hideFlashEl(this.parentEl);
            var s = {};
            s.movie = n.data;
            s.FlashVars = 'flashid=' + o + '&handler=' + u.VPAID_FLASH_HANDLER;
            s.allowScriptAccess = 'always';
            this.el = a.createSWF(n, s, o);
            this._handlers = new c();
            this._isSupported = false;
            if (this.el) {
              l.hideFlashEl(this.el);
              this._flash = new u(this.el, n.data, o, n.width, n.height, function() {
                var t = true;
                i._isSupported = t;
                i._handlers.get('change').forEach(function(e) {
                  setTimeout(function() {
                    e('change', t);
                  }, 0);
                });
              });
            }
          }
          n(t, [
            {
              key: 'isSupported',
              value: function e() {
                return this._isSupported;
              },
            },
            {
              key: 'on',
              value: function i(t, e) {
                this._handlers.add(t, e);
              },
            },
          ]);
          return t;
        })();
        var f = (i.createFlashTester = function h(t, e) {
          if (!window[s]) {
            window[s] = new d(t, e);
          }
          return window[s];
        });
      },
      { './jsFlashBridge': 5, './registry': 7, './utils': 8, swfobject: 14 },
    ],
    5: [
      function(t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: true });
        var n = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function r(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        var a = t('./utils').unique;
        var s = t('./utils').isPositiveInt;
        var o = t('./utils').stringEndsWith;
        var u = t('./registry').SingleValueRegistry;
        var l = t('./registry').MultipleValuesRegistry;
        var c = t('./jsFlashBridgeRegistry');
        var d = 'vpaid_video_flash_handler';
        var f = 'AdError';
        var h = (i.JSFlashBridge = (function() {
          function t(e, i, n, s, o, d) {
            r(this, t);
            this._el = e;
            this._flashID = n;
            this._flashURL = i;
            this._width = s;
            this._height = o;
            this._handlers = new l();
            this._callbacks = new u();
            this._uniqueMethodIdentifier = a(this._flashID);
            this._ready = false;
            this._handShakeHandler = d;
            c.addInstance(this._flashID, this);
          }
          n(t, [
            {
              key: 'on',
              value: function e(t, i) {
                this._handlers.add(t, i);
              },
            },
            {
              key: 'off',
              value: function i(t, e) {
                return this._handlers.remove(t, e);
              },
            },
            {
              key: 'offEvent',
              value: function d(t) {
                return this._handlers.removeByKey(t);
              },
            },
            {
              key: 'offAll',
              value: function h() {
                return this._handlers.removeAll();
              },
            },
            {
              key: 'callFlashMethod',
              value: function v(t) {
                var e = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
                var i = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
                var n = '';
                if (i) {
                  n = this._uniqueMethodIdentifier() + '_' + t;
                  this._callbacks.add(n, i);
                }
                try {
                  this._el[t]([n].concat(e));
                } catch (r) {
                  if (i) {
                    p.call(this, n, r);
                  } else {
                    this._trigger(f, r);
                  }
                }
              },
            },
            {
              key: 'removeCallback',
              value: function y(t) {
                return this._callbacks.removeByValue(t);
              },
            },
            {
              key: 'removeCallbackByMethodName',
              value: function g(t) {
                var e = this;
                this._callbacks
                  .filterKeys(function(e) {
                    return o(e, t);
                  })
                  .forEach(function(t) {
                    e._callbacks.remove(t);
                  });
              },
            },
            {
              key: 'removeAllCallbacks',
              value: function m() {
                return this._callbacks.removeAll();
              },
            },
            {
              key: '_trigger',
              value: function A(t, e) {
                var i = this;
                this._handlers.get(t).forEach(function(n) {
                  if (t === 'AdClickThru') {
                    n(e);
                  } else {
                    setTimeout(function() {
                      if (i._handlers.get(t).length > 0) {
                        n(e);
                      }
                    }, 0);
                  }
                });
              },
            },
            {
              key: '_callCallback',
              value: function k(t, e, i, n) {
                var r = this._callbacks.get(e);
                if (!r) {
                  if (i && e === '') {
                    this.trigger(f, i);
                  }
                  return;
                }
                p.call(this, e, i, n);
              },
            },
            {
              key: '_handShake',
              value: function _(t, e) {
                this._ready = true;
                if (this._handShakeHandler) {
                  this._handShakeHandler(t, e);
                  delete this._handShakeHandler;
                }
              },
            },
            {
              key: 'getSize',
              value: function b() {
                return { width: this._width, height: this._height };
              },
            },
            {
              key: 'setSize',
              value: function w(t, e) {
                this._width = s(t, this._width);
                this._height = s(e, this._height);
                this._el.setAttribute('width', this._width);
                this._el.setAttribute('height', this._height);
              },
            },
            {
              key: 'getWidth',
              value: function T() {
                return this._width;
              },
            },
            {
              key: 'setWidth',
              value: function E(t) {
                this.setSize(t, this._height);
              },
            },
            {
              key: 'getHeight',
              value: function S() {
                return this._height;
              },
            },
            {
              key: 'setHeight',
              value: function V(t) {
                this.setSize(this._width, t);
              },
            },
            {
              key: 'getFlashID',
              value: function C() {
                return this._flashID;
              },
            },
            {
              key: 'getFlashURL',
              value: function I() {
                return this._flashURL;
              },
            },
            {
              key: 'isReady',
              value: function F() {
                return this._ready;
              },
            },
            {
              key: 'destroy',
              value: function L() {
                this.offAll();
                this.removeAllCallbacks();
                c.removeInstanceByID(this._flashID);
                if (this._el.parentElement) {
                  this._el.parentElement.removeChild(this._el);
                }
              },
            },
          ]);
          return t;
        })());
        function p(t, e, i) {
          var n = this;
          setTimeout(function() {
            var r = n._callbacks.get(t);
            if (r) {
              n._callbacks.remove(t);
              r(e, i);
            }
          }, 0);
        }
        Object.defineProperty(h, 'VPAID_FLASH_HANDLER', { writable: false, configurable: false, value: d });
        window[d] = function(t, e, i, n, r, a) {
          var s = c.getInstanceByID(t);
          if (!s) return;
          if (i === 'handShake') {
            s._handShake(r, a);
          } else {
            if (e !== 'event') {
              s._callCallback(i, n, r, a);
            } else {
              s._trigger(i, a);
            }
          }
        };
      },
      { './jsFlashBridgeRegistry': 6, './registry': 7, './utils': 8 },
    ],
    6: [
      function(t, e, i) {
        'use strict';
        var n = t('./registry').SingleValueRegistry;
        var r = new n();
        var a = {};
        Object.defineProperty(a, 'addInstance', {
          writable: false,
          configurable: false,
          value: function s(t, e) {
            r.add(t, e);
          },
        });
        Object.defineProperty(a, 'getInstanceByID', {
          writable: false,
          configurable: false,
          value: function o(t) {
            return r.get(t);
          },
        });
        Object.defineProperty(a, 'removeInstanceByID', {
          writable: false,
          configurable: false,
          value: function u(t) {
            return r.remove(t);
          },
        });
        e.exports = a;
      },
      { './registry': 7 },
    ],
    7: [
      function(t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: true });
        var n = (function() {
          function t(t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i];
              n.enumerable = n.enumerable || false;
              n.configurable = true;
              if ('value' in n) n.writable = true;
              Object.defineProperty(t, n.key, n);
            }
          }
          return function(e, i, n) {
            if (i) t(e.prototype, i);
            if (n) t(e, n);
            return e;
          };
        })();
        function r(t, e) {
          if (!(t instanceof e)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }
        var a = (i.MultipleValuesRegistry = (function() {
          function t() {
            r(this, t);
            this._registries = {};
          }
          n(t, [
            {
              key: 'add',
              value: function e(t, i) {
                if (!this._registries[t]) {
                  this._registries[t] = [];
                }
                if (this._registries[t].indexOf(i) === -1) {
                  this._registries[t].push(i);
                }
              },
            },
            {
              key: 'get',
              value: function i(t) {
                return this._registries[t] || [];
              },
            },
            {
              key: 'filterKeys',
              value: function a(t) {
                return Object.keys(this._registries).filter(t);
              },
            },
            {
              key: 'findByValue',
              value: function s(t) {
                var e = this;
                var i = Object.keys(this._registries).filter(function(i) {
                  return e._registries[i].indexOf(t) !== -1;
                });
                return i;
              },
            },
            {
              key: 'remove',
              value: function o(t, e) {
                if (!this._registries[t]) {
                  return;
                }
                var i = this._registries[t].indexOf(e);
                if (i < 0) {
                  return;
                }
                return this._registries[t].splice(i, 1);
              },
            },
            {
              key: 'removeByKey',
              value: function u(t) {
                var e = this._registries[t];
                delete this._registries[t];
                return e;
              },
            },
            {
              key: 'removeByValue',
              value: function l(t) {
                var e = this;
                var i = this.findByValue(t);
                return i.map(function(i) {
                  return e.remove(i, t);
                });
              },
            },
            {
              key: 'removeAll',
              value: function c() {
                var t = this._registries;
                this._registries = {};
                return t;
              },
            },
            {
              key: 'size',
              value: function d() {
                return Object.keys(this._registries).length;
              },
            },
          ]);
          return t;
        })());
        var s = (i.SingleValueRegistry = (function() {
          function t() {
            r(this, t);
            this._registries = {};
          }
          n(t, [
            {
              key: 'add',
              value: function e(t, i) {
                this._registries[t] = i;
              },
            },
            {
              key: 'get',
              value: function i(t) {
                return this._registries[t];
              },
            },
            {
              key: 'filterKeys',
              value: function a(t) {
                return Object.keys(this._registries).filter(t);
              },
            },
            {
              key: 'findByValue',
              value: function s(t) {
                var e = this;
                var i = Object.keys(this._registries).filter(function(i) {
                  return e._registries[i] === t;
                });
                return i;
              },
            },
            {
              key: 'remove',
              value: function o(t) {
                var e = this._registries[t];
                delete this._registries[t];
                return e;
              },
            },
            {
              key: 'removeByValue',
              value: function u(t) {
                var e = this;
                var i = this.findByValue(t);
                return i.map(function(t) {
                  return e.remove(t);
                });
              },
            },
            {
              key: 'removeAll',
              value: function l() {
                var t = this._registries;
                this._registries = {};
                return t;
              },
            },
            {
              key: 'size',
              value: function c() {
                return Object.keys(this._registries).length;
              },
            },
          ]);
          return t;
        })());
      },
      {},
    ],
    8: [
      function(t, e, i) {
        'use strict';
        Object.defineProperty(i, '__esModule', { value: true });
        i.unique = n;
        i.noop = r;
        i.callbackTimeout = a;
        i.createElementWithID = s;
        i.isPositiveInt = o;
        i.stringEndsWith = l;
        i.hideFlashEl = c;
        function n(t) {
          var e = -1;
          return function(i) {
            return t + '_' + ++e;
          };
        }
        function r() {}
        function a(t, e, i) {
          var n = setTimeout(function() {
            e = r;
            i();
          }, t);
          return function() {
            clearTimeout(n);
            e.apply(this, arguments);
          };
        }
        function s(t, e) {
          var i = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          var n = document.createElement('div');
          n.id = e;
          if (i) {
            t.innerHTML = '';
          }
          t.appendChild(n);
          return n;
        }
        function o(t, e) {
          return !isNaN(parseFloat(t)) && isFinite(t) && t > 0 ? t : e;
        }
        var u = (function() {
          if (String.prototype.endsWith) return String.prototype.endsWith;
          return function t(e, i) {
            var n = this.toString();
            if (i === undefined || i > n.length) {
              i = n.length;
            }
            i -= e.length;
            var r = n.indexOf(e, i);
            return r !== -1 && r === i;
          };
        })();
        function l(t, e) {
          return u.call(t, e);
        }
        function c(t) {
          t.style.position = 'absolute';
          t.style.left = '-1px';
          t.style.top = '-1px';
          t.style.width = '1px';
          t.style.height = '1px';
        }
      },
      {},
    ],
    9: [
      function(t, e, i) {
        'use strict';
        var n = [
          'handshakeVersion',
          'initAd',
          'startAd',
          'stopAd',
          'skipAd',
          'resizeAd',
          'pauseAd',
          'resumeAd',
          'expandAd',
          'collapseAd',
          'subscribe',
          'unsubscribe',
        ];
        var r = [
          'AdLoaded',
          'AdStarted',
          'AdStopped',
          'AdSkipped',
          'AdSkippableStateChange',
          'AdSizeChange',
          'AdLinearChange',
          'AdDurationChange',
          'AdExpandedChange',
          'AdRemainingTimeChange',
          'AdVolumeChange',
          'AdImpression',
          'AdVideoStart',
          'AdVideoFirstQuartile',
          'AdVideoMidpoint',
          'AdVideoThirdQuartile',
          'AdVideoComplete',
          'AdClickThru',
          'AdInteraction',
          'AdUserAcceptInvitation',
          'AdUserMinimize',
          'AdUserClose',
          'AdPaused',
          'AdPlaying',
          'AdLog',
          'AdError',
        ];
        var a = [
          'getAdLinear',
          'getAdWidth',
          'getAdHeight',
          'getAdExpanded',
          'getAdSkippableState',
          'getAdRemainingTime',
          'getAdDuration',
          'getAdVolume',
          'getAdCompanions',
          'getAdIcons',
        ];
        var s = ['setAdVolume'];
        function o(t, e, i) {}
        o.prototype.handshakeVersion = function(t, e) {};
        o.prototype.initAd = function(t, e, i, n, r, a, s) {};
        o.prototype.startAd = function(t) {};
        o.prototype.stopAd = function(t) {};
        o.prototype.skipAd = function(t) {};
        o.prototype.resizeAd = function(t, e, i, n) {};
        o.prototype.pauseAd = function(t) {};
        o.prototype.resumeAd = function(t) {};
        o.prototype.expandAd = function(t) {};
        o.prototype.collapseAd = function(t) {};
        o.prototype.subscribe = function(t, e, i) {};
        o.prototype.unsubscribe = function(t, e) {};
        o.prototype.getAdLinear = function(t) {};
        o.prototype.getAdWidth = function(t) {};
        o.prototype.getAdHeight = function(t) {};
        o.prototype.getAdExpanded = function(t) {};
        o.prototype.getAdSkippableState = function(t) {};
        o.prototype.getAdRemainingTime = function(t) {};
        o.prototype.getAdDuration = function(t) {};
        o.prototype.getAdVolume = function(t) {};
        o.prototype.getAdCompanions = function(t) {};
        o.prototype.getAdIcons = function(t) {};
        o.prototype.setAdVolume = function(t, e) {};
        l(o, 'METHODS', n);
        l(o, 'GETTERS', a);
        l(o, 'SETTERS', s);
        l(o, 'EVENTS', r);
        var u = n.filter(function(t) {
          return ['skipAd'].indexOf(t) === -1;
        });
        l(o, 'checkVPAIDInterface', function c(t) {
          var e = u.every(function(e) {
            return typeof t[e] === 'function';
          });
          return e;
        });
        e.exports = o;
        function l(t, e, i) {
          Object.defineProperty(t, e, { writable: false, configurable: false, value: i });
        }
      },
      {},
    ],
    10: [
      function(t, e, i) {
        'use strict';
        var n = t('./IVPAIDAdUnit');
        var r = t('./subscriber');
        var a = n.checkVPAIDInterface;
        var s = t('./utils');
        var o = n.METHODS;
        var u = 'AdError';
        var l = 'AdClickThru';
        var c = n.EVENTS.filter(function(t) {
          return t != l;
        });
        function d(t, e, i, n) {
          this._isValid = a(t);
          if (this._isValid) {
            this._creative = t;
            this._el = e;
            this._videoEl = i;
            this._iframe = n;
            this._subscribers = new r();
            s.setFullSizeStyle(e);
            f.call(this);
          }
        }
        d.prototype = Object.create(n.prototype);
        d.prototype.isValidVPAIDAd = function y() {
          return this._isValid;
        };
        n.METHODS.forEach(function(t) {
          var e = ['subscribe', 'unsubscribe', 'initAd'];
          if (e.indexOf(t) !== -1) return;
          d.prototype[t] = function() {
            var e = n.prototype[t].length;
            var i = Array.prototype.slice.call(arguments);
            var r = e === i.length ? i.pop() : undefined;
            setTimeout(
              function() {
                var e,
                  n = null;
                try {
                  e = this._creative[t].apply(this._creative, i);
                } catch (a) {
                  n = a;
                }
                v(r, this._subscribers, n, e);
              }.bind(this),
              0
            );
          };
        });
        d.prototype.initAd = function g(t, e, i, n, r, a, o) {
          r = r || {};
          a = s.extend({ slot: this._el, videoSlot: this._videoEl }, a || {});
          setTimeout(
            function() {
              var s;
              try {
                this._creative.initAd(t, e, i, n, r, a);
              } catch (u) {
                s = u;
              }
              v(o, this._subscribers, s);
            }.bind(this),
            0
          );
        };
        d.prototype.subscribe = function m(t, e, i) {
          this._subscribers.subscribe(e, t, i);
        };
        d.prototype.unsubscribe = function A(t, e) {
          this._subscribers.unsubscribe(e, t);
        };
        d.prototype.on = d.prototype.subscribe;
        d.prototype.off = d.prototype.unsubscribe;
        n.GETTERS.forEach(function(t) {
          d.prototype[t] = function(e) {
            setTimeout(
              function() {
                var i,
                  n = null;
                try {
                  i = this._creative[t]();
                } catch (r) {
                  n = r;
                }
                v(e, this._subscribers, n, i);
              }.bind(this),
              0
            );
          };
        });
        d.prototype.setAdVolume = function k(t, e) {
          setTimeout(
            function() {
              var i,
                n = null;
              try {
                this._creative.setAdVolume(t);
                i = this._creative.getAdVolume();
              } catch (r) {
                n = r;
              }
              if (!n) {
                n = s.validate(i === t, 'failed to apply volume: ' + t);
              }
              v(e, this._subscribers, n, i);
            }.bind(this),
            0
          );
        };
        d.prototype._destroy = function _() {
          this.stopAd();
          this._subscribers.unsubscribeAll();
        };
        function f() {
          c.forEach(
            function(t) {
              this._creative.subscribe(p.bind(this, t), t);
            }.bind(this)
          );
          this._creative.subscribe(h.bind(this), l);
          if (this._videoEl) {
            var t = this._iframe.contentDocument.documentElement;
            var e = this._videoEl;
            t.addEventListener('click', function(i) {
              if (i.target === t) {
                e.click();
              }
            });
          }
        }
        function h(t, e, i) {
          this._subscribers.triggerSync(l, { url: t, id: e, playerHandles: i });
        }
        function p(t) {
          this._subscribers.trigger(t, Array.prototype.slice(arguments, 1));
        }
        function v(t, e, i, n) {
          if (t) {
            t(i, n);
          } else if (i) {
            e.trigger(u, i);
          }
        }
        e.exports = d;
      },
      { './IVPAIDAdUnit': 9, './subscriber': 12, './utils': 13 },
    ],
    11: [
      function(t, e, i) {
        'use strict';
        var n = t('./utils');
        var r = n.unique('vpaidIframe');
        var a = t('./VPAIDAdUnit');
        var s =
          '<!DOCTYPE html>' +
          '<html lang="en">' +
          '<head><meta charset="UTF-8"></head>' +
          '<body style="margin:0;padding:0"><div class="ad-element"></div>' +
          '<script type="text/javascript" src="{{iframeURL_JS}}"></script>' +
          '<script type="text/javascript">' +
          'window.parent.postMessage(\'{"event": "ready", "id": "{{iframeID}}"}\', \'{{origin}}\');' +
          '</script>' +
          '</body>' +
          '</html>';
        var o = 'AdStopped';
        function u(t, e, i, a) {
          i = i || {};
          this._id = r();
          this._destroyed = false;
          this._frameContainer = n.createElementInEl(t, 'div');
          this._videoEl = e;
          this._vpaidOptions = a || { timeout: 1e4 };
          this._templateConfig = { template: i.template || s, extraOptions: i.extraOptions || {} };
        }
        u.prototype.destroy = function g() {
          if (this._destroyed) {
            return;
          }
          this._destroyed = true;
          d.call(this);
        };
        u.prototype.isDestroyed = function m() {
          return this._destroyed;
        };
        u.prototype.loadAdUnit = function A(t, e) {
          v.call(this);
          d.call(this);
          var i = this;
          var r = n.createIframeWithContent(
            this._frameContainer,
            this._templateConfig.template,
            n.extend({ iframeURL_JS: t, iframeID: this.getID(), origin: y() }, this._templateConfig.extraOptions)
          );
          this._frame = r;
          this._onLoad = n.callbackTimeout(this._vpaidOptions.timeout, s.bind(this), u.bind(this));
          window.addEventListener('message', this._onLoad);
          function s(t) {
            if (t.origin !== y()) return;
            var r = JSON.parse(t.data);
            if (r.id !== i.getID()) return;
            var s, u, l;
            if (!i._frame.contentWindow) {
              u = 'the iframe is not anymore in the DOM tree';
            } else {
              l = i._frame.contentWindow.getVPAIDAd;
              u = n.validate(typeof l === 'function', "the ad didn't return a function to create an ad");
            }
            if (!u) {
              var d = i._frame.contentWindow.document.querySelector('.ad-element');
              s = new a(l(), d, i._videoEl, i._frame);
              s.subscribe(o, c.bind(i));
              u = n.validate(s.isValidVPAIDAd(), 'the add is not fully complaint with VPAID specification');
            }
            i._adUnit = s;
            h.call(i);
            e(u, u ? null : s);
            return true;
          }
          function u() {
            e('timeout', null);
          }
        };
        u.prototype.unloadAdUnit = function k() {
          d.call(this);
        };
        u.prototype.getID = function() {
          return this._id;
        };
        function l(t) {
          var e = this[t];
          if (e) {
            e.remove();
            delete this[t];
          }
        }
        function c() {
          f.call(this);
          delete this._adUnit;
        }
        function d() {
          f.call(this);
          p.call(this);
        }
        function f() {
          l.call(this, '_frame');
          h.call(this);
        }
        function h() {
          if (this._onLoad) {
            window.removeEventListener('message', this._onLoad);
            n.clearCallbackTimeout(this._onLoad);
            delete this._onLoad;
          }
        }
        function p() {
          if (this._adUnit) {
            this._adUnit.stopAd();
            delete this._adUnit;
          }
        }
        function v() {
          if (this._destroyed) {
            throw new Error('VPAIDHTML5Client already destroyed!');
          }
        }
        function y() {
          if (window.location.origin) {
            return window.location.origin;
          } else {
            return (
              window.location.protocol +
              '//' +
              window.location.hostname +
              (window.location.port ? ':' + window.location.port : '')
            );
          }
        }
        e.exports = u;
      },
      { './VPAIDAdUnit': 10, './utils': 13 },
    ],
    12: [
      function(t, e, i) {
        'use strict';
        function n() {
          this._subscribers = {};
        }
        n.prototype.subscribe = function r(t, e, i) {
          if (!this.isHandlerAttached(t, e)) {
            this.get(e).push({ handler: t, context: i, eventName: e });
          }
        };
        n.prototype.unsubscribe = function a(t, e) {
          this._subscribers[e] = this.get(e).filter(function(e) {
            return t !== e.handler;
          });
        };
        n.prototype.unsubscribeAll = function s() {
          this._subscribers = {};
        };
        n.prototype.trigger = function(t, e) {
          var i = this;
          var n = this.get(t).concat(this.get('*'));
          n.forEach(function(t) {
            setTimeout(function() {
              if (i.isHandlerAttached(t.handler, t.eventName)) {
                t.handler.call(t.context, e);
              }
            }, 0);
          });
        };
        n.prototype.triggerSync = function(t, e) {
          var i = this.get(t).concat(this.get('*'));
          i.forEach(function(t) {
            t.handler.call(t.context, e);
          });
        };
        n.prototype.get = function o(t) {
          if (!this._subscribers[t]) {
            this._subscribers[t] = [];
          }
          return this._subscribers[t];
        };
        n.prototype.isHandlerAttached = function u(t, e) {
          return this.get(e).some(function(e) {
            return t === e.handler;
          });
        };
        e.exports = n;
      },
      {},
    ],
    13: [
      function(t, e, i) {
        'use strict';
        function n() {}
        function r(t, e) {
          return t ? null : new Error(e);
        }
        var a = {};
        function s(t) {
          var e = a[t];
          if (e) {
            clearTimeout(e);
            delete a[t];
          }
        }
        function o(t, e, i) {
          var r, o;
          o = setTimeout(function() {
            e = n;
            delete o[r];
            i();
          }, t);
          r = function() {
            if (e.apply(this, arguments)) {
              s(r);
            }
          };
          a[r] = o;
          return r;
        }
        function u(t, e, i) {
          var n = document.createElement(e);
          if (i) n.id = i;
          t.appendChild(n);
          return n;
        }
        function l(t, e, i) {
          var n = c(t, null, i.zIndex);
          if (!h(n, f(e, i))) return;
          return n;
        }
        function c(t, e, i) {
          var n = document.createElement('iframe');
          n.src = e || 'about:blank';
          n.marginWidth = '0';
          n.marginHeight = '0';
          n.frameBorder = '0';
          n.width = '100%';
          n.height = '100%';
          d(n);
          if (i) {
            n.style.zIndex = i;
          }
          n.setAttribute('SCROLLING', 'NO');
          t.innerHTML = '';
          t.appendChild(n);
          return n;
        }
        function d(t) {
          t.style.position = 'absolute';
          t.style.left = '0';
          t.style.top = '0';
          t.style.margin = '0px';
          t.style.padding = '0px';
          t.style.border = 'none';
          t.style.width = '100%';
          t.style.height = '100%';
        }
        function f(t, e) {
          Object.keys(e).forEach(function(i) {
            var n = typeof n === 'object' ? JSON.stringify(e[i]) : e[i];
            t = t.replace(new RegExp('{{' + i + '}}', 'g'), n);
          });
          return t;
        }
        function h(t, e) {
          var i = t.contentWindow && t.contentWindow.document;
          if (!i) return false;
          i.write(e);
          return true;
        }
        function p(t, e) {
          Object.keys(e).forEach(function(i) {
            t[i] = e[i];
          });
          return t;
        }
        function v(t) {
          var e = -1;
          return function() {
            return t + '_' + ++e;
          };
        }
        e.exports = {
          noop: n,
          validate: r,
          clearCallbackTimeout: s,
          callbackTimeout: o,
          createElementInEl: u,
          createIframeWithContent: l,
          createIframe: c,
          setFullSizeStyle: d,
          simpleTemplate: f,
          setIframeContent: h,
          extend: p,
          unique: v,
        };
      },
      {},
    ],
    14: [
      function(t, e, i) {
        (function(t, i) {
          if (typeof define === 'function' && define.amd) {
            define(i);
          } else if (typeof e === 'object' && e.exports) {
            e.exports = i();
          } else {
            t.swfobject = i();
          }
        })(this, function() {
          var t = 'undefined',
            e = 'object',
            i = 'Shockwave Flash',
            n = 'ShockwaveFlash.ShockwaveFlash',
            r = 'application/x-shockwave-flash',
            a = 'SWFObjectExprInst',
            s = 'onreadystatechange',
            o = window,
            u = document,
            l = navigator,
            c = false,
            d = [],
            f = [],
            h = [],
            p = [],
            v,
            y,
            g,
            m,
            A = false,
            k = false,
            _,
            b,
            w = true,
            T = false,
            E = (function() {
              var a =
                  typeof u.getElementById !== t && typeof u.getElementsByTagName !== t && typeof u.createElement !== t,
                s = l.userAgent.toLowerCase(),
                d = l.platform.toLowerCase(),
                f = d ? /win/.test(d) : /win/.test(s),
                h = d ? /mac/.test(d) : /mac/.test(s),
                p = /webkit/.test(s) ? parseFloat(s.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, '$1')) : false,
                v = l.appName === 'Microsoft Internet Explorer',
                y = [0, 0, 0],
                g = null;
              if (typeof l.plugins !== t && typeof l.plugins[i] === e) {
                g = l.plugins[i].description;
                if (g && typeof l.mimeTypes !== t && l.mimeTypes[r] && l.mimeTypes[r].enabledPlugin) {
                  c = true;
                  v = false;
                  g = g.replace(/^.*\s+(\S+\s+\S+$)/, '$1');
                  y[0] = q(g.replace(/^(.*)\..*$/, '$1'));
                  y[1] = q(g.replace(/^.*\.(.*)\s.*$/, '$1'));
                  y[2] = /[a-zA-Z]/.test(g) ? q(g.replace(/^.*[a-zA-Z]+(.*)$/, '$1')) : 0;
                }
              } else if (typeof o.ActiveXObject !== t) {
                try {
                  var m = new ActiveXObject(n);
                  if (m) {
                    g = m.GetVariable('$version');
                    if (g) {
                      v = true;
                      g = g.split(' ')[1].split(',');
                      y = [q(g[0]), q(g[1]), q(g[2])];
                    }
                  }
                } catch (A) {}
              }
              return { w3: a, pv: y, wk: p, ie: v, win: f, mac: h };
            })(),
            S = (function() {
              if (!E.w3) {
                return;
              }
              if (
                (typeof u.readyState !== t && (u.readyState === 'complete' || u.readyState === 'interactive')) ||
                (typeof u.readyState === t && (u.getElementsByTagName('body')[0] || u.body))
              ) {
                V();
              }
              if (!A) {
                if (typeof u.addEventListener !== t) {
                  u.addEventListener('DOMContentLoaded', V, false);
                }
                if (E.ie) {
                  u.attachEvent(s, function e() {
                    if (u.readyState === 'complete') {
                      u.detachEvent(s, e);
                      V();
                    }
                  });
                  if (o == top) {
                    (function i() {
                      if (A) {
                        return;
                      }
                      try {
                        u.documentElement.doScroll('left');
                      } catch (t) {
                        setTimeout(i, 0);
                        return;
                      }
                      V();
                    })();
                  }
                }
                if (E.wk) {
                  (function n() {
                    if (A) {
                      return;
                    }
                    if (!/loaded|complete/.test(u.readyState)) {
                      setTimeout(n, 0);
                      return;
                    }
                    V();
                  })();
                }
              }
            })();
          function V() {
            if (A || !document.getElementsByTagName('body')[0]) {
              return;
            }
            try {
              var t,
                e = z('span');
              e.style.display = 'none';
              t = u.getElementsByTagName('body')[0].appendChild(e);
              t.parentNode.removeChild(t);
              t = null;
              e = null;
            } catch (i) {
              return;
            }
            A = true;
            var n = d.length;
            for (var r = 0; r < n; r++) {
              d[r]();
            }
          }
          function C(t) {
            if (A) {
              t();
            } else {
              d[d.length] = t;
            }
          }
          function I(e) {
            if (typeof o.addEventListener !== t) {
              o.addEventListener('load', e, false);
            } else if (typeof u.addEventListener !== t) {
              u.addEventListener('load', e, false);
            } else if (typeof o.attachEvent !== t) {
              X(o, 'onload', e);
            } else if (typeof o.onload === 'function') {
              var i = o.onload;
              o.onload = function() {
                i();
                e();
              };
            } else {
              o.onload = e;
            }
          }
          function F() {
            var i = u.getElementsByTagName('body')[0];
            var n = z(e);
            n.setAttribute('style', 'visibility: hidden;');
            n.setAttribute('type', r);
            var a = i.appendChild(n);
            if (a) {
              var s = 0;
              (function o() {
                if (typeof a.GetVariable !== t) {
                  try {
                    var e = a.GetVariable('$version');
                    if (e) {
                      e = e.split(' ')[1].split(',');
                      E.pv = [q(e[0]), q(e[1]), q(e[2])];
                    }
                  } catch (r) {
                    E.pv = [8, 0, 0];
                  }
                } else if (s < 10) {
                  s++;
                  setTimeout(o, 10);
                  return;
                }
                i.removeChild(n);
                a = null;
                L();
              })();
            } else {
              L();
            }
          }
          function L() {
            var e = f.length;
            if (e > 0) {
              for (var i = 0; i < e; i++) {
                var n = f[i].id;
                var r = f[i].callbackFn;
                var a = { success: false, id: n };
                if (E.pv[0] > 0) {
                  var s = W(n);
                  if (s) {
                    if (J(f[i].swfVersion) && !(E.wk && E.wk < 312)) {
                      Q(n, true);
                      if (r) {
                        a.success = true;
                        a.ref = U(n);
                        a.id = n;
                        r(a);
                      }
                    } else if (f[i].expressInstall && P()) {
                      var o = {};
                      o.data = f[i].expressInstall;
                      o.width = s.getAttribute('width') || '0';
                      o.height = s.getAttribute('height') || '0';
                      if (s.getAttribute('class')) {
                        o.styleclass = s.getAttribute('class');
                      }
                      if (s.getAttribute('align')) {
                        o.align = s.getAttribute('align');
                      }
                      var u = {};
                      var l = s.getElementsByTagName('param');
                      var c = l.length;
                      for (var d = 0; d < c; d++) {
                        if (l[d].getAttribute('name').toLowerCase() !== 'movie') {
                          u[l[d].getAttribute('name')] = l[d].getAttribute('value');
                        }
                      }
                      D(o, u, n, r);
                    } else {
                      x(s);
                      if (r) {
                        r(a);
                      }
                    }
                  }
                } else {
                  Q(n, true);
                  if (r) {
                    var h = U(n);
                    if (h && typeof h.SetVariable !== t) {
                      a.success = true;
                      a.ref = h;
                      a.id = h.id;
                    }
                    r(a);
                  }
                }
              }
            }
          }
          d[0] = function() {
            if (c) {
              F();
            } else {
              L();
            }
          };
          function U(i) {
            var n = null,
              r = W(i);
            if (r && r.nodeName.toUpperCase() === 'OBJECT') {
              if (typeof r.SetVariable !== t) {
                n = r;
              } else {
                n = r.getElementsByTagName(e)[0] || r;
              }
            }
            return n;
          }
          function P() {
            return !k && J('6.0.65') && (E.win || E.mac) && !(E.wk && E.wk < 312);
          }
          function D(e, i, n, r) {
            var s = W(n);
            n = B(n);
            k = true;
            g = r || null;
            m = { success: false, id: n };
            if (s) {
              if (s.nodeName.toUpperCase() === 'OBJECT') {
                v = M(s);
                y = null;
              } else {
                v = s;
                y = n;
              }
              e.id = a;
              if (typeof e.width === t || (!/%$/.test(e.width) && q(e.width) < 310)) {
                e.width = '310';
              }
              if (typeof e.height === t || (!/%$/.test(e.height) && q(e.height) < 137)) {
                e.height = '137';
              }
              var l = E.ie ? 'ActiveX' : 'PlugIn',
                c =
                  'MMredirectURL=' +
                  encodeURIComponent(o.location.toString().replace(/&/g, '%26')) +
                  '&MMplayerType=' +
                  l +
                  '&MMdoctitle=' +
                  encodeURIComponent(u.title.slice(0, 47) + ' - Flash Player Installation');
              if (typeof i.flashvars !== t) {
                i.flashvars += '&' + c;
              } else {
                i.flashvars = c;
              }
              if (E.ie && s.readyState != 4) {
                var d = z('div');
                n += 'SWFObjectNew';
                d.setAttribute('id', n);
                s.parentNode.insertBefore(d, s);
                s.style.display = 'none';
                j(s);
              }
              O(e, i, n);
            }
          }
          function x(t) {
            if (E.ie && t.readyState != 4) {
              t.style.display = 'none';
              var e = z('div');
              t.parentNode.insertBefore(e, t);
              e.parentNode.replaceChild(M(t), e);
              j(t);
            } else {
              t.parentNode.replaceChild(M(t), t);
            }
          }
          function M(t) {
            var i = z('div');
            if (E.win && E.ie) {
              i.innerHTML = t.innerHTML;
            } else {
              var n = t.getElementsByTagName(e)[0];
              if (n) {
                var r = n.childNodes;
                if (r) {
                  var a = r.length;
                  for (var s = 0; s < a; s++) {
                    if (!(r[s].nodeType == 1 && r[s].nodeName === 'PARAM') && !(r[s].nodeType == 8)) {
                      i.appendChild(r[s].cloneNode(true));
                    }
                  }
                }
              }
            }
            return i;
          }
          function R(t, e) {
            var i = z('div');
            i.innerHTML =
              "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" +
              t +
              "'>" +
              e +
              '</object>';
            return i.firstChild;
          }
          function O(i, n, a) {
            var s,
              o = W(a);
            a = B(a);
            if (E.wk && E.wk < 312) {
              return s;
            }
            if (o) {
              var u = E.ie ? z('div') : z(e),
                l,
                c,
                d;
              if (typeof i.id === t) {
                i.id = a;
              }
              for (d in n) {
                if (n.hasOwnProperty(d) && d.toLowerCase() !== 'movie') {
                  N(u, d, n[d]);
                }
              }
              if (E.ie) {
                u = R(i.data, u.innerHTML);
              }
              for (l in i) {
                if (i.hasOwnProperty(l)) {
                  c = l.toLowerCase();
                  if (c === 'styleclass') {
                    u.setAttribute('class', i[l]);
                  } else if (c !== 'classid' && c !== 'data') {
                    u.setAttribute(l, i[l]);
                  }
                }
              }
              if (E.ie) {
                h[h.length] = i.id;
              } else {
                u.setAttribute('type', r);
                u.setAttribute('data', i.data);
              }
              o.parentNode.replaceChild(u, o);
              s = u;
            }
            return s;
          }
          function N(t, e, i) {
            var n = z('param');
            n.setAttribute('name', e);
            n.setAttribute('value', i);
            t.appendChild(n);
          }
          function j(t) {
            var e = W(t);
            if (e && e.nodeName.toUpperCase() === 'OBJECT') {
              if (E.ie) {
                e.style.display = 'none';
                (function i() {
                  if (e.readyState == 4) {
                    for (var t in e) {
                      if (typeof e[t] === 'function') {
                        e[t] = null;
                      }
                    }
                    e.parentNode.removeChild(e);
                  } else {
                    setTimeout(i, 10);
                  }
                })();
              } else {
                e.parentNode.removeChild(e);
              }
            }
          }
          function H(t) {
            return t && t.nodeType && t.nodeType === 1;
          }
          function B(t) {
            return H(t) ? t.id : t;
          }
          function W(t) {
            if (H(t)) {
              return t;
            }
            var e = null;
            try {
              e = u.getElementById(t);
            } catch (i) {}
            return e;
          }
          function z(t) {
            return u.createElement(t);
          }
          function q(t) {
            return parseInt(t, 10);
          }
          function X(t, e, i) {
            t.attachEvent(e, i);
            p[p.length] = [t, e, i];
          }
          function J(t) {
            t += '';
            var e = E.pv,
              i = t.split('.');
            i[0] = q(i[0]);
            i[1] = q(i[1]) || 0;
            i[2] = q(i[2]) || 0;
            return e[0] > i[0] || (e[0] == i[0] && e[1] > i[1]) || (e[0] == i[0] && e[1] == i[1] && e[2] >= i[2])
              ? true
              : false;
          }
          function $(e, i, n, r) {
            var a = u.getElementsByTagName('head')[0];
            if (!a) {
              return;
            }
            var s = typeof n === 'string' ? n : 'screen';
            if (r) {
              _ = null;
              b = null;
            }
            if (!_ || b != s) {
              var o = z('style');
              o.setAttribute('type', 'text/css');
              o.setAttribute('media', s);
              _ = a.appendChild(o);
              if (E.ie && typeof u.styleSheets !== t && u.styleSheets.length > 0) {
                _ = u.styleSheets[u.styleSheets.length - 1];
              }
              b = s;
            }
            if (_) {
              if (typeof _.addRule !== t) {
                _.addRule(e, i);
              } else if (typeof u.createTextNode !== t) {
                _.appendChild(u.createTextNode(e + ' {' + i + '}'));
              }
            }
          }
          function Q(t, e) {
            if (!w) {
              return;
            }
            var i = e ? 'visible' : 'hidden',
              n = W(t);
            if (A && n) {
              n.style.visibility = i;
            } else if (typeof t === 'string') {
              $('#' + t, 'visibility:' + i);
            }
          }
          function G(e) {
            var i = /[\\\"<>\.;]/;
            var n = i.exec(e) !== null;
            return n && typeof encodeURIComponent !== t ? encodeURIComponent(e) : e;
          }
          var K = (function() {
            if (E.ie) {
              window.attachEvent('onunload', function() {
                var t = p.length;
                for (var e = 0; e < t; e++) {
                  p[e][0].detachEvent(p[e][1], p[e][2]);
                }
                var i = h.length;
                for (var n = 0; n < i; n++) {
                  j(h[n]);
                }
                for (var r in E) {
                  E[r] = null;
                }
                E = null;
                for (var a in swfobject) {
                  swfobject[a] = null;
                }
                swfobject = null;
              });
            }
          })();
          return {
            registerObject: function(t, e, i, n) {
              if (E.w3 && t && e) {
                var r = {};
                r.id = t;
                r.swfVersion = e;
                r.expressInstall = i;
                r.callbackFn = n;
                f[f.length] = r;
                Q(t, false);
              } else if (n) {
                n({ success: false, id: t });
              }
            },
            getObjectById: function(t) {
              if (E.w3) {
                return U(t);
              }
            },
            embedSWF: function(i, n, r, a, s, o, u, l, c, d) {
              var f = B(n),
                h = { success: false, id: f };
              if (E.w3 && !(E.wk && E.wk < 312) && i && n && r && a && s) {
                Q(f, false);
                C(function() {
                  r += '';
                  a += '';
                  var p = {};
                  if (c && typeof c === e) {
                    for (var v in c) {
                      p[v] = c[v];
                    }
                  }
                  p.data = i;
                  p.width = r;
                  p.height = a;
                  var y = {};
                  if (l && typeof l === e) {
                    for (var g in l) {
                      y[g] = l[g];
                    }
                  }
                  if (u && typeof u === e) {
                    for (var m in u) {
                      if (u.hasOwnProperty(m)) {
                        var A = T ? encodeURIComponent(m) : m,
                          k = T ? encodeURIComponent(u[m]) : u[m];
                        if (typeof y.flashvars !== t) {
                          y.flashvars += '&' + A + '=' + k;
                        } else {
                          y.flashvars = A + '=' + k;
                        }
                      }
                    }
                  }
                  if (J(s)) {
                    var _ = O(p, y, n);
                    if (p.id == f) {
                      Q(f, true);
                    }
                    h.success = true;
                    h.ref = _;
                    h.id = _.id;
                  } else if (o && P()) {
                    p.data = o;
                    D(p, y, n, d);
                    return;
                  } else {
                    Q(f, true);
                  }
                  if (d) {
                    d(h);
                  }
                });
              } else if (d) {
                d(h);
              }
            },
            switchOffAutoHideShow: function() {
              w = false;
            },
            enableUriEncoding: function(e) {
              T = typeof e === t ? true : e;
            },
            ua: E,
            getFlashPlayerVersion: function() {
              return { major: E.pv[0], minor: E.pv[1], release: E.pv[2] };
            },
            hasFlashPlayerVersion: J,
            createSWF: function(t, e, i) {
              if (E.w3) {
                return O(t, e, i);
              } else {
                return undefined;
              }
            },
            showExpressInstall: function(t, e, i, n) {
              if (E.w3 && P()) {
                D(t, e, i, n);
              }
            },
            removeSWF: function(t) {
              if (E.w3) {
                j(t);
              }
            },
            createCSS: function(t, e, i, n) {
              if (E.w3) {
                $(t, e, i, n);
              }
            },
            addDomLoadEvent: C,
            addLoadEvent: I,
            getQueryParamValue: function(t) {
              var e = u.location.search || u.location.hash;
              if (e) {
                if (/\?/.test(e)) {
                  e = e.split('?')[1];
                }
                if (!t) {
                  return G(e);
                }
                var i = e.split('&');
                for (var n = 0; n < i.length; n++) {
                  if (i[n].substring(0, i[n].indexOf('=')) == t) {
                    return G(i[n].substring(i[n].indexOf('=') + 1));
                  }
                }
              }
              return '';
            },
            expressInstallCallback: function() {
              if (k) {
                var t = W(a);
                if (t && v) {
                  t.parentNode.replaceChild(v, t);
                  if (y) {
                    Q(y, true);
                    if (E.ie) {
                      v.style.display = 'block';
                    }
                  }
                  if (g) {
                    g(m);
                  }
                }
                k = false;
              }
            },
            version: '2.3',
          };
        });
      },
      {},
    ],
    15: [
      function(t, e, i) {
        'use strict';
        var n = t('./InLine');
        var r = t('./Wrapper');
        function a(t) {
          if (!(this instanceof a)) {
            return new a(t);
          }
          this.initialize(t);
        }
        a.prototype.initialize = function(t) {
          this.id = t.attr('id');
          this.sequence = t.attr('sequence');
          if (t.inLine) {
            this.inLine = new n(t.inLine);
          }
          if (t.wrapper) {
            this.wrapper = new r(t.wrapper);
          }
        };
        e.exports = a;
      },
      { './InLine': 18, './Wrapper': 28 },
    ],
    16: [
      function(t, e, i) {
        'use strict';
        var n = t('./TrackingEvent');
        var r = t('../../utils/utilityFunctions');
        var a = t('../../utils/xml');
        var s = t('../../utils/consoleLogger');
        function o(t) {
          if (!(this instanceof o)) {
            return new o(t);
          }
          s.info('<Companion> found companion ad');
          s.debug('<Companion>  companionJTree:', t);
          this.creativeType = a.attr(t.staticResource, 'creativeType');
          this.staticResource = a.keyValue(t.staticResource);
          s.info('<Companion>  creativeType: ' + this.creativeType);
          s.info('<Companion>  staticResource: ' + this.staticResource);
          var e = null;
          if (a.keyValue(t.HTMLResource)) {
            e = a.keyValue(t.HTMLResource);
          } else if (a.keyValue(t.hTMLResource)) {
            e = a.keyValue(t.hTMLResource);
          }
          if (e !== null) {
            s.info('<Companion> found html resource', e);
          }
          this.htmlResource = e;
          var i = null;
          if (a.keyValue(t.IFrameResource)) {
            i = a.keyValue(t.IFrameResource);
          } else if (a.keyValue(t.iFrameresource)) {
            i = a.keyValue(t.iFrameresource);
          }
          if (i !== null) {
            s.info('<Companion> found iframe resource', i);
          }
          this.iframeResource = i;
          this.id = a.attr(t, 'id');
          this.width = a.attr(t, 'width');
          this.height = a.attr(t, 'height');
          this.expandedWidth = a.attr(t, 'expandedWidth');
          this.expandedHeight = a.attr(t, 'expandedHeight');
          this.scalable = a.attr(t, 'scalable');
          this.maintainAspectRatio = a.attr(t, 'maintainAspectRatio');
          this.minSuggestedDuration = a.attr(t, 'minSuggestedDuration');
          this.apiFramework = a.attr(t, 'apiFramework');
          this.companionClickThrough = a.keyValue(t.companionClickThrough);
          this.trackingEvents = u(t.trackingEvents && t.trackingEvents.tracking);
          s.info('<Companion>  companionClickThrough: ' + this.companionClickThrough);
          function u(t) {
            var e = [];
            if (r.isDefined(t)) {
              t = r.isArray(t) ? t : [t];
              t.forEach(function(t) {
                e.push(new n(t));
              });
            }
            return e;
          }
        }
        e.exports = o;
      },
      {
        '../../utils/consoleLogger': 41,
        '../../utils/utilityFunctions': 47,
        '../../utils/xml': 48,
        './TrackingEvent': 21,
      },
    ],
    17: [
      function(t, e, i) {
        'use strict';
        var n = t('./Linear');
        var r = t('./Companion');
        var a = t('../../utils/utilityFunctions');
        function s(t) {
          if (!(this instanceof s)) {
            return new s(t);
          }
          this.id = t.attr('id');
          this.sequence = t.attr('sequence');
          this.adId = t.attr('adId');
          this.apiFramework = t.attr('apiFramework');
          if (t.linear) {
            this.linear = new n(t.linear);
          }
          if (t.companionAds) {
            var e = [];
            var i = t.companionAds && t.companionAds.companion;
            if (a.isDefined(i)) {
              i = a.isArray(i) ? i : [i];
              i.forEach(function(t) {
                e.push(new r(t));
              });
            }
            this.companionAds = e;
          }
        }
        s.prototype.isSupported = function() {
          if (this.linear) {
            return this.linear.isSupported();
          }
          return true;
        };
        s.parseCreatives = function o(t) {
          var e = [];
          var i;
          if (a.isDefined(t) && a.isDefined(t.creative)) {
            i = a.isArray(t.creative) ? t.creative : [t.creative];
            i.forEach(function(t) {
              e.push(new s(t));
            });
          }
          return e;
        };
        e.exports = s;
      },
      { '../../utils/utilityFunctions': 47, './Companion': 16, './Linear': 19 },
    ],
    18: [
      function(t, e, i) {
        'use strict';
        var n = t('./vastUtil');
        var r = t('./Creative');
        var a = t('../../utils/utilityFunctions');
        var s = t('../../utils/xml');
        function o(t) {
          if (!(this instanceof o)) {
            return new o(t);
          }
          this.adTitle = s.keyValue(t.adTitle);
          this.adSystem = s.keyValue(t.adSystem);
          this.impressions = n.parseImpressions(t.impression);
          this.creatives = r.parseCreatives(t.creatives);
          this.description = s.keyValue(t.description);
          this.advertiser = s.keyValue(t.advertiser);
          this.surveys = e(t.survey);
          this.error = s.keyValue(t.error);
          this.pricing = s.keyValue(t.pricing);
          this.extensions = t.extensions;
          function e(t) {
            if (t) {
              return a.transformArray(a.isArray(t) ? t : [t], function(t) {
                if (a.isNotEmptyString(t.keyValue)) {
                  return { uri: t.keyValue, type: t.attr('type') };
                }
                return undefined;
              });
            }
            return [];
          }
        }
        o.prototype.isSupported = function() {
          var t, e;
          if (this.creatives.length === 0) {
            return false;
          }
          for (t = 0, e = this.creatives.length; t < e; t += 1) {
            if (!this.creatives[t].isSupported()) {
              return false;
            }
          }
          return true;
        };
        e.exports = o;
      },
      { '../../utils/utilityFunctions': 47, '../../utils/xml': 48, './Creative': 17, './vastUtil': 30 },
    ],
    19: [
      function(t, e, i) {
        'use strict';
        var n = t('./TrackingEvent');
        var r = t('./MediaFile');
        var a = t('./VideoClicks');
        var s = t('../../utils/utilityFunctions');
        var o = t('./parsers');
        var u = t('../../utils/xml');
        function l(t) {
          if (!(this instanceof l)) {
            return new l(t);
          }
          this.duration = o.duration(u.keyValue(t.duration));
          this.mediaFiles = i(t.mediaFiles && t.mediaFiles.mediaFile);
          this.trackingEvents = e(t.trackingEvents && t.trackingEvents.tracking, this.duration);
          this.skipoffset = o.offset(u.attr(t, 'skipoffset'), this.duration);
          if (t.videoClicks) {
            this.videoClicks = new a(t.videoClicks);
          }
          if (t.adParameters) {
            this.adParameters = u.keyValue(t.adParameters);
            if (u.attr(t.adParameters, 'xmlEncoded')) {
              this.adParameters = u.decode(this.adParameters);
            }
          }
          function e(t, e) {
            var i = [];
            if (s.isDefined(t)) {
              t = s.isArray(t) ? t : [t];
              t.forEach(function(t) {
                i.push(new n(t, e));
              });
            }
            return i;
          }
          function i(t) {
            var e = [];
            if (s.isDefined(t)) {
              t = s.isArray(t) ? t : [t];
              t.forEach(function(t) {
                e.push(new r(t));
              });
            }
            return e;
          }
        }
        l.prototype.isSupported = function() {
          var t, e;
          for (t = 0, e = this.mediaFiles.length; t < e; t += 1) {
            if (this.mediaFiles[t].isSupported()) {
              return true;
            }
          }
          return false;
        };
        e.exports = l;
      },
      {
        '../../utils/utilityFunctions': 47,
        '../../utils/xml': 48,
        './MediaFile': 20,
        './TrackingEvent': 21,
        './VideoClicks': 27,
        './parsers': 29,
      },
    ],
    20: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/xml');
        var r = t('./vastUtil');
        var a = [
          'delivery',
          'type',
          'width',
          'height',
          'codec',
          'id',
          'bitrate',
          'minBitrate',
          'maxBitrate',
          'scalable',
          'maintainAspectRatio',
          'apiFramework',
        ];
        function s(t) {
          if (!(this instanceof s)) {
            return new s(t);
          }
          this.src = n.keyValue(t);
          for (var e = 0; e < a.length; e++) {
            var i = a[e];
            this[i] = t.attr(i);
          }
        }
        s.prototype.isSupported = function() {
          if (r.isVPAID(this)) {
            return !!r.findSupportedVPAIDTech(this.type);
          }
          if (this.type === 'video/x-flv') {
            return r.isFlashSupported();
          }
          return true;
        };
        e.exports = s;
      },
      { '../../utils/xml': 48, './vastUtil': 30 },
    ],
    21: [
      function(t, e, i) {
        'use strict';
        var n = t('./parsers');
        var r = t('../../utils/xml');
        function a(t, e) {
          if (!(this instanceof a)) {
            return new a(t, e);
          }
          this.name = t.attr('event');
          this.uri = r.keyValue(t);
          if ('progress' === this.name) {
            this.offset = n.offset(t.attr('offset'), e);
          }
        }
        e.exports = a;
      },
      { '../../utils/xml': 48, './parsers': 29 },
    ],
    22: [
      function(t, e, i) {
        'use strict';
        var n = t('./Ad');
        var r = t('./VASTError');
        var a = t('./VASTResponse');
        var s = t('./vastUtil');
        var o = t('../../utils/async');
        var u = t('../../utils/http').http;
        var l = t('../../utils/utilityFunctions');
        var c = t('../../utils/xml');
        var d = t('../../utils/consoleLogger');
        function f(t) {
          if (!(this instanceof f)) {
            return new f(t);
          }
          var e = { WRAPPER_LIMIT: 5 };
          t = t || {};
          this.settings = l.extend({}, t, e);
          this.errorURLMacros = [];
        }
        f.prototype.getVASTResponse = function h(t, e) {
          var i = this;
          var n = s(t, e);
          if (n) {
            if (l.isFunction(e)) {
              return e(n);
            }
            throw n;
          }
          o.waterfall([this._getVASTAd.bind(this, t), a], e);
          function a(t, e) {
            try {
              var n = i._buildVASTResponse(t);
              e(null, n);
            } catch (r) {
              e(r);
            }
          }
          function s(t, e) {
            if (!t) {
              return new r('on VASTClient.getVASTResponse, missing ad tag URL');
            }
            if (!l.isFunction(e)) {
              return new r('on VASTClient.getVASTResponse, missing callback function');
            }
          }
        };
        f.prototype._getVASTAd = function(t, e) {
          var i = this;
          a(t, function(t, n) {
            var r = n && l.isArray(n.ads) ? n.ads : null;
            if (t) {
              i._trackError(t, r);
              return e(t, r);
            }
            f(r.shift(), [], a);
            function a(t, n) {
              if (t) {
                i._trackError(t, n);
                if (r.length > 0) {
                  f(r.shift(), [], a);
                } else {
                  e(t, n);
                }
              } else {
                e(null, n);
              }
            }
          });
          function a(t, e) {
            var n = i._requestVASTXml.bind(i, t);
            o.waterfall([n, s], e);
          }
          function s(t, e) {
            var i;
            try {
              i = c.toJXONTree(t);
              d.debug('built JXONTree from VAST response:', i);
              if (l.isArray(i.ad)) {
                i.ads = i.ad;
              } else if (i.ad) {
                i.ads = [i.ad];
              } else {
                i.ads = [];
              }
              e(u(i), i);
            } catch (n) {
              e(new r('on VASTClient.getVASTAd.buildVastWaterfall, error parsing xml', 100), null);
            }
          }
          function u(t) {
            var e = c.attr(t, 'version');
            if (!t.ad) {
              return new r('on VASTClient.getVASTAd.validateVASTTree, no Ad in VAST tree', 303);
            }
            if (e && e != 3 && e != 2) {
              return new r('on VASTClient.getVASTAd.validateVASTTree, not supported VAST version "' + e + '"', 102);
            }
            return null;
          }
          function f(t, e, n) {
            if (e.length >= i.WRAPPER_LIMIT) {
              return n(
                new r(
                  'on VASTClient.getVASTAd.getAd, players wrapper limit reached (the limit is ' + i.WRAPPER_LIMIT + ')',
                  302
                ),
                e
              );
            }
            o.waterfall(
              [
                function(e) {
                  if (l.isString(t)) {
                    v(t, e);
                  } else {
                    e(null, t);
                  }
                },
                h,
              ],
              function(t, i) {
                if (i) {
                  e.push(i);
                }
                if (t) {
                  return n(t, e);
                }
                if (i.wrapper) {
                  return f(i.wrapper.VASTAdTagURI, e, n);
                }
                return n(null, e);
              }
            );
          }
          function h(t, e) {
            try {
              var i = new n(t);
              e(p(i), i);
            } catch (a) {
              e(new r('on VASTClient.getVASTAd.buildAd, error parsing xml', 100), null);
            }
          }
          function p(t) {
            var e = t.wrapper;
            var i = t.inLine;
            var n = 'on VASTClient.getVASTAd.validateAd, ';
            if (i && e) {
              return new r(n + 'InLine and Wrapper both found on the same Ad', 101);
            }
            if (!i && !e) {
              return new r(n + 'nor wrapper nor inline elements found on the Ad', 101);
            }
            if (i && !i.isSupported()) {
              return new r(n + 'could not find MediaFile that is supported by this video player', 403);
            }
            if (e && !e.VASTAdTagURI) {
              return new r(n + "missing 'VASTAdTagURI' in wrapper", 101);
            }
            return null;
          }
          function v(t, e) {
            i._requestVASTXml(t, function(t, i) {
              if (t) {
                return e(t);
              }
              try {
                var n = c.toJXONTree(i);
                e(u(n), n.ad);
              } catch (a) {
                e(new r('on VASTClient.getVASTAd.requestVASTAd, error parsing xml', 100));
              }
            });
          }
        };
        f.prototype._requestVASTXml = function p(t, e) {
          try {
            if (l.isFunction(t)) {
              t(n);
            } else {
              d.info('requesting adTagUrl: ' + t);
              u.get(t, n, { withCredentials: true });
            }
          } catch (i) {
            e(i);
          }
          function n(t, i, n) {
            if (t) {
              var a = l.isDefined(n)
                ? "on VASTClient.requestVastXML, HTTP request error with status '" + n + "'"
                : 'on VASTClient.requestVastXML, Error getting the the VAST XML with he passed adTagXML fn';
              return e(new r(a, 301), null);
            }
            e(null, i);
          }
        };
        f.prototype._buildVASTResponse = function v(t) {
          var e = new a();
          i(e, t);
          n(e);
          return e;
          function i(t, e) {
            e.forEach(function(e) {
              t.addAd(e);
            });
          }
          function n(t) {
            var e = t.trackingEvents.progress;
            if (!t.hasLinear()) {
              throw new r('on VASTClient._buildVASTResponse, Received an Ad type that is not supported', 200);
            }
            if (t.duration === undefined) {
              throw new r('on VASTClient._buildVASTResponse, Missing duration field in VAST response', 101);
            }
            if (e) {
              e.forEach(function(t) {
                if (!l.isNumber(t.offset)) {
                  throw new r(
                    'on VASTClient._buildVASTResponse, missing or wrong offset attribute on progress tracking event',
                    101
                  );
                }
              });
            }
          }
        };
        f.prototype._trackError = function(t, e) {
          if (!l.isArray(e) || e.length === 0) {
            return;
          }
          var i = [];
          e.forEach(n);
          s.track(i, { ERRORCODE: t.code || 900 });
          function n(t) {
            if (t.wrapper && t.wrapper.error) {
              i.push(t.wrapper.error);
            }
            if (t.inLine && t.inLine.error) {
              i.push(t.inLine.error);
            }
          }
        };
        e.exports = f;
      },
      {
        '../../utils/async': 40,
        '../../utils/consoleLogger': 41,
        '../../utils/http': 43,
        '../../utils/utilityFunctions': 47,
        '../../utils/xml': 48,
        './Ad': 15,
        './VASTError': 23,
        './VASTResponse': 25,
        './vastUtil': 30,
      },
    ],
    23: [
      function(t, e, i) {
        'use strict';
        function n(t, e) {
          this.message = 'VAST Error: ' + (t || '');
          if (e) {
            this.code = e;
          }
        }
        n.prototype = new Error();
        n.prototype.name = 'VAST Error';
        e.exports = n;
      },
      {},
    ],
    24: [
      function(t, e, i) {
        'use strict';
        var n = t('./VASTResponse');
        var r = t('./VASTError');
        var a = t('./VASTTracker');
        var s = t('./vastUtil');
        var o = t('../../utils/async');
        var u = t('../../utils/dom');
        var l = t('../../utils/playerUtils');
        var c = t('../../utils/utilityFunctions');
        var d = t('../../utils/consoleLogger');
        function f(t) {
          if (!(this instanceof f)) {
            return new f(t);
          }
          this.player = t;
        }
        f.prototype.playAd = function h(t, e) {
          var i = this;
          e = e || c.noop;
          if (!(t instanceof n)) {
            return e(new r('On VASTIntegrator, missing required VASTResponse'));
          }
          o.waterfall(
            [
              function(e) {
                e(null, t);
              },
              this._selectAdSource.bind(this),
              this._createVASTTracker.bind(this),
              this._addClickThrough.bind(this),
              this._addSkipButton.bind(this),
              this._setupEvents.bind(this),
              this._playSelectedAd.bind(this),
            ],
            function(t, n) {
              if (t && n) {
                i._trackError(t, n);
              }
              e(t, n);
            }
          );
          this._adUnit = {
            _src: null,
            type: 'VAST',
            pauseAd: function() {
              i.player.pause(true);
            },
            resumeAd: function() {
              i.player.play(true);
            },
            isPaused: function() {
              return i.player.paused(true);
            },
            getSrc: function() {
              return this._src;
            },
          };
          return this._adUnit;
        };
        f.prototype._selectAdSource = function p(t, e) {
          var i;
          var n = u.getDimension(this.player.el()).width;
          t.mediaFiles.sort(function a(t, e) {
            var i = Math.abs(n - t.width);
            var r = Math.abs(n - e.width);
            return i - r;
          });
          i = this.player.selectSource(t.mediaFiles).source;
          if (i) {
            d.info('selected source: ', i);
            if (this._adUnit) {
              this._adUnit._src = i;
            }
            return e(null, i, t);
          }
          e(new r('Could not find Ad mediafile supported by this player', 403), t);
        };
        f.prototype._createVASTTracker = function v(t, e, i) {
          try {
            i(null, t, new a(t.src, e), e);
          } catch (n) {
            i(n, e);
          }
        };
        f.prototype._setupEvents = function y(t, e, i, n) {
          var r;
          var a = this.player;
          a.on('fullscreenchange', o);
          a.on('vast.adStart', d);
          a.on('pause', u);
          a.on('timeupdate', c);
          a.on('volumechange', f);
          l.once(a, ['vast.adEnd', 'vast.adsCancel'], s);
          l.once(a, ['vast.adEnd', 'vast.adsCancel', 'vast.adSkip'], function(t) {
            if (t.type === 'vast.adEnd') {
              e.trackComplete();
            }
          });
          return n(null, t, i);
          function s() {
            a.off('fullscreenchange', o);
            a.off('vast.adStart', d);
            a.off('pause', u);
            a.off('timeupdate', c);
            a.off('volumechange', f);
          }
          function o() {
            if (a.isFullscreen()) {
              e.trackFullscreen();
            } else {
              e.trackExitFullscreen();
            }
          }
          function u() {
            if (Math.abs(a.duration() - a.currentTime()) < 2) {
              return;
            }
            e.trackPause();
            l.once(a, ['play', 'vast.adEnd', 'vast.adsCancel'], function(t) {
              if (t.type === 'play') {
                e.trackResume();
              }
            });
          }
          function c() {
            var t = a.currentTime() * 1e3;
            e.trackProgress(t);
          }
          function d() {
            e.trackImpressions();
            e.trackCreativeView();
          }
          function f() {
            var t = a.muted();
            if (t) {
              e.trackMute();
            } else if (r) {
              e.trackUnmute();
            }
            r = t;
          }
        };
        f.prototype._addSkipButton = function g(t, e, i, n) {
          var r;
          var a = this;
          if (c.isNumber(i.skipoffset)) {
            r = i.skipoffset / 1e3;
            s(this.player, r);
          }
          n(null, t, e, i);
          function s(t, e) {
            var i = o(t);
            var n = d.bind(a, i, e, t);
            t.el().appendChild(i);
            t.on('timeupdate', n);
            l.once(t, ['vast.adEnd', 'vast.adsCancel'], r);
            function r() {
              t.off('timeupdate', n);
              u.remove(i);
            }
          }
          function o(t) {
            var i = window.document.createElement('div');
            u.addClass(i, 'vast-skip-button');
            i.onclick = function(n) {
              if (u.hasClass(i, 'enabled')) {
                e.trackSkip();
                t.trigger('vast.adSkip');
              }
              if (window.Event.prototype.stopPropagation !== undefined) {
                n.stopPropagation();
              } else {
                return false;
              }
            };
            return i;
          }
          function d(t, e, i) {
            var n = Math.ceil(e - i.currentTime());
            if (n > 0) {
              t.innerHTML = 'Skip in ' + c.toFixedDigits(n, 2) + '...';
            } else {
              if (!u.hasClass(t, 'enabled')) {
                u.addClass(t, 'enabled');
                t.innerHTML = 'Skip ad';
              }
            }
          }
        };
        f.prototype._addClickThrough = function m(t, e, i, n) {
          var r = this.player;
          var a = d(r, e, i);
          var o = f.bind(this, a, i, r);
          r.el().insertBefore(a, r.controlBar.el());
          r.on('timeupdate', o);
          l.once(r, ['vast.adEnd', 'vast.adsCancel'], p);
          return n(null, t, e, i);
          function d(t, e, i) {
            var n = window.document.createElement('a');
            var r = i.clickThrough;
            u.addClass(n, 'vast-blocker');
            n.href = h(r, t);
            if (c.isString(r)) {
              n.target = '_blank';
            }
            n.onclick = function(i) {
              if (t.paused()) {
                t.play();
                if (window.Event.prototype.stopPropagation !== undefined) {
                  i.stopPropagation();
                }
                return false;
              }
              t.pause();
              e.trackClick();
            };
            return n;
          }
          function f(t, e, i) {
            t.href = h(e.clickThrough, i);
          }
          function h(e, i) {
            var n = { ASSETURI: t.src, CONTENTPLAYHEAD: s.formatProgress(i.currentTime() * 1e3) };
            return e ? s.parseURLMacro(e, n) : '#';
          }
          function p() {
            r.off('timeupdate', o);
            u.remove(a);
          }
        };
        f.prototype._playSelectedAd = function A(t, e, i) {
          var n = this.player;
          n.preload('auto');
          n.src(t);
          d.debug('<VASTIntegrator._playSelectedAd> waiting for durationchange to play the ad...');
          l.once(n, ['durationchange', 'error', 'vast.adsCancel'], function(t) {
            if (t.type === 'durationchange') {
              d.debug('<VASTIntegrator._playSelectedAd> got durationchange; calling playAd()');
              a();
            } else if (t.type === 'error') {
              i(new r('on VASTIntegrator, Player is unable to play the Ad', 400), e);
            }
          });
          function a() {
            l.once(n, ['playing', 'vast.adsCancel'], function(t) {
              if (t.type === 'vast.adsCancel') {
                return;
              }
              d.debug('<VASTIntegrator._playSelectedAd/playAd> got playing event; triggering vast.adStart...');
              n.trigger('vast.adStart');
              n.on('ended', r);
              n.on('vast.adsCancel', r);
              n.on('vast.adSkip', r);
              function r(t) {
                if (t.type === 'ended' && n.duration() - n.currentTime() > 3) {
                  return;
                }
                n.off('ended', r);
                n.off('vast.adsCancel', r);
                n.off('vast.adSkip', r);
                if (t.type === 'ended' || t.type === 'vast.adSkip') {
                  i(null, e);
                }
              }
            });
            d.debug('<VASTIntegrator._playSelectedAd/playAd> calling player.play()...');
            n.play();
          }
        };
        f.prototype._trackError = function k(t, e) {
          s.track(e.errorURLMacros, { ERRORCODE: t.code || 900 });
        };
        e.exports = f;
      },
      {
        '../../utils/async': 40,
        '../../utils/consoleLogger': 41,
        '../../utils/dom': 42,
        '../../utils/playerUtils': 45,
        '../../utils/utilityFunctions': 47,
        './VASTError': 23,
        './VASTResponse': 25,
        './VASTTracker': 26,
        './vastUtil': 30,
      },
    ],
    25: [
      function(t, e, i) {
        'use strict';
        var n = t('./Ad');
        var r = t('./VideoClicks');
        var a = t('./Linear');
        var s = t('./InLine');
        var o = t('./Wrapper');
        var u = t('../../utils/utilityFunctions');
        var l = t('../../utils/xml');
        window.InLine__A = s;
        function c() {
          if (!(this instanceof c)) {
            return new c();
          }
          this._linearAdded = false;
          this.ads = [];
          this.errorURLMacros = [];
          this.impressions = [];
          this.clickTrackings = [];
          this.customClicks = [];
          this.trackingEvents = {};
          this.mediaFiles = [];
          this.clickThrough = undefined;
          this.adTitle = '';
          this.duration = undefined;
          this.skipoffset = undefined;
        }
        c.prototype.addAd = function(t) {
          var e, i;
          if (t instanceof n) {
            e = t.inLine;
            i = t.wrapper;
            this.ads.push(t);
            if (e) {
              this._addInLine(e);
            }
            if (i) {
              this._addWrapper(i);
            }
          }
        };
        c.prototype._addErrorTrackUrl = function(t) {
          var e = t instanceof l.JXONTree ? l.keyValue(t) : t;
          if (e) {
            this.errorURLMacros.push(e);
          }
        };
        c.prototype._addImpressions = function(t) {
          u.isArray(t) && d(this.impressions, t);
        };
        c.prototype._addClickThrough = function(t) {
          if (u.isNotEmptyString(t)) {
            this.clickThrough = t;
          }
        };
        c.prototype._addClickTrackings = function(t) {
          u.isArray(t) && d(this.clickTrackings, t);
        };
        c.prototype._addCustomClicks = function(t) {
          u.isArray(t) && d(this.customClicks, t);
        };
        c.prototype._addTrackingEvents = function(t) {
          var e = this.trackingEvents;
          if (t) {
            t = u.isArray(t) ? t : [t];
            t.forEach(function(t) {
              if (!e[t.name]) {
                e[t.name] = [];
              }
              e[t.name].push(t);
            });
          }
        };
        c.prototype._addTitle = function(t) {
          if (u.isNotEmptyString(t)) {
            this.adTitle = t;
          }
        };
        c.prototype._addDuration = function(t) {
          if (u.isNumber(t)) {
            this.duration = t;
          }
        };
        c.prototype._addVideoClicks = function(t) {
          if (t instanceof r) {
            this._addClickThrough(t.clickThrough);
            this._addClickTrackings(t.clickTrackings);
            this._addCustomClicks(t.customClicks);
          }
        };
        c.prototype._addMediaFiles = function(t) {
          u.isArray(t) && d(this.mediaFiles, t);
        };
        c.prototype._addSkipoffset = function(t) {
          if (t) {
            this.skipoffset = t;
          }
        };
        c.prototype._addAdParameters = function(t) {
          if (t) {
            this.adParameters = t;
          }
        };
        c.prototype._addLinear = function(t) {
          if (t instanceof a) {
            this._addDuration(t.duration);
            this._addTrackingEvents(t.trackingEvents);
            this._addVideoClicks(t.videoClicks);
            this._addMediaFiles(t.mediaFiles);
            this._addSkipoffset(t.skipoffset);
            this._addAdParameters(t.adParameters);
            this._linearAdded = true;
          }
        };
        c.prototype._addInLine = function(t) {
          var e = this;
          if (t instanceof s) {
            this._addTitle(t.adTitle);
            this._addErrorTrackUrl(t.error);
            this._addImpressions(t.impressions);
            t.creatives.forEach(function(t) {
              if (t.linear) {
                e._addLinear(t.linear);
              }
            });
          }
        };
        c.prototype._addWrapper = function(t) {
          var e = this;
          if (t instanceof o) {
            this._addErrorTrackUrl(t.error);
            this._addImpressions(t.impressions);
            t.creatives.forEach(function(t) {
              var i = t.linear;
              if (i) {
                e._addVideoClicks(i.videoClicks);
                e.clickThrough = undefined;
                e._addTrackingEvents(i.trackingEvents);
              }
            });
          }
        };
        c.prototype.hasLinear = function() {
          return this._linearAdded;
        };
        function d(t, e) {
          e.forEach(function(e) {
            t.push(e);
          });
        }
        e.exports = c;
      },
      {
        '../../utils/utilityFunctions': 47,
        '../../utils/xml': 48,
        './Ad': 15,
        './InLine': 18,
        './Linear': 19,
        './VideoClicks': 27,
        './Wrapper': 28,
      },
    ],
    26: [
      function(t, e, i) {
        'use strict';
        var n = t('./VASTError');
        var r = t('./VASTResponse');
        var a = t('./vastUtil');
        var s = t('../../utils/utilityFunctions');
        function o(t, e) {
          if (!(this instanceof o)) {
            return new o(t, e);
          }
          this.sanityCheck(t, e);
          this.initialize(t, e);
        }
        o.prototype.initialize = function(t, e) {
          this.response = e;
          this.assetURI = t;
          this.progress = 0;
          this.quartiles = {
            firstQuartile: { tracked: false, time: Math.round(25 * e.duration) / 100 },
            midpoint: { tracked: false, time: Math.round(50 * e.duration) / 100 },
            thirdQuartile: { tracked: false, time: Math.round(75 * e.duration) / 100 },
          };
        };
        o.prototype.sanityCheck = function(t, e) {
          if (!s.isString(t) || s.isEmptyString(t)) {
            throw new n('on VASTTracker constructor, missing required the URI of the ad asset being played');
          }
          if (!(e instanceof r)) {
            throw new n('on VASTTracker constructor, missing required VAST response');
          }
        };
        o.prototype.trackURLs = function u(t, e) {
          if (s.isArray(t) && t.length > 0) {
            e = s.extend({ ASSETURI: this.assetURI, CONTENTPLAYHEAD: a.formatProgress(this.progress) }, e || {});
            a.track(t, e);
          }
        };
        o.prototype.trackEvent = function l(t, e) {
          this.trackURLs(i(this.response.trackingEvents[t]));
          if (e) {
            this.response.trackingEvents[t] = undefined;
          }
          function i(t) {
            var e;
            if (t) {
              e = [];
              t.forEach(function(t) {
                if (!t.uri) {
                  return;
                }
                e.push(t.uri);
              });
            }
            return e;
          }
        };
        o.prototype.trackProgress = function c(t) {
          var e = this;
          var i = [];
          var n = true;
          var r = false;
          var a = this.response.trackingEvents;
          if (s.isNumber(t)) {
            u('start', n, t > 0);
            u('rewind', r, o(this.progress, t));
            l(t);
            d(t);
            f();
            this.progress = t;
          }
          function o(e, i) {
            var n = 3e3;
            return e > t && Math.abs(i - e) > n;
          }
          function u(t, e, n) {
            if (a[t] && n) {
              i.push({ name: t, trackOnce: !!e });
            }
          }
          function l(t) {
            var i = e.quartiles;
            var r = e.quartiles.firstQuartile;
            var a = e.quartiles.midpoint;
            var s = e.quartiles.thirdQuartile;
            if (!r.tracked) {
              o('firstQuartile', t);
            } else if (!a.tracked) {
              o('midpoint', t);
            } else if (!s.tracked) {
              o('thirdQuartile', t);
            }
            function o(t, e) {
              var r = i[t];
              if (c(r, e)) {
                r.tracked = true;
                u(t, n, true);
              }
            }
          }
          function c(t, e) {
            var i = t.time;
            return e >= i && e <= i + 5e3;
          }
          function d(t) {
            if (!s.isArray(a.progress)) {
              return;
            }
            var i = [];
            a.progress.forEach(function(n) {
              if (n.offset <= t) {
                e.trackURLs([n.uri]);
              } else {
                i.push(n);
              }
            });
            a.progress = i;
          }
          function f() {
            i.forEach(function(t) {
              e.trackEvent(t.name, t.trackOnce);
            });
          }
        };
        [
          'rewind',
          'fullscreen',
          'exitFullscreen',
          'pause',
          'resume',
          'mute',
          'unmute',
          'acceptInvitation',
          'acceptInvitationLinear',
          'collapse',
          'expand',
        ].forEach(function(t) {
          o.prototype['track' + s.capitalize(t)] = function() {
            this.trackEvent(t);
          };
        });
        ['start', 'skip', 'close', 'closeLinear'].forEach(function(t) {
          o.prototype['track' + s.capitalize(t)] = function() {
            this.trackEvent(t, true);
          };
        });
        ['firstQuartile', 'midpoint', 'thirdQuartile'].forEach(function(t) {
          o.prototype['track' + s.capitalize(t)] = function() {
            this.quartiles[t].tracked = true;
            this.trackEvent(t, true);
          };
        });
        o.prototype.trackComplete = function() {
          if (this.quartiles.thirdQuartile.tracked) {
            this.trackEvent('complete', true);
          }
        };
        o.prototype.trackErrorWithCode = function d(t) {
          if (s.isNumber(t)) {
            this.trackURLs(this.response.errorURLMacros, { ERRORCODE: t });
          }
        };
        o.prototype.trackImpressions = function f() {
          this.trackURLs(this.response.impressions);
        };
        o.prototype.trackCreativeView = function h() {
          this.trackEvent('creativeView');
        };
        o.prototype.trackClick = function p() {
          this.trackURLs(this.response.clickTrackings);
        };
        e.exports = o;
      },
      { '../../utils/utilityFunctions': 47, './VASTError': 23, './VASTResponse': 25, './vastUtil': 30 },
    ],
    27: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/utilityFunctions');
        var r = t('../../utils/xml');
        function a(t) {
          if (!(this instanceof a)) {
            return new a(t);
          }
          this.clickThrough = r.keyValue(t.clickThrough);
          this.clickTrackings = e(t.clickTracking);
          this.customClicks = e(t.customClick);
          function e(t) {
            var e = [];
            if (t) {
              t = n.isArray(t) ? t : [t];
              t.forEach(function(t) {
                e.push(r.keyValue(t));
              });
            }
            return e;
          }
        }
        e.exports = a;
      },
      { '../../utils/utilityFunctions': 47, '../../utils/xml': 48 },
    ],
    28: [
      function(t, e, i) {
        'use strict';
        var n = t('./vastUtil');
        var r = t('./Creative');
        var a = t('../../utils/utilityFunctions');
        var s = t('../../utils/xml');
        function o(t) {
          if (!(this instanceof o)) {
            return new o(t);
          }
          this.adSystem = s.keyValue(t.adSystem);
          this.impressions = n.parseImpressions(t.impression);
          this.VASTAdTagURI = s.keyValue(t.vASTAdTagURI);
          this.creatives = r.parseCreatives(t.creatives);
          this.error = s.keyValue(t.error);
          this.extensions = t.extensions;
          this.followAdditionalWrappers = a.isDefined(s.attr(t, 'followAdditionalWrappers'))
            ? s.attr(t, 'followAdditionalWrappers')
            : true;
          this.allowMultipleAds = s.attr(t, 'allowMultipleAds');
          this.fallbackOnNoAd = s.attr(t, 'fallbackOnNoAd');
        }
        e.exports = o;
      },
      { '../../utils/utilityFunctions': 47, '../../utils/xml': 48, './Creative': 17, './vastUtil': 30 },
    ],
    29: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/utilityFunctions');
        var r = /(\d\d):(\d\d):(\d\d)(\.(\d\d\d))?/;
        var a = {
          duration: function s(t) {
            var e, i;
            if (n.isString(t)) {
              e = t.match(r);
              if (e) {
                i = a(e[1]) + s(e[2]) + o(e[3]) + parseInt(e[5] || 0);
              }
            }
            return isNaN(i) ? null : i;
            function a(t) {
              return parseInt(t, 10) * 60 * 60 * 1e3;
            }
            function s(t) {
              return parseInt(t, 10) * 60 * 1e3;
            }
            function o(t) {
              return parseInt(t, 10) * 1e3;
            }
          },
          offset: function o(t, e) {
            if (i(t)) {
              return n(t, e);
            }
            return a.duration(t);
            function i(t) {
              var e = /^\d+(\.\d+)?%$/g;
              return e.test(t);
            }
            function n(t, e) {
              if (e) {
                return r(e, parseFloat(t.replace('%', '')));
              }
              return null;
            }
            function r(t, e) {
              return (t * e) / 100;
            }
          },
        };
        e.exports = a;
      },
      { '../../utils/utilityFunctions': 47 },
    ],
    30: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/utilityFunctions');
        var r = t('../vpaid/VPAIDHTML5Tech');
        var a = t('../vpaid/VPAIDFlashTech');
        var s = t('VPAIDFLASHClient/js/VPAIDFLASHClient');
        var o = {
          track: function u(t, e) {
            var i = o.parseURLMacros(t, e);
            var n = [];
            i.forEach(function(t) {
              var e = new Image();
              e.src = t;
              n.push(e);
            });
            return n;
          },
          parseURLMacros: function l(t, e) {
            var i = [];
            e = e || {};
            if (!e['CACHEBUSTING']) {
              e['CACHEBUSTING'] = Math.round(Math.random() * 1e10);
            }
            t.forEach(function(t) {
              i.push(o._parseURLMacro(t, e));
            });
            return i;
          },
          parseURLMacro: function c(t, e) {
            e = e || {};
            if (!e['CACHEBUSTING']) {
              e['CACHEBUSTING'] = Math.round(Math.random() * 1e10);
            }
            return o._parseURLMacro(t, e);
          },
          _parseURLMacro: function d(t, e) {
            e = e || {};
            n.forEach(e, function(e, i) {
              t = t.replace(new RegExp('\\[' + i + '\\]', 'gm'), e);
            });
            return t;
          },
          parseDuration: function f(t) {
            var e = /(\d\d):(\d\d):(\d\d)(\.(\d\d\d))?/;
            var i, r;
            if (n.isString(t)) {
              i = t.match(e);
              if (i) {
                r = a(i[1]) + s(i[2]) + o(i[3]) + parseInt(i[5] || 0);
              }
            }
            return isNaN(r) ? null : r;
            function a(t) {
              return parseInt(t, 10) * 60 * 60 * 1e3;
            }
            function s(t) {
              return parseInt(t, 10) * 60 * 1e3;
            }
            function o(t) {
              return parseInt(t, 10) * 1e3;
            }
          },
          parseImpressions: function h(t) {
            if (t) {
              t = n.isArray(t) ? t : [t];
              return n.transformArray(t, function(t) {
                if (n.isNotEmptyString(t.keyValue)) {
                  return t.keyValue;
                }
                return undefined;
              });
            }
            return [];
          },
          formatProgress: function p(t) {
            var e, i, r, a;
            e = t / (60 * 60 * 1e3);
            e = Math.floor(e);
            i = (t / (60 * 1e3)) % 60;
            i = Math.floor(i);
            r = (t / 1e3) % 60;
            r = Math.floor(r);
            a = t % 1e3;
            return (
              n.toFixedDigits(e, 2) +
              ':' +
              n.toFixedDigits(i, 2) +
              ':' +
              n.toFixedDigits(r, 2) +
              '.' +
              n.toFixedDigits(a, 3)
            );
          },
          parseOffset: function v(t, e) {
            if (i(t)) {
              return n(t, e);
            }
            return o.parseDuration(t);
            function i(t) {
              var e = /^\d+(\.\d+)?%$/g;
              return e.test(t);
            }
            function n(t, e) {
              if (e) {
                return r(e, parseFloat(t.replace('%', '')));
              }
              return null;
            }
            function r(t, e) {
              return (t * e) / 100;
            }
          },
          VPAID_techs: [a, r],
          isVPAID: function y(t) {
            return !!t && t.apiFramework === 'VPAID';
          },
          findSupportedVPAIDTech: function g(t) {
            var e, i, n;
            for (e = 0, i = this.VPAID_techs.length; e < i; e += 1) {
              n = this.VPAID_techs[e];
              if (n.supports(t)) {
                return n;
              }
            }
            return null;
          },
          isFlashSupported: function m() {
            return s.isSupported();
          },
          runFlashSupportCheck: function A(t) {
            s.runFlashTest({ data: t });
          },
        };
        e.exports = o;
      },
      {
        '../../utils/utilityFunctions': 47,
        '../vpaid/VPAIDFlashTech': 32,
        '../vpaid/VPAIDHTML5Tech': 33,
        'VPAIDFLASHClient/js/VPAIDFLASHClient': 3,
      },
    ],
    31: [
      function(t, e, i) {
        'use strict';
        var n = t('../vast/VASTError');
        var r = t('../../utils/utilityFunctions');
        function a(t, e) {
          if (!(this instanceof a)) {
            return new a(t, e);
          }
          i(t, e);
          this.options = r.extend({}, e);
          this._adUnit = t;
          function i(t, e) {
            if (!t || !a.checkVPAIDInterface(t)) {
              throw new n(
                'on VPAIDAdUnitWrapper, the passed VPAID adUnit does not fully implement the VPAID interface'
              );
            }
            if (!r.isObject(e)) {
              throw new n("on VPAIDAdUnitWrapper, expected options hash  but got '" + e + "'");
            }
            if (!('responseTimeout' in e) || !r.isNumber(e.responseTimeout)) {
              throw new n('on VPAIDAdUnitWrapper, expected responseTimeout in options');
            }
          }
        }
        a.checkVPAIDInterface = function s(t) {
          var e = ['handshakeVersion', 'initAd', 'startAd', 'stopAd', 'resizeAd', 'pauseAd', 'expandAd', 'collapseAd'];
          for (var i = 0, n = e.length; i < n; i++) {
            if (!t || !r.isFunction(t[e[i]])) {
              return false;
            }
          }
          return a(t) && s(t);
          function a(t) {
            return r.isFunction(t.subscribe) || r.isFunction(t.addEventListener) || r.isFunction(t.on);
          }
          function s(t) {
            return r.isFunction(t.unsubscribe) || r.isFunction(t.removeEventListener) || r.isFunction(t.off);
          }
        };
        a.prototype.adUnitAsyncCall = function() {
          var t = r.arrayLikeObjToArray(arguments);
          var e = t.shift();
          var i = t.pop();
          var a;
          s(e, i, this._adUnit);
          t.push(o());
          this._adUnit[e].apply(this._adUnit, t);
          a = setTimeout(function() {
            a = null;
            i(new n("on VPAIDAdUnitWrapper, timeout while waiting for a response on call '" + e + "'"));
            i = r.noop;
          }, this.options.responseTimeout);
          function s(t, e, i) {
            if (!r.isString(t) || !r.isFunction(i[t])) {
              throw new n('on VPAIDAdUnitWrapper.adUnitAsyncCall, invalid method name');
            }
            if (!r.isFunction(e)) {
              throw new n('on VPAIDAdUnitWrapper.adUnitAsyncCall, missing callback');
            }
          }
          function o() {
            return function() {
              if (a) {
                clearTimeout(a);
              }
              i.apply(this, arguments);
            };
          }
        };
        a.prototype.on = function(t, e) {
          var i = this._adUnit.addEventListener || this._adUnit.subscribe || this._adUnit.on;
          i.call(this._adUnit, t, e);
        };
        a.prototype.off = function(t, e) {
          var i = this._adUnit.removeEventListener || this._adUnit.unsubscribe || this._adUnit.off;
          i.call(this._adUnit, t, e);
        };
        a.prototype.waitForEvent = function(t, e, i) {
          var a;
          s(t, e);
          i = i || null;
          this.on(t, o);
          a = setTimeout(function() {
            e(new n("on VPAIDAdUnitWrapper.waitForEvent, timeout while waiting for event '" + t + "'"));
            a = null;
            e = r.noop;
          }, this.options.responseTimeout);
          function s(t, e) {
            if (!r.isString(t)) {
              throw new n('on VPAIDAdUnitWrapper.waitForEvent, missing evt name');
            }
            if (!r.isFunction(e)) {
              throw new n('on VPAIDAdUnitWrapper.waitForEvent, missing callback');
            }
          }
          function o() {
            var t = r.arrayLikeObjToArray(arguments);
            if (a) {
              clearTimeout(a);
              a = null;
            }
            t.unshift(null);
            e.apply(i, t);
          }
        };
        a.prototype.handshakeVersion = function(t, e) {
          this.adUnitAsyncCall('handshakeVersion', t, e);
        };
        a.prototype.initAd = function(t, e, i, n, r, a) {
          this.waitForEvent('AdLoaded', a);
          this._adUnit.initAd(t, e, i, n, r);
        };
        a.prototype.resizeAd = function(t, e, i, n) {
          this.adUnitAsyncCall('resizeAd', t, e, i, n);
        };
        a.prototype.startAd = function(t) {
          this.waitForEvent('AdStarted', t);
          this._adUnit.startAd();
        };
        a.prototype.stopAd = function(t) {
          this.waitForEvent('AdStopped', t);
          this._adUnit.stopAd();
        };
        a.prototype.pauseAd = function(t) {
          this.waitForEvent('AdPaused', t);
          this._adUnit.pauseAd();
        };
        a.prototype.resumeAd = function(t) {
          this.waitForEvent('AdPlaying', t);
          this._adUnit.resumeAd();
        };
        a.prototype.expandAd = function(t) {
          this.waitForEvent('AdExpandedChange', t);
          this._adUnit.expandAd();
        };
        a.prototype.collapseAd = function(t) {
          this.waitForEvent('AdExpandedChange', t);
          this._adUnit.collapseAd();
        };
        a.prototype.skipAd = function(t) {
          this.waitForEvent('AdSkipped', t);
          this._adUnit.skipAd();
        };
        [
          'adLinear',
          'adWidth',
          'adHeight',
          'adExpanded',
          'adSkippableState',
          'adRemainingTime',
          'adDuration',
          'adVolume',
          'adCompanions',
          'adIcons',
        ].forEach(function(t) {
          var e = 'get' + r.capitalize(t);
          a.prototype[e] = function(t) {
            this.adUnitAsyncCall(e, t);
          };
        });
        a.prototype.setAdVolume = function(t, e) {
          this.adUnitAsyncCall('setAdVolume', t, e);
        };
        e.exports = a;
      },
      { '../../utils/utilityFunctions': 47, '../vast/VASTError': 23 },
    ],
    32: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/mimetypes');
        var r = t('../vast/VASTError');
        var a = t('VPAIDFLASHClient/js/VPAIDFLASHClient');
        var s = t('../../utils/utilityFunctions');
        var o = t('../../utils/dom');
        var u = t('../../utils/consoleLogger');
        function l(t, e) {
          if (!(this instanceof l)) {
            return new l(t);
          }
          i(t);
          this.name = 'vpaid-flash';
          this.mediaFile = t;
          this.containerEl = null;
          this.vpaidFlashClient = null;
          this.settings = e;
          function i(t) {
            if (!t || !s.isString(t.src)) {
              throw new r('on VPAIDFlashTech, invalid MediaFile');
            }
          }
        }
        l.VPAIDFLASHClient = a;
        l.supports = function(t) {
          return n.flash.indexOf(t) > -1 && l.VPAIDFLASHClient.isSupported();
        };
        l.prototype.loadAdUnit = function c(t, e, i) {
          var n = this;
          var a =
            this.settings && this.settings.vpaidFlashLoaderPath
              ? { data: this.settings.vpaidFlashLoaderPath }
              : undefined;
          c(t, i);
          this.containerEl = t;
          u.debug('<VPAIDFlashTech.loadAdUnit> loading VPAIDFLASHClient with opts:', a);
          this.vpaidFlashClient = new l.VPAIDFLASHClient(
            t,
            function(t) {
              if (t) {
                return i(t);
              }
              u.info('<VPAIDFlashTech.loadAdUnit> calling VPAIDFLASHClient.loadAdUnit(); that.mediaFile:', n.mediaFile);
              n.vpaidFlashClient.loadAdUnit(n.mediaFile.src, i);
            },
            a
          );
          function c(t, e) {
            if (!o.isDomElement(t)) {
              throw new r('on VPAIDFlashTech.loadAdUnit, invalid dom container element');
            }
            if (!s.isFunction(e)) {
              throw new r('on VPAIDFlashTech.loadAdUnit, missing valid callback');
            }
          }
        };
        l.prototype.unloadAdUnit = function() {
          if (this.vpaidFlashClient) {
            try {
              this.vpaidFlashClient.destroy();
            } catch (t) {
              u.error('VAST ERROR: trying to unload the VPAID adunit');
            }
            this.vpaidFlashClient = null;
          }
          if (this.containerEl) {
            o.remove(this.containerEl);
            this.containerEl = null;
          }
        };
        e.exports = l;
      },
      {
        '../../utils/consoleLogger': 41,
        '../../utils/dom': 42,
        '../../utils/mimetypes': 44,
        '../../utils/utilityFunctions': 47,
        '../vast/VASTError': 23,
        'VPAIDFLASHClient/js/VPAIDFLASHClient': 3,
      },
    ],
    33: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/mimetypes');
        var r = t('../vast/VASTError');
        var a = t('VPAIDHTML5Client/js/VPAIDHTML5Client');
        var s = t('../../utils/utilityFunctions');
        var o = t('../../utils/dom');
        var u = t('../../utils/consoleLogger');
        function l(t) {
          if (!(this instanceof l)) {
            return new l(t);
          }
          e(t);
          this.name = 'vpaid-html5';
          this.containerEl = null;
          this.videoEl = null;
          this.vpaidHTMLClient = null;
          this.mediaFile = t;
          function e(t) {
            if (!t || !s.isString(t.src)) {
              throw new r(l.INVALID_MEDIA_FILE);
            }
          }
        }
        l.VPAIDHTML5Client = a;
        l.supports = function(t) {
          return !s.isOldIE() && n.html5.indexOf(t) > -1;
        };
        l.prototype.loadAdUnit = function d(t, e, i) {
          n(t, e, i);
          this.containerEl = t;
          this.videoEl = e;
          this.vpaidHTMLClient = new l.VPAIDHTML5Client(t, e, {});
          this.vpaidHTMLClient.loadAdUnit(this.mediaFile.src, i);
          function n(t, e, i) {
            if (!o.isDomElement(t)) {
              throw new r(l.INVALID_DOM_CONTAINER_EL);
            }
            if (!o.isDomElement(e) || e.tagName.toLowerCase() !== 'video') {
              throw new r(l.INVALID_DOM_CONTAINER_EL);
            }
            if (!s.isFunction(i)) {
              throw new r(l.MISSING_CALLBACK);
            }
          }
        };
        l.prototype.unloadAdUnit = function f() {
          if (this.vpaidHTMLClient) {
            try {
              this.vpaidHTMLClient.destroy();
            } catch (t) {
              u.error('VAST ERROR: trying to unload the VPAID adunit');
            }
            this.vpaidHTMLClient = null;
          }
          if (this.containerEl) {
            o.remove(this.containerEl);
            this.containerEl = null;
          }
        };
        var c = 'on VPAIDHTML5Tech';
        l.INVALID_MEDIA_FILE = c + ', invalid MediaFile';
        l.INVALID_DOM_CONTAINER_EL = c + ', invalid container HtmlElement';
        l.INVALID_DOM_VIDEO_EL = c + ', invalid HTMLVideoElement';
        l.MISSING_CALLBACK = c + ', missing valid callback';
        e.exports = l;
      },
      {
        '../../utils/consoleLogger': 41,
        '../../utils/dom': 42,
        '../../utils/mimetypes': 44,
        '../../utils/utilityFunctions': 47,
        '../vast/VASTError': 23,
        'VPAIDHTML5Client/js/VPAIDHTML5Client': 11,
      },
    ],
    34: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/mimetypes');
        var r = t('../vast/VASTError');
        var a = t('../vast/VASTResponse');
        var s = t('../vast/VASTTracker');
        var o = t('../vast/vastUtil');
        var u = t('./VPAIDAdUnitWrapper');
        var l = t('../../utils/async');
        var c = t('../../utils/dom');
        var d = t('../../utils/playerUtils');
        var f = t('../../utils/utilityFunctions');
        var h = t('../../utils/consoleLogger');
        function p(t, e) {
          if (!(this instanceof p)) {
            return new p(t);
          }
          this.VIEW_MODE = { NORMAL: 'normal', FULLSCREEN: 'fullscreen', THUMBNAIL: 'thumbnail' };
          this.player = t;
          this.containerEl = i(t);
          this.options = { responseTimeout: 5e3, VPAID_VERSION: '2.0' };
          this.settings = e;
          function i() {
            var e = document.createElement('div');
            c.addClass(e, 'VPAID-container');
            t.el().insertBefore(e, t.controlBar.el());
            return e;
          }
        }
        p.prototype.playAd = function g(t, e) {
          if (!(t instanceof a)) {
            return e(new r('on VASTIntegrator.playAd, missing required VASTResponse'));
          }
          var i = this;
          var n = this.player;
          h.debug('<VPAIDIntegrator.playAd> looking for supported tech...');
          var s = this._findSupportedTech(t, this.settings);
          e = e || f.noop;
          this._adUnit = null;
          c.addClass(n.el(), 'vjs-vpaid-ad');
          n.on('vast.adsCancel', d);
          n.one('vpaid.adEnd', function() {
            n.off('vast.adsCancel', d);
            p();
          });
          if (s) {
            h.info('<VPAIDIntegrator.playAd> found tech: ', s);
            l.waterfall(
              [
                function(e) {
                  e(null, s, t);
                },
                this._loadAdUnit.bind(this),
                this._playAdUnit.bind(this),
                this._finishPlaying.bind(this),
              ],
              u
            );
            this._adUnit = {
              _paused: true,
              type: 'VPAID',
              pauseAd: function() {
                n.trigger('vpaid.pauseAd');
                n.pause(true);
              },
              resumeAd: function() {
                n.trigger('vpaid.resumeAd');
              },
              isPaused: function() {
                return this._paused;
              },
              getSrc: function() {
                return s.mediaFile;
              },
            };
          } else {
            h.debug('<VPAIDIntegrator.playAd> could not find suitable tech');
            var o = new r('on VPAIDIntegrator.playAd, could not find a supported mediaFile', 403);
            u(o, this._adUnit, t);
          }
          return this._adUnit;
          function u(t, r, a) {
            if (t && a) {
              i._trackError(a, t.code);
            }
            n.trigger('vpaid.adEnd');
            e(t, a);
          }
          function d() {
            n.trigger('vpaid.adEnd');
          }
          function p() {
            if (s) {
              s.unloadAdUnit();
            }
            c.removeClass(n.el(), 'vjs-vpaid-ad');
          }
        };
        p.prototype._findSupportedTech = function(t, e) {
          if (!(t instanceof a)) {
            return null;
          }
          var i = t.mediaFiles.filter(o.isVPAID);
          var r = e && e.preferredTech;
          var s = [];
          var u, l, c, d, f;
          for (u = 0, l = i.length; u < l; u += 1) {
            c = i[u];
            d = o.findSupportedVPAIDTech(c.type);
            if (!d) {
              continue;
            }
            f = r ? c.type === r || (n[r] && n[r].indexOf(c.type) > -1) : false;
            if (f) {
              return new d(c, e);
            }
            s.push({ mediaFile: c, tech: d });
          }
          if (s.length) {
            var h = s[0];
            return new h.tech(h.mediaFile, e);
          }
          return null;
        };
        p.prototype._createVPAIDAdUnitWrapper = function(t, e, i) {
          return new u(t, { src: e, responseTimeout: i });
        };
        p.prototype._loadAdUnit = function(t, e, i) {
          var n = this;
          var r = this.player;
          var a = r.el().querySelector('.vjs-tech');
          var s = this.settings.responseTimeout || this.options.responseTimeout;
          t.loadAdUnit(this.containerEl, a, function(a, o) {
            if (a) {
              return i(a, o, e);
            }
            try {
              var u = n._createVPAIDAdUnitWrapper(o, t.mediaFile.src, s);
              var l = 'vjs-' + t.name + '-ad';
              c.addClass(r.el(), l);
              r.one('vpaid.adEnd', function() {
                c.removeClass(r.el(), l);
              });
              i(null, u, e);
            } catch (d) {
              i(d, o, e);
            }
          });
        };
        p.prototype._playAdUnit = function(t, e, i) {
          l.waterfall(
            [
              function(i) {
                i(null, t, e);
              },
              this._handshake.bind(this),
              this._initAd.bind(this),
              this._setupEvents.bind(this),
              this._addSkipButton.bind(this),
              this._linkPlayerControls.bind(this),
              this._startAd.bind(this),
            ],
            i
          );
        };
        p.prototype._handshake = function m(t, e, i) {
          t.handshakeVersion(this.options.VPAID_VERSION, function(a, s) {
            if (a) {
              return i(a, t, e);
            }
            if (s && n(s)) {
              return i(null, t, e);
            }
            return i(new r('on VPAIDIntegrator._handshake, unsupported version "' + s + '"'), t, e);
          });
          function n(t) {
            var e = a(t);
            return e >= 1 && e <= 2;
          }
          function a(t) {
            var e = t.split('.');
            return parseInt(e[0], 10);
          }
        };
        p.prototype._initAd = function(t, e, i) {
          var n = this.player.el().querySelector('.vjs-tech');
          var r = c.getDimension(n);
          t.initAd(r.width, r.height, this.VIEW_MODE.NORMAL, -1, { AdParameters: e.adParameters || '' }, function(n) {
            i(n, t, e);
          });
        };
        p.prototype._createVASTTracker = function(t, e) {
          return new s(t, e);
        };
        p.prototype._setupEvents = function(t, e, i) {
          var n = t.options.src;
          var r = this._createVASTTracker(n, e);
          var a = this.player;
          var s = this;
          t.on('AdSkipped', function() {
            a.trigger('vpaid.AdSkipped');
            r.trackSkip();
          });
          t.on('AdImpression', function() {
            a.trigger('vpaid.AdImpression');
            r.trackImpressions();
          });
          t.on('AdStarted', function() {
            a.trigger('vpaid.AdStarted');
            r.trackCreativeView();
            u();
          });
          t.on('AdVideoStart', function() {
            a.trigger('vpaid.AdVideoStart');
            r.trackStart();
            u();
          });
          t.on('AdPlaying', function() {
            a.trigger('vpaid.AdPlaying');
            r.trackResume();
            u();
          });
          t.on('AdPaused', function() {
            a.trigger('vpaid.AdPaused');
            r.trackPause();
            l();
          });
          function u() {
            if (s._adUnit && s._adUnit.isPaused()) {
              s._adUnit._paused = false;
            }
            a.trigger('play');
          }
          function l() {
            if (s._adUnit) {
              s._adUnit._paused = true;
            }
            a.trigger('pause');
          }
          t.on('AdVideoFirstQuartile', function() {
            a.trigger('vpaid.AdVideoFirstQuartile');
            r.trackFirstQuartile();
          });
          t.on('AdVideoMidpoint', function() {
            a.trigger('vpaid.AdVideoMidpoint');
            r.trackMidpoint();
          });
          t.on('AdVideoThirdQuartile', function() {
            a.trigger('vpaid.AdVideoThirdQuartile');
            r.trackThirdQuartile();
          });
          t.on('AdVideoComplete', function() {
            a.trigger('vpaid.AdVideoComplete');
            r.trackComplete();
          });
          t.on('AdClickThru', function(i) {
            a.trigger('vpaid.AdClickThru');
            var n = i.url;
            var s = i.playerHandles;
            var u = f.isNotEmptyString(n) ? n : l(e.clickThrough);
            r.trackClick();
            if (s && u) {
              window.open(u, '_blank');
            }
            function l(e) {
              var i = { ASSETURI: t.options.src, CONTENTPLAYHEAD: 0 };
              return e ? o.parseURLMacro(e, i) : null;
            }
          });
          t.on('AdUserAcceptInvitation', function() {
            a.trigger('vpaid.AdUserAcceptInvitation');
            r.trackAcceptInvitation();
            r.trackAcceptInvitationLinear();
          });
          t.on('AdUserClose', function() {
            a.trigger('vpaid.AdUserClose');
            r.trackClose();
            r.trackCloseLinear();
          });
          t.on('AdUserMinimize', function() {
            a.trigger('vpaid.AdUserMinimize');
            r.trackCollapse();
          });
          t.on('AdError', function() {
            a.trigger('vpaid.AdError');
            r.trackErrorWithCode(901);
          });
          t.on('AdVolumeChange', function() {
            a.trigger('vpaid.AdVolumeChange');
            var e = a.volume();
            t.getAdVolume(function(t, i) {
              if (e !== i) {
                if (i === 0 && e > 0) {
                  r.trackMute();
                }
                if (i > 0 && e === 0) {
                  r.trackUnmute();
                }
                a.volume(i);
              }
            });
          });
          var d = v.bind(this, a, t, this.VIEW_MODE);
          var h = f.throttle(d, 100);
          var p = this.settings.autoResize;
          if (p) {
            c.addEventListener(window, 'resize', h);
            c.addEventListener(window, 'orientationchange', h);
          }
          a.on('vast.resize', d);
          a.on('vpaid.pauseAd', y);
          a.on('vpaid.resumeAd', g);
          a.one('vpaid.adEnd', function() {
            a.off('vast.resize', d);
            a.off('vpaid.pauseAd', y);
            a.off('vpaid.resumeAd', g);
            if (p) {
              c.removeEventListener(window, 'resize', h);
              c.removeEventListener(window, 'orientationchange', h);
            }
          });
          i(null, t, e);
          function y() {
            t.pauseAd(f.noop);
          }
          function g() {
            t.resumeAd(f.noop);
          }
        };
        p.prototype._addSkipButton = function(t, e, i) {
          var n;
          var r = this.player;
          t.on('AdSkippableStateChange', a);
          d.once(r, ['vast.adEnd', 'vast.adsCancel'], o);
          i(null, t, e);
          function a() {
            r.trigger('vpaid.AdSkippableStateChange');
            t.getAdSkippableState(function(t, e) {
              if (e) {
                if (!n) {
                  s(r);
                }
              } else {
                o(r);
              }
            });
          }
          function s(t) {
            n = u(t);
            t.el().appendChild(n);
          }
          function o() {
            c.remove(n);
            n = null;
          }
          function u() {
            var e = window.document.createElement('div');
            c.addClass(e, 'vast-skip-button');
            c.addClass(e, 'enabled');
            e.innerHTML = 'Skip ad';
            e.onclick = function(e) {
              t.skipAd(f.noop);
              if (window.Event.prototype.stopPropagation !== undefined) {
                e.stopPropagation();
              } else {
                return false;
              }
            };
            return e;
          }
        };
        p.prototype._linkPlayerControls = function(t, e, i) {
          var n = this;
          r(this.player, t);
          a(this.player, t, this.VIEW_MODE);
          i(null, t, e);
          function r(t, e) {
            t.on('volumechange', i);
            e.on('AdVolumeChange', n);
            t.one('vpaid.adEnd', function() {
              t.off('volumechange', i);
            });
            function i() {
              var i = t.muted() ? 0 : t.volume();
              e.setAdVolume(i, y);
            }
            function n() {
              t.trigger('vpaid.AdVolumeChange');
              var i = t.volume();
              e.getAdVolume(function(e, n) {
                if (e) {
                  y(e);
                } else {
                  if (i !== n) {
                    t.volume(n);
                  }
                }
              });
            }
          }
          function a(t, e, i) {
            var r = v.bind(n, t, e, i);
            t.on('fullscreenchange', r);
            t.one('vpaid.adEnd', function() {
              t.off('fullscreenchange', r);
            });
          }
        };
        p.prototype._startAd = function(t, e, i) {
          var n = this.player;
          t.startAd(function(r) {
            if (!r) {
              n.trigger('vast.adStart');
            }
            i(r, t, e);
          });
        };
        p.prototype._finishPlaying = function(t, e, i) {
          var n = this.player;
          t.on('AdStopped', function() {
            n.trigger('vpaid.AdStopped');
            a(null);
          });
          t.on('AdError', function(t) {
            var e = t ? t.message : 'on VPAIDIntegrator, error while waiting for the adUnit to finish playing';
            a(new r(e));
          });
          function a(n) {
            i(n, t, e);
          }
        };
        p.prototype._trackError = function A(t, e) {
          o.track(t.errorURLMacros, { ERRORCODE: e || 901 });
        };
        function v(t, e, i) {
          var n = t.el().querySelector('.vjs-tech');
          var r = c.getDimension(n);
          var a = t.isFullscreen() ? i.FULLSCREEN : i.NORMAL;
          e.resizeAd(r.width, r.height, a, y);
        }
        function y(t) {
          if (t) {
            h.error('ERROR: ' + t.message, t);
          }
        }
        e.exports = p;
      },
      {
        '../../utils/async': 40,
        '../../utils/consoleLogger': 41,
        '../../utils/dom': 42,
        '../../utils/mimetypes': 44,
        '../../utils/playerUtils': 45,
        '../../utils/utilityFunctions': 47,
        '../vast/VASTError': 23,
        '../vast/VASTResponse': 25,
        '../vast/VASTTracker': 26,
        '../vast/vastUtil': 30,
        './VPAIDAdUnitWrapper': 31,
      },
    ],
    35: [
      function(t, e, i) {
        'use strict';
        var n = t('../../utils/dom');
        var r = document.createElement('div');
        r.className = 'vjs-ads-label vjs-control vjs-label-hidden';
        r.innerHTML = 'Advertisement';
        var a = function(t) {
          return {
            init: function e(i, a) {
              a.el = r;
              t.call(this, i, a);
              setTimeout(function() {
                var t =
                  i.controlBar &&
                  (i.controlBar.getChild('timerControls') || i.controlBar.getChild('currentTimeDisplay'));
                if (t) {
                  i.controlBar.el().insertBefore(r, t.el());
                }
                n.removeClass(r, 'vjs-label-hidden');
              }, 0);
            },
            el: function i() {
              return r;
            },
          };
        };
        e.exports = a;
      },
      { '../../utils/dom': 42 },
    ],
    36: [
      function(t, e, i) {
        'use strict';
        var n = videojs.getComponent('Component');
        var r = t('./ads-label')(n);
        videojs.registerComponent('AdsLabel', videojs.extend(n, r));
      },
      { './ads-label': 35 },
    ],
    37: [
      function(t, e, i) {
        'use strict';
        var n = document.createElement('div');
        var r = function(t) {
          return {
            init: function e(i, r) {
              r.el = n;
              n.className = 'vjs-black-poster';
              t.call(this, i, r);
              var a = i.getChild('posterImage');
              setTimeout(function() {
                if (a && i && i.el()) {
                  i.el().insertBefore(n, a.el());
                }
              }, 0);
            },
            el: function i() {
              return n;
            },
          };
        };
        e.exports = r;
      },
      {},
    ],
    38: [
      function(t, e, i) {
        'use strict';
        var n = videojs.getComponent('Component');
        var r = t('./black-poster')(n);
        videojs.registerComponent('BlackPoster', videojs.extend(n, r));
      },
      { './black-poster': 37 },
    ],
    39: [
      function(t, e, i) {
        'use strict';
        var n = t('../ads/vast/VASTClient');
        var r = t('../ads/vast/VASTError');
        var a = t('../ads/vast/vastUtil');
        var s = t('../ads/vast/VASTIntegrator');
        var o = t('../ads/vpaid/VPAIDIntegrator');
        var u = t('../utils/async');
        var l = t('../utils/dom');
        var c = t('../utils/playerUtils');
        var d = t('../utils/utilityFunctions');
        var f = t('../utils/consoleLogger');
        e.exports = function h(t) {
          var e;
          var i = this;
          var h = new n();
          var p = false;
          var v = {
            timeout: 500,
            iosPrerollCancelTimeout: 2e3,
            adCancelTimeout: 3e3,
            playAdAlways: false,
            adsEnabled: true,
            autoResize: true,
            vpaidFlashLoaderPath: '/VPAIDFlash.swf',
            verbosity: 0,
          };
          var y = d.extend({}, v, t || {});
          if (d.isUndefined(y.adTagUrl) && d.isDefined(y.url)) {
            y.adTagUrl = y.url;
          }
          if (d.isString(y.adTagUrl)) {
            y.adTagUrl = d.echoFn(y.adTagUrl);
          }
          if (d.isDefined(y.adTagXML) && !d.isFunction(y.adTagXML)) {
            return b(new r('on VideoJS VAST plugin, the passed adTagXML option does not contain a function'));
          }
          if (!d.isDefined(y.adTagUrl) && !d.isFunction(y.adTagXML)) {
            return b(new r('on VideoJS VAST plugin, missing adTagUrl on options object'));
          }
          f.setVerbosity(y.verbosity);
          a.runFlashSupportCheck(y.vpaidFlashLoaderPath);
          c.prepareForAds(i);
          if (y.playAdAlways) {
            i.on('vast.contentEnd', function() {
              setTimeout(function() {
                i.trigger('vast.reset');
              }, 0);
            });
          }
          i.on('vast.firstPlay', g);
          i.on('vast.reset', function() {
            e = null;
            m();
          });
          i.vast = {
            isEnabled: function() {
              return y.adsEnabled;
            },
            enable: function() {
              y.adsEnabled = true;
            },
            disable: function() {
              y.adsEnabled = false;
            },
          };
          return i.vast;
          function g() {
            c.removeNativePoster(i);
            c.once(i, ['vast.adsCancel', 'vast.adEnd'], function() {
              t();
              n();
            });
            u.waterfall([s, o, h, A], function(t, e) {
              if (t) {
                b(t, e);
              } else {
                i.trigger('vast.adEnd');
              }
            });
            function t() {
              if (i.vast && i.vast.adUnit) {
                i.vast.adUnit = null;
              }
            }
            function n() {
              a();
              if (e) {
                c.restorePlayerSnapshot(i, e);
                e = null;
              }
            }
            function a() {
              c.once(i, ['playing', 'vast.reset', 'vast.firstPlay'], function(t) {
                if (t.type !== 'playing') {
                  return;
                }
                i.trigger('vast.contentStart');
                c.once(i, ['ended', 'vast.reset', 'vast.firstPlay'], function(t) {
                  if (t.type === 'ended') {
                    i.trigger('vast.contentEnd');
                  }
                });
              });
            }
            function s(t) {
              if (y.adsEnabled) {
                return t(null);
              }
              t(new r('Ads are not enabled'));
            }
            function o(t) {
              if (f()) {
                e = c.getPlayerSnapshot(i);
                i.pause();
                v();
                if (i.paused()) {
                  t(null);
                } else {
                  c.once(i, ['playing'], function() {
                    i.pause();
                    t(null);
                  });
                }
              } else {
                t(new r('video content has been playing before preroll ad'));
              }
            }
            function f() {
              return !d.isIPhone() || i.currentTime() <= y.iosPrerollCancelTimeout;
            }
            function h(t) {
              var e;
              p = false;
              e = setTimeout(function() {
                b(new r('timeout while waiting for the video to start playing', 402));
              }, y.adCancelTimeout);
              c.once(i, ['vast.adStart', 'vast.adsCancel'], n);
              function n() {
                if (e) {
                  clearTimeout(e);
                  e = null;
                }
              }
              t(null);
            }
            function v() {
              l.addClass(i.el(), 'vjs-vast-ad-loading');
              c.once(i, ['vast.adStart', 'vast.adsCancel'], g);
            }
            function g() {
              setTimeout(function() {
                l.removeClass(i.el(), 'vjs-vast-ad-loading');
              }, 100);
            }
          }
          function m() {
            i.trigger('vast.adsCancel');
            p = true;
          }
          function A(t) {
            u.waterfall([k, _], t);
          }
          function k(t) {
            h.getVASTResponse(y.adTagUrl ? y.adTagUrl() : y.adTagXML, t);
          }
          function _(t, e) {
            if (p) {
              return;
            }
            var n = w(t) ? new o(i, y) : new s(i);
            var r = false;
            c.once(i, ['vast.adStart', 'vast.adsCancel'], function(t) {
              if (t.type === 'vast.adStart') {
                a();
              }
            });
            c.once(i, ['vast.adEnd', 'vast.adsCancel'], u);
            if (d.isIDevice()) {
              l();
            }
            i.vast.vastResponse = t;
            f.debug('calling adIntegrator.playAd() with vastResponse:', t);
            i.vast.adUnit = n.playAd(t, e);
            function a() {
              if (r || i.controlBar.getChild('AdsLabel')) {
                return;
              }
              i.controlBar.addChild('AdsLabel');
            }
            function u() {
              i.controlBar.removeChild('AdsLabel');
              r = true;
            }
            function l() {
              var t = 3;
              var e = 0;
              var n = 0;
              i.on('timeupdate', a);
              i.on('ended', r);
              c.once(i, ['vast.adEnd', 'vast.adsCancel', 'vast.adError'], s);
              function r() {
                if (i.duration() - e > t) {
                  i.pause(true);
                  i.play(true);
                  i.currentTime(e);
                }
              }
              function a() {
                var r = i.currentTime();
                var a = Math.abs(r - e);
                if (a > t) {
                  n += 1;
                  if (n >= 2) {
                    i.pause(true);
                  }
                  i.currentTime(e);
                } else {
                  e = r;
                }
              }
              function s() {
                i.off('timeupdate', a);
                i.off('ended', r);
              }
            }
          }
          function b(t, e) {
            i.trigger({ type: 'vast.adError', error: t });
            m();
            f.error('AD ERROR:', t.message, t, e);
          }
          function w(t) {
            var e, i;
            var n = t.mediaFiles;
            for (e = 0, i = n.length; e < i; e++) {
              if (a.isVPAID(n[e])) {
                return true;
              }
            }
            return false;
          }
        };
      },
      {
        '../ads/vast/VASTClient': 22,
        '../ads/vast/VASTError': 23,
        '../ads/vast/VASTIntegrator': 24,
        '../ads/vast/vastUtil': 30,
        '../ads/vpaid/VPAIDIntegrator': 34,
        '../utils/async': 40,
        '../utils/consoleLogger': 41,
        '../utils/dom': 42,
        '../utils/playerUtils': 45,
        '../utils/utilityFunctions': 47,
      },
    ],
    40: [
      function(t, e, i) {
        var n = t('./utilityFunctions');
        var r = {};
        r.setImmediate = function(t) {
          setTimeout(t, 0);
        };
        r.iterator = function(t) {
          var e = function(i) {
            var n = function() {
              if (t.length) {
                t[i].apply(null, arguments);
              }
              return n.next();
            };
            n.next = function() {
              return i < t.length - 1 ? e(i + 1) : null;
            };
            return n;
          };
          return e(0);
        };
        r.waterfall = function(t, e) {
          e = e || function() {};
          if (!n.isArray(t)) {
            var i = new Error('First argument to waterfall must be an array of functions');
            return e(i);
          }
          if (!t.length) {
            return e();
          }
          var a = function(t) {
            return function(i) {
              if (i) {
                e.apply(null, arguments);
                e = function() {};
              } else {
                var n = Array.prototype.slice.call(arguments, 1);
                var s = t.next();
                if (s) {
                  n.push(a(s));
                } else {
                  n.push(e);
                }
                r.setImmediate(function() {
                  t.apply(null, n);
                });
              }
            };
          };
          a(r.iterator(t))();
        };
        r.when = function(t, e) {
          if (!n.isFunction(e)) {
            throw new Error('async.when error: missing callback argument');
          }
          var i = n.isFunction(t)
            ? t
            : function() {
                return !!t;
              };
          return function() {
            var t = n.arrayLikeObjToArray(arguments);
            var r = t.pop();
            if (i.apply(null, t)) {
              return e.apply(this, arguments);
            }
            t.unshift(null);
            return r.apply(null, t);
          };
        };
        e.exports = r;
      },
      { './utilityFunctions': 47 },
    ],
    41: [
      function(t, e, i) {
        'use strict';
        var n = 0;
        var r = '[videojs-vast-vpaid] ';
        function a(t) {
          n = t;
        }
        function s(t, e) {
          if (e.length > 0 && typeof e[0] === 'string') {
            e[0] = r + e[0];
          }
          if (t.apply) {
            t.apply(console, Array.prototype.slice.call(e));
          } else {
            t(Array.prototype.slice.call(e));
          }
        }
        function o() {
          if (n < 4) {
            return;
          }
          if (typeof console.debug === 'undefined') {
            s(console.log, arguments);
          } else {
            s(console.debug, arguments);
          }
        }
        function u() {
          if (n < 3) {
            return;
          }
          s(console.log, arguments);
        }
        function l() {
          if (n < 2) {
            return;
          }
          s(console.info, arguments);
        }
        function c() {
          if (n < 1) {
            return;
          }
          s(console.warn, arguments);
        }
        function d() {
          s(console.error, arguments);
        }
        var f = { setVerbosity: a, debug: o, log: u, info: l, warn: c, error: d };
        if (typeof console === 'undefined' || !console.log) {
          f.debug = function() {};
          f.log = function() {};
          f.info = function() {};
          f.warn = function() {};
          f.error = function() {};
        }
        e.exports = f;
      },
      {},
    ],
    42: [
      function(t, e, i) {
        'use strict';
        var n = t('./utilityFunctions');
        var r = {};
        r.isVisible = function a(t) {
          var e = window.getComputedStyle(t);
          return e.visibility !== 'hidden';
        };
        r.isHidden = function s(t) {
          var e = window.getComputedStyle(t);
          return e.display === 'none';
        };
        r.isShown = function o(t) {
          return !r.isHidden(t);
        };
        r.hide = function u(t) {
          t.__prev_style_display_ = t.style.display;
          t.style.display = 'none';
        };
        r.show = function l(t) {
          if (r.isHidden(t)) {
            t.style.display = t.__prev_style_display_;
          }
          t.__prev_style_display_ = undefined;
        };
        r.hasClass = function c(t, e) {
          var i, r, a;
          if (n.isNotEmptyString(e)) {
            if (t.classList) {
              return t.classList.contains(e);
            }
            i = n.isString(t.getAttribute('class')) ? t.getAttribute('class').split(/\s+/) : [];
            e = e || '';
            for (r = 0, a = i.length; r < a; r += 1) {
              if (i[r] === e) {
                return true;
              }
            }
          }
          return false;
        };
        r.addClass = function(t, e) {
          var i;
          if (n.isNotEmptyString(e)) {
            if (t.classList) {
              return t.classList.add(e);
            }
            i = n.isString(t.getAttribute('class')) ? t.getAttribute('class').split(/\s+/) : [];
            if (n.isString(e) && n.isNotEmptyString(e.replace(/\s+/, ''))) {
              i.push(e);
              t.setAttribute('class', i.join(' '));
            }
          }
        };
        r.removeClass = function(t, e) {
          var i;
          if (n.isNotEmptyString(e)) {
            if (t.classList) {
              return t.classList.remove(e);
            }
            i = n.isString(t.getAttribute('class')) ? t.getAttribute('class').split(/\s+/) : [];
            var r = [];
            var a, s;
            if (n.isString(e) && n.isNotEmptyString(e.replace(/\s+/, ''))) {
              for (a = 0, s = i.length; a < s; a += 1) {
                if (e !== i[a]) {
                  r.push(i[a]);
                }
              }
              t.setAttribute('class', r.join(' '));
            }
          }
        };
        r.addEventListener = function d(t, e, i) {
          if (n.isArray(t)) {
            n.forEach(t, function(t) {
              r.addEventListener(t, e, i);
            });
            return;
          }
          if (n.isArray(e)) {
            n.forEach(e, function(e) {
              r.addEventListener(t, e, i);
            });
            return;
          }
          if (t.addEventListener) {
            t.addEventListener(e, i, false);
          } else if (t.attachEvent) {
            t.attachEvent('on' + e, i);
          }
        };
        r.removeEventListener = function f(t, e, i) {
          if (n.isArray(t)) {
            n.forEach(t, function(t) {
              r.removeEventListener(t, e, i);
            });
            return;
          }
          if (n.isArray(e)) {
            n.forEach(e, function(e) {
              r.removeEventListener(t, e, i);
            });
            return;
          }
          if (t.removeEventListener) {
            t.removeEventListener(e, i, false);
          } else if (t.detachEvent) {
            t.detachEvent('on' + e, i);
          } else {
            t['on' + e] = null;
          }
        };
        r.dispatchEvent = function h(t, e) {
          if (t.dispatchEvent) {
            t.dispatchEvent(e);
          } else {
            t.fireEvent('on' + e.eventType, e);
          }
        };
        r.isDescendant = function p(t, e) {
          var i = e.parentNode;
          while (i !== null) {
            if (i === t) {
              return true;
            }
            i = i.parentNode;
          }
          return false;
        };
        r.getTextContent = function v(t) {
          return t.textContent || t.text;
        };
        r.prependChild = function y(t, e) {
          if (e.parentNode) {
            e.parentNode.removeChild(e);
          }
          return t.insertBefore(e, t.firstChild);
        };
        r.remove = function g(t) {
          if (t && t.parentNode) {
            t.parentNode.removeChild(t);
          }
        };
        r.isDomElement = function m(t) {
          return t instanceof Element;
        };
        r.click = function(t, e) {
          r.addEventListener(t, 'click', e);
        };
        r.once = function(t, e, i) {
          function n() {
            i.apply(null, arguments);
            r.removeEventListener(t, e, n);
          }
          r.addEventListener(t, e, n);
        };
        r.getDimension = function A(t) {
          var e;
          if (!n.isOldIE() && t.getBoundingClientRect) {
            e = t.getBoundingClientRect();
            return { width: e.width, height: e.height };
          }
          return { width: t.offsetWidth, height: t.offsetHeight };
        };
        e.exports = r;
      },
      { './utilityFunctions': 47 },
    ],
    43: [
      function(t, e, i) {
        'use strict';
        var n = t('./urlUtils');
        var r = t('./utilityFunctions');
        function a(t) {
          this.message = 'HttpRequest Error: ' + (t || '');
        }
        a.prototype = new Error();
        a.prototype.name = 'HttpRequest Error';
        function s(t) {
          if (!r.isFunction(t)) {
            throw new a('Missing XMLHttpRequest factory method');
          }
          this.createXhr = t;
        }
        s.prototype.run = function(t, e, i, s) {
          c(e, i, s);
          var o, u;
          var l = this.createXhr();
          s = s || {};
          o = r.isNumber(s.timeout) ? s.timeout : 0;
          l.open(t, n.urlParts(e).href, true);
          if (s.headers) {
            d(l, s.headers);
          }
          if (s.withCredentials) {
            l.withCredentials = true;
          }
          l.onload = function() {
            var t, e, n;
            if (!l.getAllResponseHeaders) {
              l.getAllResponseHeaders = function() {
                return null;
              };
            }
            if (!l.status) {
              l.status = 200;
            }
            if (r.isDefined(u)) {
              clearTimeout(u);
              u = undefined;
            }
            t = l.statusText || '';
            e = 'response' in l ? l.response : l.responseText;
            n = l.status === 1223 ? 204 : l.status;
            i(n, e, l.getAllResponseHeaders(), t);
          };
          l.onerror = f;
          l.onabort = f;
          l.send();
          if (o > 0) {
            u = setTimeout(function() {
              l && l.abort();
            }, o);
          }
          function c(t, e, i) {
            if (!r.isString(t) || r.isEmptyString(t)) {
              throw new a("Invalid url '" + t + "'");
            }
            if (!r.isFunction(e)) {
              throw new a("Invalid handler '" + e + "' for the http request");
            }
            if (r.isDefined(i) && !r.isObject(i)) {
              throw new a("Invalid options map '" + i + "'");
            }
          }
          function d(t, e) {
            r.forEach(e, function(e, i) {
              if (r.isDefined(e)) {
                t.setRequestHeader(i, e);
              }
            });
          }
          function f() {
            i(-1, null, null, '');
          }
        };
        s.prototype.get = function(t, e, i) {
          this.run('GET', t, n, i);
          function n(t, i, n, s) {
            if (r(t)) {
              e(null, i, t, n, s);
            } else {
              e(new a(s), i, t, n, s);
            }
          }
          function r(t) {
            return 200 <= t && t < 300;
          }
        };
        function o() {
          var t = new XMLHttpRequest();
          if (!('withCredentials' in t)) {
            t = new XDomainRequest();
          }
          return t;
        }
        var u = new s(o);
        e.exports = { http: u, HttpRequest: s, HttpRequestError: a, createXhr: o };
      },
      { './urlUtils': 46, './utilityFunctions': 47 },
    ],
    44: [
      function(t, e, i) {
        'use strict';
        e.exports = {
          html5: [
            'text/javascript',
            'text/javascript1.0',
            'text/javascript1.2',
            'text/javascript1.4',
            'text/jscript',
            'application/javascript',
            'application/x-javascript',
            'text/ecmascript',
            'text/ecmascript1.0',
            'text/ecmascript1.2',
            'text/ecmascript1.4',
            'text/livescript',
            'application/ecmascript',
            'application/x-ecmascript',
          ],
          flash: ['application/x-shockwave-flash'],
        };
      },
      {},
    ],
    45: [
      function(t, e, i) {
        'use strict';
        var n = t('./dom');
        var r = t('./utilityFunctions');
        var a = {};
        a.getPlayerSnapshot = function s(t) {
          var e = t.el().querySelector('.vjs-tech');
          var i = {
            ended: t.ended(),
            src: t.currentSrc(),
            currentTime: t.currentTime(),
            type: t.currentType(),
            playing: !t.paused(),
            suppressedTracks: n(t),
          };
          if (e) {
            i.nativePoster = e.poster;
            i.style = e.getAttribute('style');
          }
          return i;
          function n(t) {
            var e = t.remoteTextTracks ? t.remoteTextTracks() : [];
            if (e && r.isArray(e.tracks_)) {
              e = e.tracks_;
            }
            if (!r.isArray(e)) {
              e = [];
            }
            var i = [];
            e.forEach(function(t) {
              i.push({ track: t, mode: t.mode });
              t.mode = 'disabled';
            });
            return i;
          }
        };
        a.restorePlayerSnapshot = function o(t, e) {
          var i = t.el().querySelector('.vjs-tech');
          var n = 20;
          if (e.nativePoster) {
            i.poster = e.nativePoster;
          }
          if ('style' in e) {
            i.setAttribute('style', e.style || '');
          }
          if (s(t, e)) {
            t.one('contentloadedmetadata', o);
            t.one('canplay', u);
            r();
            t.src({ src: e.src, type: e.type });
            t.load();
          } else {
            o();
            if (e.playing) {
              t.play();
            }
          }
          function r() {
            var e = setTimeout(function() {
              t.trigger('canplay');
            }, 1e3);
            t.one('canplay', function() {
              clearTimeout(e);
            });
          }
          function s(t, e) {
            if (t.src()) {
              return t.src() !== e.src;
            }
            return t.currentSrc() !== e.src;
          }
          function o() {
            var t = e.suppressedTracks;
            t.forEach(function(t) {
              t.track.mode = t.mode;
            });
          }
          function u() {
            if (!a.isReadyToResume(t) && n--) {
              setTimeout(u, 50);
            } else {
              try {
                if (t.currentTime() !== e.currentTime) {
                  if (e.playing) {
                    t.one('seeked', function() {
                      t.play();
                    });
                  }
                  t.currentTime(e.currentTime);
                } else if (e.playing) {
                  t.play();
                }
              } catch (i) {
                videojs.log.warn('Failed to resume the content after an advertisement', i);
              }
            }
          }
        };
        a.isReadyToResume = function(t) {
          if (t.readyState() > 1) {
            return true;
          }
          if (t.seekable() === undefined) {
            return true;
          }
          if (t.seekable().length > 0) {
            return true;
          }
          return false;
        };
        a.prepareForAds = function(t) {
          var e = t.addChild('blackPoster');
          var i = true;
          var a;
          s();
          t.on('play', u);
          t.on('vast.reset', l);
          t.on('vast.firstPlay', f);
          t.on('error', p);
          t.on('vast.adStart', p);
          t.on('vast.adsCancel', p);
          t.on('vast.adError', p);
          t.on('vast.adStart', v);
          t.on('vast.adEnd', y);
          t.on('vast.adsCancel', y);
          function s() {
            var e = t.play;
            t.play = function(i) {
              var n = this;
              if (c()) {
                s();
              } else {
                u(i);
              }
              return this;
              function s() {
                if (!r.isIPhone()) {
                  a = d();
                  t.muted(true);
                }
                e.apply(n, arguments);
              }
              function u(i) {
                if (o() && !i) {
                  t.vast.adUnit.resumeAd();
                } else {
                  e.apply(n, arguments);
                }
              }
            };
            var i = t.pause;
            t.pause = function(e) {
              if (o() && !e) {
                t.vast.adUnit.pauseAd();
              } else {
                i.apply(this, arguments);
              }
              return this;
            };
            var n = t.paused;
            t.paused = function(e) {
              if (o() && !e) {
                return t.vast.adUnit.isPaused();
              }
              return n.apply(this, arguments);
            };
          }
          function o() {
            return t.vast && t.vast.adUnit;
          }
          function u() {
            if (c()) {
              i = false;
              t.trigger('vast.firstPlay');
            }
          }
          function l() {
            i = true;
            e.show();
            f();
          }
          function c() {
            return i;
          }
          function d() {
            return { muted: t.muted(), volume: t.volume() };
          }
          function f() {
            if (a) {
              t.currentTime(0);
              h(a);
              a = null;
            }
          }
          function h(e) {
            if (r.isObject(e)) {
              t.volume(e.volume);
              t.muted(e.muted);
            }
          }
          function p() {
            if (!n.hasClass(e.el(), 'vjs-hidden')) {
              e.hide();
            }
          }
          function v() {
            n.addClass(t.el(), 'vjs-ad-playing');
          }
          function y() {
            n.removeClass(t.el(), 'vjs-ad-playing');
          }
        };
        a.removeNativePoster = function(t) {
          var e = t.el().querySelector('.vjs-tech');
          if (e) {
            e.removeAttribute('poster');
          }
        };
        a.once = function u(t, e, i) {
          function n() {
            i.apply(null, arguments);
            e.forEach(function(e) {
              t.off(e, n);
            });
          }
          e.forEach(function(e) {
            t.on(e, n);
          });
        };
        e.exports = a;
      },
      { './dom': 42, './utilityFunctions': 47 },
    ],
    46: [
      function(t, e, i) {
        'use strict';
        var n = t('./utilityFunctions');
        var r = document.createElement('a');
        var a = document.documentMode;
        function s(t) {
          var e = t;
          if (a) {
            r.setAttribute('href', e);
            e = r.href;
          }
          r.setAttribute('href', e);
          return {
            href: r.href,
            protocol: r.protocol ? r.protocol.replace(/:$/, '') : '',
            host: r.host,
            search: r.search ? r.search.replace(/^\?/, '') : '',
            hash: r.hash ? r.hash.replace(/^#/, '') : '',
            hostname: r.hostname,
            port: n.isNotEmptyString(r.port) ? r.port : 80,
            pathname: r.pathname.charAt(0) === '/' ? r.pathname : '/' + r.pathname,
          };
        }
        function o(t, e) {
          var i, r;
          e = n.isFunction(e)
            ? e
            : function() {
                return true;
              };
          t = t.trim().replace(/^\?/, '');
          i = t.split('&');
          r = {};
          n.forEach(i, function(t) {
            var i, n, a;
            if (t !== '') {
              i = t.split('=');
              n = i[0];
              a = i[1];
              if (e(n, a)) {
                r[n] = a;
              }
            }
          });
          return r;
        }
        function u(t) {
          var e = [];
          n.forEach(t, function(t, i) {
            e.push(i + '=' + t);
          });
          return e.join('&');
        }
        e.exports = { urlParts: s, queryStringToObj: o, objToQueryString: u };
      },
      { './utilityFunctions': 47 },
    ],
    47: [
      function(t, e, i) {
        'use strict';
        var n = 1;
        var r = /[A-Z]/g;
        var a = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
        var s = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
        function o() {}
        function u(t) {
          return t === null;
        }
        function l(t) {
          return t !== undefined;
        }
        function c(t) {
          return t === undefined;
        }
        function d(t) {
          return typeof t === 'object';
        }
        function f(t) {
          return typeof t === 'function';
        }
        function h(t) {
          return typeof t === 'number';
        }
        function p(t) {
          return j.isObject(t) && t.window === t;
        }
        function v(t) {
          return Object.prototype.toString.call(t) === '[object Array]';
        }
        function y(t) {
          if (t === null || j.isWindow(t) || j.isFunction(t) || j.isUndefined(t)) {
            return false;
          }
          var e = t.length;
          if (t.nodeType === n && e) {
            return true;
          }
          return j.isString(t) || j.isArray(t) || e === 0 || (typeof e === 'number' && e > 0 && e - 1 in t);
        }
        function g(t) {
          return typeof t === 'string';
        }
        function m(t) {
          return j.isString(t) && t.length === 0;
        }
        function A(t) {
          return j.isString(t) && t.length !== 0;
        }
        function k(t) {
          return Array.prototype.slice.call(t);
        }
        function _(t, e, i) {
          var n, r;
          if (t) {
            if (f(t)) {
              for (n in t) {
                if (n !== 'prototype' && n !== 'length' && n !== 'name' && (!t.hasOwnProperty || t.hasOwnProperty(n))) {
                  e.call(i, t[n], n, t);
                }
              }
            } else if (v(t)) {
              var a = typeof t !== 'object';
              for (n = 0, r = t.length; n < r; n++) {
                if (a || n in t) {
                  e.call(i, t[n], n, t);
                }
              }
            } else if (t.forEach && t.forEach !== _) {
              t.forEach(e, i, t);
            } else {
              for (n in t) {
                if (t.hasOwnProperty(n)) {
                  e.call(i, t[n], n, t);
                }
              }
            }
          }
          return t;
        }
        function b(t, e) {
          e = e || '_';
          return t.replace(r, function(t, i) {
            return (i ? e : '') + t.toLowerCase();
          });
        }
        function w(t) {
          if (!j.isString(t)) {
            return false;
          }
          return a.test(t.trim());
        }
        function T(t) {
          var e, i, n;
          for (i = 1; i < arguments.length; i++) {
            e = arguments[i];
            for (n in e) {
              if (e.hasOwnProperty(n)) {
                if (d(t[n]) && !u(t[n]) && d(e[n])) {
                  t[n] = T({}, t[n], e[n]);
                } else {
                  t[n] = e[n];
                }
              }
            }
          }
          return t;
        }
        function E(t) {
          return t.charAt(0).toUpperCase() + t.slice(1);
        }
        function S(t) {
          return t.charAt(0).toLowerCase() + t.slice(1);
        }
        function V(t, e) {
          var i = [];
          t.forEach(function(t, n) {
            var r = e(t, n);
            if (j.isDefined(r)) {
              i.push(r);
            }
          });
          return i;
        }
        function C(t, e) {
          var i = t + '';
          e = j.isNumber(e) ? e : 0;
          t = j.isNumber(t) ? t : parseInt(t, 10);
          if (j.isNumber(t) && !isNaN(t)) {
            i = t + '';
            while (i.length < e) {
              i = '0' + i;
            }
            return i;
          }
          return NaN + '';
        }
        function I(t, e) {
          var i = new Date().getTime() - (e + 1);
          return function() {
            var n = new Date().getTime();
            if (n - i >= e) {
              i = n;
              t.apply(this, arguments);
            }
          };
        }
        function F(t, e) {
          var i;
          return function() {
            if (i) {
              clearTimeout(i);
            }
            i = setTimeout(function() {
              t.apply(this, arguments);
              i = undefined;
            }, e);
          };
        }
        function L(t, e, i) {
          var n = e(t);
          for (var r = 0; r < n.length; r++) {
            if (i(n[r])) {
              return n[r];
            } else {
              var a = L(n[r], e, i);
              if (a) {
                return a;
              }
            }
          }
        }
        function U(t) {
          return function() {
            return t;
          };
        }
        function P(t) {
          if (j.isNumber(t)) {
            t = t + '';
          }
          if (!j.isString(t)) {
            return false;
          }
          return s.test(t.trim());
        }
        function D() {
          var t = j.getInternetExplorerVersion(navigator);
          if (t === -1) {
            return false;
          }
          return t < 10;
        }
        function x(t) {
          var e = -1;
          if (t.appName == 'Microsoft Internet Explorer') {
            var i = t.userAgent;
            var n = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
            var r = n.exec(i);
            if (r !== null) {
              e = parseFloat(r[1]);
            }
          }
          return e;
        }
        function M() {
          return /iP(hone|ad)/.test(j._UA);
        }
        function R() {
          return /iP(hone|ad|od)|Android|Windows Phone/.test(j._UA);
        }
        function O() {
          return /iP(hone|od)/.test(j._UA);
        }
        function N() {
          return /Android/.test(j._UA);
        }
        var j = {
          _UA: navigator.userAgent,
          noop: o,
          isNull: u,
          isDefined: l,
          isUndefined: c,
          isObject: d,
          isFunction: f,
          isNumber: h,
          isWindow: p,
          isArray: v,
          isArrayLike: y,
          isString: g,
          isEmptyString: m,
          isNotEmptyString: A,
          arrayLikeObjToArray: k,
          forEach: _,
          snake_case: b,
          isValidEmail: w,
          extend: T,
          capitalize: E,
          decapitalize: S,
          transformArray: V,
          toFixedDigits: C,
          throttle: I,
          debounce: F,
          treeSearch: L,
          echoFn: U,
          isISO8601: P,
          isOldIE: D,
          getInternetExplorerVersion: x,
          isIDevice: M,
          isMobile: R,
          isIPhone: O,
          isAndroid: N,
        };
        e.exports = j;
      },
      {},
    ],
    48: [
      function(t, e, i) {
        'use strict';
        var n = t('./utilityFunctions');
        var r = {};
        r.strToXMLDoc = function a(t) {
          if (typeof window.DOMParser === 'undefined') {
            var e = new ActiveXObject('Microsoft.XMLDOM');
            e.async = false;
            e.loadXML(t);
            return e;
          }
          return i(t);
          function i(t) {
            var e = new DOMParser();
            var i;
            try {
              i = e.parseFromString(t, 'application/xml');
              if (r(i) || n.isEmptyString(t)) {
                throw new Error();
              }
            } catch (a) {
              throw new Error("xml.strToXMLDOC: Error parsing the string: '" + t + "'");
            }
            return i;
          }
          function r(t) {
            try {
              var e = new DOMParser(),
                i = e.parseFromString('INVALID', 'text/xml'),
                n = i.getElementsByTagName('parsererror')[0].namespaceURI;
              if (n === 'http://www.w3.org/1999/xhtml') {
                return t.getElementsByTagName('parsererror').length > 0;
              }
              return t.getElementsByTagNameNS(n, 'parsererror').length > 0;
            } catch (r) {}
          }
        };
        r.parseText = function s(t) {
          if (/^\s*$/.test(t)) {
            return null;
          }
          if (/^(?:true|false)$/i.test(t)) {
            return t.toLowerCase() === 'true';
          }
          if (isFinite(t)) {
            return parseFloat(t);
          }
          if (n.isISO8601(t)) {
            return new Date(t);
          }
          return t.trim();
        };
        r.JXONTree = function o(t) {
          var e = r.parseText;
          if (t.documentElement) {
            return new r.JXONTree(t.documentElement);
          }
          if (t.hasChildNodes()) {
            var i = '';
            for (var a, s, o, u = 0; u < t.childNodes.length; u++) {
              a = t.childNodes.item(u);
              if (((a.nodeType - 1) | 1) === 3) {
                i += a.nodeType === 3 ? a.nodeValue.trim() : a.nodeValue;
              } else if (a.nodeType === 1 && !a.prefix) {
                s = n.decapitalize(a.nodeName);
                o = new r.JXONTree(a);
                if (this.hasOwnProperty(s)) {
                  if (this[s].constructor !== Array) {
                    this[s] = [this[s]];
                  }
                  this[s].push(o);
                } else {
                  this[s] = o;
                }
              }
            }
            if (i) {
              this.keyValue = e(i);
            }
          }
          var l = typeof t.hasAttributes === 'undefined' ? t.attributes.length > 0 : t.hasAttributes();
          if (l) {
            var c;
            for (var d = 0; d < t.attributes.length; d++) {
              c = t.attributes.item(d);
              this['@' + n.decapitalize(c.name)] = e(c.value.trim());
            }
          }
        };
        r.JXONTree.prototype.attr = function(t) {
          return this['@' + n.decapitalize(t)];
        };
        r.toJXONTree = function u(t) {
          var e = r.strToXMLDoc(t);
          return new r.JXONTree(e);
        };
        r.keyValue = function l(t) {
          if (t) {
            return t.keyValue;
          }
          return undefined;
        };
        r.attr = function c(t, e) {
          if (t) {
            return t['@' + n.decapitalize(e)];
          }
          return undefined;
        };
        r.encode = function d(t) {
          if (!n.isString(t)) return undefined;
          return t
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        };
        r.decode = function f(t) {
          if (!n.isString(t)) return undefined;
          return t
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
        };
        e.exports = r;
      },
      { './utilityFunctions': 47 },
    ],
    49: [
      function(t, e, i) {
        'use strict';
        t('./plugin/components/ads-label_5');
        t('./plugin/components/black-poster_5');
        var n = t('./plugin/videojs.vast.vpaid');
        videojs.plugin('vastClient', n);
      },
      {
        './plugin/components/ads-label_5': 36,
        './plugin/components/black-poster_5': 38,
        './plugin/videojs.vast.vpaid': 39,
      },
    ],
  },
  {},
  [49]
);
//# sourceMappingURL=videojs_5.vast.vpaid.min.js.map
/* eslint-enable */
