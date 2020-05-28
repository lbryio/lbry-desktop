/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

void function() {
  'use strict';

  /**
   * @return Test object useful for the polyfill, as objects are sealed after creation.
   */
  function buildObject() {
    return {
      name: 'I\'m a test',
      value: 123,
      sub: {name: 'sub'},
    };
  }

  function suiteFor(impl, name) {
    suite(name, function() {
      test('get', function() {
        var testObj = buildObject();
        var gets = [];
        var p = new impl(testObj, {get: function(obj, prop) {
          gets.push(prop);
          return obj[prop];
        }});

        p.name;
        p.sub;
        p.sub.name;
        var s = p.sub;
        s.name; // not a get

        assert.deepEqual(gets, 'name sub sub sub'.split(/\s+/));
      });

      test('set', function() {
        var testObj = buildObject();
        var sets = [];
        var p = new impl(testObj, {set: function(obj, prop) {
          sets.push(prop);
          return true;
        }});

        p.value += 1;
        p.sub = 45;

        assert.isNotNumber(p.sub, 'setter should not actually set');
        assert.deepEqual(sets, 'value sub'.split(/\s+/));
      });

      test('proxy chain', function() {
        var object = {value: 123};
        var p = new impl(object, {});
        var pp = new impl(p, {get: function(obj, prop) {
          return obj[prop];
        }});
        var ppp = new impl(pp, {});

        assert.equal(ppp.value, 123);
      })

      test('callable', function() {
        var calls = 0;
        var callable = function() {
          return ++calls;
        };

        var p = new impl(callable, {});
        assert.equal(1, p());
        assert.equal(2, callable());
        assert.equal(3, p());
      });

      // test wrapping a constructor without proxying it
      test('wrap constructor', function() {
        var fn = function(y) {
          this.x = 1;
        };
        fn.prototype.sentinel = true;

        var p = new impl(fn, {});
        var obj = new p();
        assert(obj.sentinel, 'prototype not configured correctly');
      });

      test('construct/apply assertions', function() {
        var pc = new impl({}, {construct: function(target, argumentsList) {
          assert(false, 'should not get here');
        }});
        assert.throws(function() {
          pc();
        }, TypeError);
        var pa = new impl({}, {apply: function(target, argumentsList) {
          assert(false, 'should not get here');
        }});
        assert.throws(function() {
          new pa();
        }, TypeError);
      });

      test('construct', function() {
        var fn = function(y) {
          var me = this || {};  // this won't be set in strict mode, fake it
          me.x = (y || 0);
          return me;
        };
        fn.prototype.sentinel = true;

        var p = new impl(fn, {construct: function(target, argumentsList) {
          return new target((argumentsList[0] || 0) + 10);
        }});

        var obj = new p(5);
        assert.equal(obj.x, 15);
        assert(obj.sentinel);

        var funcObj = p(5);
        assert.equal(funcObj.x, 5);
        assert(!funcObj.sentinel, 'apply use should not contain sentinel');
      });

      test('proxy without construct handler passes arguments', function() {
        var cls = function(x, y) {
          assert(this instanceof cls, 'cls prototype is not set correctly');
          this.x = x;
          this.y = y;
        };

        var p = new impl(cls, {});
        var x = new p(1, 2);
        assert.equal(x.x, 1);
        assert.equal(x.y, 2);
      });

      test('apply on non-function', function() {
        var object = {};

        var dummy = new impl(object, {});
        assert.isNotFunction(dummy, 'stock proxy is not function');
        assert.throws(function() {
          dummy();
        }, TypeError);

        var p = new impl(object, {apply: function() {
          // doesn't matter
        }});
        assert.doesNotThrow(function() {
          // TODO(samthor): Firefox errors on this in native!
          // It expects the proxied object to actually be a function, unlike Chrome.
          p();
        });
      });

      test('traps function', function() {
        var real = function(x, y) {
          return 1;
        };
        var p = new impl(real, function(x, y) {
          assert.equal(this, real);
          assert.equal(this(), 1);
          assert.equal(x, undefined);  // arguments aren't passed
          assert.equal(y, undefined);
          return 2;
        });
        assert.equal(p(3, 4), 2);
      });

      test('revocable proxy', function() {
        var p = impl.revocable({a: 1}, {});
        p.proxy.a = 2;

        p.revoke();
        assert.throws(function() {
          p.proxy.a = 3;
        }, TypeError);

        var calls = 0;
        p = impl.revocable({b: 2}, {get: function(obj, prop) {
          ++calls;
          return obj[prop];
        }});
        p.proxy.b;
        p.proxy.b;

        p.revoke();
        assert.throws(function() {
          p.proxy.b;
        }, TypeError);
        assert.equal(calls, 2);

        var fn = function() {
          assert(false, 'should never get here');
        };
        p = impl.revocable(fn, {apply: function() {
          // doesn't matter
        }});
        p.revoke();
        assert.throws(function() {
          p.proxy();
        }, TypeError);
      });

      test('proxy instance of class', function() {
        var cls = function() {
          this.y = 1;
        };
        cls.prototype.x = function() {
          ++this.y;
        };

        var inst = new cls();
        var p = new impl(inst, {});
        assert('x' in inst, 'inst should have function');
        assert('x' in p, 'proxy should have function');
        p.x();
        assert.equal(p.y, 2);
      });

      test('trap instance methods', function() {
        var cls = function() {
          this.y = 1;
        };
        cls.prototype.x = function() {};

        var inst = new cls();
        var found;
        var p = new impl(inst, {get: function(obj, prop) {
          assert.equal(obj, inst);
          found = prop;
          return obj[prop];
        }});

        p.x();
        assert.equal(found, 'x', 'expected get of function');

        // Confirm set method behavior, proxy vs polyfill.
        var custom = function() { this.y = 2; };
        var supportSet = true;
        try {
          inst.x = custom;
        } catch (e) {
          supportSet = false;
        }
        p.x();
        if (supportSet) {  // native
          assert.equal(inst.x, custom);
          assert.equal(p.y, 2);
        } else {  // polyfill
          assert.equal(p.y, 1);
        }
      });
    });
  }

  suiteFor(window.Proxy, 'polyfill');
  if (window.NativeProxy) {
    suiteFor(window.NativeProxy, 'native');
  }

  suite('general polyfill', function() {
    test('seals object', function() {
      var testObj = buildObject();
      assert.isNotSealed(testObj);
      var p = new Proxy(testObj, {});
      assert.isSealed(testObj);
      assert.isSealed(p, 'proxy should also be sealed');

      new Proxy(testObj, {});
      assert.isSealed(testObj);

      var pp = new Proxy(p, {});
      assert.isSealed(p);

      assert.throws(function() {
        pp.newProperty = true;
      }, TypeError);
    });

    test('seals array', function() {
      var testArray = [7,8,9];
      assert.isNotSealed(testArray);
      var p = new Proxy(testArray, {});
      assert.isSealed(testArray);
      assert.isSealed(p, 'proxy should also be sealed');
      assert.throws(function() {
        p.push(1);
      }, TypeError);

      // slice is a copy of array
      var slice = testArray.slice(0, 1);
      slice.push(2);
      assert.equal(slice.length, 2);
    });

    // nb. Trying to resolve issue #12
    test('array as property', function() {
      var testObj = {arr: [1,2,3]};
      var p = new Proxy(testObj, {get: function(obj, prop) {
        return obj[prop];  // zero get handler
      }});

      assert.equal(p.arr.length, 3);
      p.arr.push(4);
      assert.equal(p.arr.length, 4);

      p.arr.splice(0,2);
      assert.equal(p.arr.length, 2);
    });
  });

}();
