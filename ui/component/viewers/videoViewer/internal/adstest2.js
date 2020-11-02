if (void 0 === asHasRun)
  var asHasRun = !0,
    adspruce = (function() {
      function n() {
        return new Date().getTime();
      }
      function i(n) {
        return c(n) ? n[0].toUpperCase() + n.slice(1) : n;
      }
      function t() {
        z([Cr[la], Cr[Gh], Cr[Yh], Cr[El]]);
      }
      function e(n) {
        return void 0 === n;
      }
      function r(n) {
        return null == n;
      }
      function f(n) {
        return 'function' == typeof n;
      }
      function o(n) {
        return 'object' == typeof n;
      }
      function c(n) {
        return 'string' == typeof n;
      }
      function a(n) {
        return 'boolean' == typeof n;
      }
      function u(n) {
        return isNaN(n);
      }
      function s(n) {
        return 'number' == typeof n && !u(n);
      }
      function d(n) {
        return Array.isArray ? Array.isArray(n) : n instanceof Array;
      }
      function v(n, i) {
        return String(n)[ab](i);
      }
      function l(n, i) {
        d(i) || (i = [i]);
        for (var t = 0; t < i[rs]; t++) if (-1 !== v(n, i[t])) return !0;
        return !1;
      }
      function p(n) {
        return s(n) ? Wu[pd](n) : b(n);
      }
      function b(n) {
        return parseInt(n);
      }
      function m(n) {
        return parseFloat(n);
      }
      function g(n) {
        return !!n;
      }
      function h(n) {
        return encodeURIComponent(n);
      }
      function w(n) {
        return decodeURIComponent(n);
      }
      function y(n, i) {
        return (e(i) ? qu : i)[Oo](n);
      }
      function A(n, i) {
        return (e(i) ? qu : i)[Fo](n);
      }
      function k(n, i) {
        return (e(i) ? qu : i)[Mo](n);
      }
      function x(n, i) {
        return n[Ho](i);
      }
      function _(n, i, t) {
        (t = e(t) ? i : t), n[zo](i, t);
      }
      function E(n, i) {
        return n[Go](i);
      }
      function T(n) {
        n[Po] && n[Po][Co](n);
      }
      function I(n) {
        if (c(n)) {
          var i = v(n, '//');
          return (0 === i || 5 === i || 6 === i) && l(n, Hs);
        }
      }
      function S(n) {
        return null !== n[Ps](/(?=.*top=)(?=.*left=)(?=.*height=)(?=.*width=)/gi);
      }
      function B(n, i) {
        if (!l(n, Gs) || !l(n, i)) return !1;
        n = n[Rs](v(n, Gs));
        for (var t = n[bs](Ws), e = 0; e < t[rs]; e++) if (l(t[e], i) && l(t[e], zs)) return t[e][bs](zs)[1];
      }
      function R(n) {
        return qu[Xo](n);
      }
      function C() {
        return 'android' === jr;
      }
      function P() {
        return 'bb' === jr;
      }
      function U() {
        return 'index' === jr;
      }
      function j() {
        return 'ios' === jr;
      }
      function V() {
        return 'proxy' === jr;
      }
      function L() {
        return 's60' === jr;
      }
      function N() {
        return 'win' === jr;
      }
      function D() {
        return m(Fr[ey]);
      }
      function O() {
        return P() && l(es, 'BB10');
      }
      function F() {
        return P() && l(es, 'Version 6.0');
      }
      function q() {
        return N() && l(es, '8.0');
      }
      function K() {
        return C() && (l(es, 'Android 4.0') || l(es, 'Android 4.1'));
      }
      function M(n, i) {
        return -1 !== n[ab](i);
      }
      function z(n) {
        d(n) || (n = [n]);
        for (var i = 0; i < n[rs]; i++) c(n[i]) && (new Image()[us] = n[i]);
      }
      function H(n, i) {
        return c(n) && c(i) ? n + (l(n, Gs) ? Ws + i : Gs + i) : n + i;
      }
      function G(n, i, t) {
        if (d(n) && n[rs] < i) for (var e = n[rs]; e < i; e++) n[ds](t);
        return n;
      }
      function W(n, i, t, r) {
        function f(n) {
          return (n = e(n) ? 0 : n), d(n) ? n : [n];
        }
        var o;
        if (
          ((n = f(n)),
          (i = f(i)),
          (t = f(t)),
          (r = f(r)),
          (n = G(n, i[rs], n[0])),
          (i = G(i, n[rs], i[0])),
          (t = G(t, i[rs], t[0])),
          (r = G(r, n[rs], 0)),
          r[rs] < n[rs])
        ) {
          var c = n[rs] - r[rs];
          for (o = 0; o < c; o++) r[ds](0);
        }
        for (o = 0; o < n[rs]; o++)
          e(n[o][dp]) && (n[o] = n[o][up]),
            r[o] ? b(n[o][i[o]]) !== t[o] && (n[o][i[o]] = t[o] + Os) : n[o][i[o]] !== t[o] && (n[o][i[o]] = t[o]);
      }
      function X(n, i) {
        i[Rs](-1) !== qs && (i += qs), (n[up][dp] += i);
      }
      function Y(n, i) {
        n[up][dp] = i;
      }
      function J(n, i) {
        if (e(n) || !d(n) || n[rs] % 2 != 0) return '';
        for (var t, r = 0, f = ''; r < n[rs]; r++) (t = r % 2 == 0 ? Fs : qs), (f += n[r]), f[Rs](-1) !== t && (f += t);
        return f + (e(i) ? '' : i);
      }
      function $(n) {
        if (e(n) || !d(n) || n[rs] % 2 != 0) return '';
        for (var i = 0, t = ''; i < n[rs]; i++) i % 2 == 0 ? ('' !== t && (t += Ws), (t += n[i] + zs)) : (t += n[i]);
        return t;
      }
      function Q(n) {
        e(n) || W(n, kp, _p);
      }
      function Z(n) {
        e(n) || W(n, kp, xp);
      }
      function nn(n) {
        e(n) || W(n, gp, hp);
      }
      function tn(n) {
        e(n) || W(n, gp, wp);
      }
      function en(n, i) {
        e(n) || W(n, Yp, i === _p ? _p : rn(i));
      }
      function rn(n) {
        return tw + n + ew;
      }
      function fn(n, i) {
        for (var t = 0; t < i[rs]; t++) delete n[i[t]];
        return n;
      }
      function on(n) {
        var i, t;
        return (
          (i = n[bs](Hs)),
          (t = i[rs]),
          n[Ps](/\.[a-z]{2,3}\.[a-z]{2}$/i)
            ? i[t - 3] + Hs + i[t - 2] + Hs + i[t - 1]
            : n[Ps](/\.[a-z]{2,14}$/i)
            ? i[t - 2] + Hs + i[t - 1]
            : n
        );
      }
      function cn(n) {
        return e(n) || '' === n ? '' : JSON[hs](n);
      }
      function an(n) {
        return o(n) ? JSON[_s + 'ify'](n) : '';
      }
      function un(n, i) {
        return setTimeout(n, i);
      }
      function sn(n, i) {
        return setInterval(n, i);
      }
      function dn(n) {
        clearInterval(n);
      }
      function vn(n) {
        return c(n) ? n[Bs]()[Cs](' ', '_') : '';
      }
      function ln(n) {
        return c(n) ? n[Cs](/\r\n|\r|\n/g, '')[Cs](/^\s+|\s+$/g, '') : n;
      }
      function pn(n, i) {
        return k(i, n)[rs] > 0;
      }
      function bn(n) {
        return !o || e(n) ? [] : Object.keys(n);
      }
      function mn(n) {
        var i,
          t = {};
        if (n == jf) return jf;
        for (var u in n)
          n.hasOwnProperty(u) &&
            ((i = n[u]),
            c(i) || s(i) || a(i) || f(i)
              ? (t[u] = i)
              : d(i)
              ? (t[u] = hn(i))
              : o(i) && !r(i) && (e(i[So]) ? (bn(i)[rs] ? (t[u] = mn(i)) : (t[u] = {})) : (t[u] = i)));
        return t;
      }
      function gn(n, i) {
        if (!e(n) && !e(i)) {
          for (var t in i) n[t] = i[t];
          return n;
        }
      }
      function hn(n) {
        for (var i = [], t = 0; t < n[rs]; t++) i[t] = n[vs](t, t + 1)[0];
        return i;
      }
      function wn(n, i) {
        if (d(n) && 3 === n[rs]) {
          i = e(i) ? qu : i;
          var t = qu[Wo + js](js);
          t[Ep + js](n[0], n[1], n[2]), i[Fv + js](t);
        }
      }
      function yn(n) {
        var i,
          t,
          e,
          r = n[rs];
        if (r < 2) return n;
        for (i = r + 1; i--; ) (t = ~~(Wu[bv]() * i)), (e = n[t]), (n[t] = n[0]), (n[0] = e);
        return n;
      }
      function An(n, i) {
        if (!d(n) || !o(i) || n[rs] < 2) return n;
        for (var t, e = [], r = [], f = []; n[rs] > 0; )
          (t = n[ms]()), i[t] ? r[ds](t) : 0 !== r[rs] ? f[ds](t) : e[ds](t);
        return (r = yn(r)), e[wl](r, f);
      }
      function kn(n) {
        if (c(n)) {
          var i = n[Ps](/^\d+|\d+\b|\d+(?=\w)/g);
          return !r(i) && i[rs] ? i[0] : bf;
        }
      }
      function xn() {
        var n = v(es, j() ? 'CriOS/' : 'Chrome/');
        return n < 0 ? void 0 : +es[Rs](n + (j() ? 6 : 7), n + (j() ? 8 : 9));
      }
      function _n(n) {
        (n = n || Hu[Us]), n[Ds]();
      }
      function En() {
        var n = fu + wv;
        try {
          return Hu[Zv][so + nl](n, n), Hu[Zv][Ro + nl](n), 1;
        } catch (i) {}
      }
      function Tn(n, i) {
        if (Sr) {
          var t = Hu[Zv][vo + nl](n);
          if (null !== t) {
            if (i)
              try {
                t = cn(t);
              } catch (e) {
                return void Sn(n);
              }
            return t;
          }
        }
      }
      function In(n, i, t) {
        Sr && Hu[Zv][so + nl](n, t ? an(i) : i);
      }
      function Sn(n) {
        Sr && Hu[Zv][Ro + nl](n);
      }
      function Bn(n, i, t, r, o, a, u) {
        if (
          (e(a) && (a = 0),
          e(o) && (o = n[up][i]),
          s(t) || isNaN(m(t)) || (t = m(t)),
          c(o) && (l(o, Os) && (a = 1), (o = m(o))),
          m(o) === m(t))
        )
          return void (f(u) && u());
        (o += r),
          ((o >= t && r > 0) || (o <= t && r < 0)) && (o = t),
          (n[up][i] = a ? o + Os : o),
          Rn(function() {
            Bn(n, i, t, r, o, a, u);
          });
      }
      function Rn(n) {
        Hu[vw]
          ? Hu[vw](n)
          : Hu[Al + lw]
          ? Hu[Al + lw](n)
          : Hu[kl + lw]
          ? Hu[kl + lw](n)
          : Hu[xl + lw]
          ? Hu[xl + lw](n)
          : un(n, 16);
      }
      function Cn(n, i, t, e, r, f, o) {
        Rn(function() {
          Bn(n, i, t, e, r, f, o);
        });
      }
      function Pn() {
        return (
          (!d(Pr) || Pr[rs] < 1) &&
            (Pr = [
              {
                i: '00001',
                v: '//vod.adspruce.com/video/vod/00014.mp4',
                l: '//vod.adspruce.com/assets/vod/00014-lvb.jpg',
                f: '//vod.adspruce.com/assets/vod/00014-fpt.jpg',
                t: 'Is Will Smith becoming a YouTuber?',
                d: '62',
                k: 'Will Smith,YouTube,Vlogging,Motivational,Bungee Jump',
              },
            ]),
          (Pr = yn(Pr)),
          Pr[rs] > 1 ? Pr[ms]() : Pr[0]
        );
      }
      function Un(n) {
        (Pr = cn(n)), T(y(ec + Ms + wu));
      }
      function jn() {
        Ln('//vod' + sw + '/sdktest/vod/list.js', ec + Ms + wu);
      }
      function Vn(n) {
        if (j() && !Yn()) {
          var i = R(up);
          _(i, Il), (i[fs] = fb), n[ho](i);
        }
      }
      function Ln(n, i, t) {
        var r = R(Zf);
        return _(r, Ov), (r[us] = n), e(i) || (r[No] = i), e(t) || (r[gy] = t), zu[ho](r), r;
      }
      function Nn(n, i, t) {
        var r = new XMLHttpRequest();
        (r[my] = i), e(t) || (r[gy] = t), r[_l]('GET', n, !0), r[ys]();
      }
      function Dn(n) {
        return e(n) ? '' : n[aw][hl]();
      }
      function On() {
        zu[Ll] > zu[Lp] - Hu[jp] - 20 ? Hu[Vl](0, zu[Ll] - 20) : Hu[Vl](0, zu[Ll] + 20);
      }
      function Fn() {
        !1 === ff[sh + $h] && ((jf.fcs = !1), Hu[dd](rd, zn, !1));
      }
      function qn(i) {
        i[Ac] === Rc || i[sh + $h] || ((jf.bft = n() / Nb), (jf.bfc = !1), Hu[dd](rd, Mn, !1));
      }
      function Kn() {
        (jf.ast = !1),
          C()
            ? ((jf.ast = l(es, 'Safari') && l(es, 'Version') && !l(es, 'OPR/')),
              (jf.ast = !0 === jf.ast && l(es, 'Android 2') ? 2 : jf.ast))
            : (jf.ast = null);
      }
      function Mn() {
        zn(!0);
      }
      function zn(n) {
        (n = !e(n) && n !== Hu[Us] && n),
          (Ny = jf[!1 === n ? 'vi' : 'bvi'][os]),
          jf.ast ? Hn(n) : Gn(n),
          (jf.bfc = !0),
          !1 !== n ? Hu[vd](rd, Mn, !1) : Hu[vd](rd, zn, !1);
      }
      function Hn(i, t) {
        if (!l(es, 'Android 4.0') && C()) {
          var r, f, o, c, a, u;
          if (!(Ly > 4)) {
            if ((Ly++, (i = !e(i) && i), (t = !e(t) && t), (f = !1 === i ? jf.vi : jf.bvi), (Ny = 0), !1 !== i)) {
              if (((o = Df[i]), e(o))) return;
              (c = o[xc][Ac]), c === Rc ? (f = o[Sw][$f]) : c === Ec ? (f = o[$f]) : c === Tc && (f = o[sy]);
            } else t && (f = jf.fvi);
            (r = f[us]),
              l(r, 'ascb')
                ? ((a = v(r, 'ascb')), (u = n()[Is]()), (r = r[Cs](r[Rs](a, 5 + u[rs]), 'ascb=' + u)))
                : (r = H(r, 'ascb=' + n())),
              (f[us] = r),
              f[qa](),
              jf.ast && (f[Xg](), Gn(i, t));
          }
        }
      }
      function Gn(n, i) {
        var t, r, f, o;
        if (((n = !e(n) && n), (i = !e(i) && i), (t = !1 === n ? jf.vi : jf.bvi), !1 !== n)) {
          if (((r = Df[n]), e(r))) return;
          (f = r[xc]), (o = f[Ac]), o === Rc ? ((t = r[Sw][$f]), (t[os] = f[pa])) : o === Ec && (t = r[$f]);
        } else i && (t = jf.fvi);
        (Ny = t[os]),
          dn(Vy),
          (Vy = sn(function() {
            t[Jg] && jf.bfc ? (t[qg](), On(), Gn(n, i)) : (t[os] > Ny || u(Ny)) && (dn(Vy), On());
          }, gb));
      }
      function Wn(n) {
        O() && !1 === ff[sh + $h] && n[Xg]();
      }
      function Xn(n, i) {
        O() && !i[sh + $h] && n[Xg]();
      }
      function Yn() {
        return j() && !l(es, 'iPhone') && !l(es, 'iPod');
      }
      function Jn() {
        return (
          (j() && l(es, '8_')) ||
          l(es, '9_') ||
          l(es, '10_') ||
          l(es, '11_') ||
          l(es, '12_') ||
          l(es, '13_') ||
          l(es, '14_')
        );
      }
      function $n() {
        return (j() && l(es, '10_')) || l(es, '11_') || l(es, '12_') || l(es, '13_') || l(es, '14_');
      }
      function Qn(n) {
        if (!0 !== n[Jg] && (n[Xg](), Yn()))
          if (Jn()) {
            var i = function() {
              n[qg](), Hu[vd](rd, i);
            };
            Hu[dd](rd, i);
          } else
            un(function() {
              n[Xg](), n[qg]();
            }, Nb);
      }
      function Zn(n) {
        if (((n = n || window.event), l(n[bl], 'sdk' + sw))) {
          var i,
            t = n[Ng][bs]($s),
            r = t[0],
            f = t[1],
            o = t[2],
            c = t[3],
            a = 0;
          if (r === kp && f === fl && 'unfilled' === c)
            if (o === cc)
              (of[gl + xp] = !0),
                Q(jf.fw),
                nn(jf.fw),
                dn(of[ll + na]),
                un(function() {
                  Q(jf.fw);
                }, gb),
                un(function() {
                  ir(Zr, nf, tf, ef, cc);
                }, 3e3);
            else
              for (; a < Df[rs]; a++)
                (i = Df[a][xc]),
                  i[Ac] === o &&
                    !e(i[ll]) &&
                    l(i[ll], fl) &&
                    l(i[ll], Qo) &&
                    ((i[gl + xp] = !0),
                    Q(Df[a]),
                    nn(Df[a]),
                    dn(i[ll + na]),
                    (function(n) {
                      un(function() {
                        Q(Df[n]);
                      }, gb),
                        un(function() {
                          ir(Yr, Jr, $r, Qr, yc, n);
                        }, Ob);
                    })(a));
        }
      }
      function ni() {
        var n = [],
          i = qu[Mu + po],
          t = Hu[Kd];
        return (
          e(Hu[Vp])
            ? e(i) || e(i[Np]) || 0 === i[Np]
              ? ((n[Cp] = zu[Np]), (n[Bp] = zu[Lp]))
              : ((n[Cp] = i[Np]), (n[Bp] = i[Lp]))
            : ((n[Cp] = Hu[Vp]), (n[Bp] = Hu[jp])),
          l(es, Wa) && !e(t) && t[Bp] < n[Bp] && (n[Bp] = t[Bp]),
          n
        );
      }
      function ii(n, i, t) {
        var r,
          f,
          o = [],
          c = n[i][Bs](),
          a = c[bs]('?')[1],
          u = 0;
        if (!e(a)) {
          for (a = a[bs]('&'), r = 0; r < a[rs]; r++)
            (f = a[r]),
              (f = f[bs]('=')),
              o[ds](f[0]),
              (f[0] !== Bp && f[0] !== Cp) || l(c, 'mode=2')
                ? (n[i + f[0]] = f[1])
                : f[0] === Bp
                ? (n[i + f[0]] = (+f[1] / (t === cc ? 480 : n[ib] ? 500 : 337.5)) * 100)
                : f[0] === Cp && (n[i + f[0]] = (+f[1] / (t === cc ? 320 : 600)) * 100);
          if (t === cc || t === Oc) {
            for (r = 0; r < o[rs]; r++)
              switch (o[r]) {
                case Kl:
                case Hl:
                case Bp:
                case Cp:
                  u++;
              }
            if (4 !== u) return;
          }
          return 1;
        }
      }
      function ti(n, i) {
        Vf[ds]([n, i]), Lf || ei();
      }
      function ei() {
        function n(n) {
          (n = n || Hu[Us]),
            n[Ds](),
            n[Ls](),
            (r = n[wo]),
            (n = null == n[By] ? n : n[By][0]),
            r === jh
              ? ((t = n[ip]), (e = n[tp]))
              : (Hu[Fa + 'By'](b(-(n[ip] - t)), b(-(n[tp] - e))), r === Vh && (T(i), ri()));
        }
        if (!Lf)
          if (((Lf = !0), uf || Hf))
            if (uf) {
              var i = qu[Xo](eo);
              Y(i, J([vp, mp, ag, $b, Gp, Ul, fp, 0], gf));
              var t, e, r;
              i[dd](jh, n), i[dd](Lh, n), i[dd](Vh, n), zu[ho](i);
            } else ri();
          else
            P() || N()
              ? P()
                ? O()
                  ? zu[dd](jh, ri, !1)
                  : nodeIndex === Df[rs] - 1 && ri()
                : N() && (_(zu[Po], up, ob), Hu[dd](Nh, ri, !1))
              : zu[dd](jh, ri, !1);
      }
      function ri() {
        for (
          (P() && !O()) || N() || uf || Hf ? N() && (E(zu[Po], up), Hu[vd](Nh, ri, !1)) : zu[vd](jh, ri, !1), Lf = !1;
          Vf[rs] > 0;

        ) {
          var n = Vf[ms]();
          e(n[0])
            ? f(n[1]) && n[1]()
            : Hf && !uf
            ? ((e(n[0][qg + Ma + qa]) || n[0][qg + Ma + qa]) &&
                (_(n[0], Jh, ''),
                _(n[0], Ul + qg, ''),
                _(n[0], Bw, ''),
                (n[0][Ns + Wh + Yg] = !0),
                (n[0][Jh] = !0),
                (n[0][bw] = !0),
                (n[0][ko] += Zs + Tw)),
              e(n[1]) || n[1]())
            : (!(function(n, i) {
                var t = function() {
                  (n[bw] = !0), (n[ko] += Zs + Tw), e(i) || i(), n[vd](Ju + qg + gh, t, !1);
                };
                n[dd](Ju + qg + gh, t, !1);
              })(n[0], n[1]),
              n[0][qa]());
        }
      }
      function fi(i, t, r, f, o) {
        if (!e(o)) {
          var c = r[bs](Ks);
          c[rs] < 5 &&
            (i === hc && 3 === c[rs]
              ? (r = Uv + Ks + c[0] + Ks + c[1] + $f + Ks + c[2])
              : i === cc && 4 === c[rs] && (r = Pv + Ks + r)),
            (i = Cv);
        }
        return (
          kf +
          '/' +
          i +
          '?' +
          $([
            Au,
            Kr,
            ku,
            Mr,
            Eu,
            t,
            _u,
            Ur,
            Ru,
            r,
            Cu,
            h(f),
            Pu,
            h(is),
            Uu,
            Bf,
            'fmt',
            e(o) || e(o[ll]) ? 'ioc' : 'snp',
            ju,
            n() + Ks + Wu[bv](),
          ]) +
          (e(o) || e(o[_v]) ? '' : '&cpm=' + o[_v]) +
          (l(r, ll + Ks + il) ? '&erc=%%errorcode%%' : '') +
          '&vld=%%vld%%&usc=%%usc%%&psg=%%psg%%'
        );
      }
      function oi(n, i) {
        if (!n[pv + Th]) {
          n[pv + Th] = !0;
          var t,
            r,
            f,
            o,
            c,
            a,
            u,
            s,
            d = e(i) ? Ks : Ms;
          if (
            ((f = e(n[Cv + Do]) ? n[$w] : n[Cv + Do]), (r = e(n[mc]) ? (e(n[Ac]) ? cc : n[Ac]) : n[mc]), (s = Cv), e(i))
          ) {
            switch (r) {
              case wc:
              case hc:
                (t = Uv + Ks + r + Ks + jr + Ks), (o = n[Cw]);
                break;
              case Cc:
              case _c:
              case Sc:
              case Rc:
              case Ec:
              case Tc:
                (t = jf.bs + r + Ks + jr + Ks),
                  (o = r === Ec && e(n[Dc]) && !e(n[wa]) ? n[wa] : n[Zo + kh] ? Qv : n[Dc]);
                break;
              case cc:
                (t = Pv + Ks + r + Ks + jr + Ks), (o = n[Zo + kh] ? Qv : e(n[Dc]) ? n[Mc] : n[Dc]);
            }
            e(n[ll]) ? e(n[Ig]) || (o = n[Ig]) : (o = ll);
          } else t = i;
          for (
            c =
              e(n[Dc]) && !n[Zo + kh]
                ? [
                    [uc + Ug, vc + d + Cg],
                    [uc + Fg, vc + d + Og],
                  ]
                : [
                    [uc + Ug, vc + d + Cg],
                    [uc + Fg, vc + d + Og],
                    [Og, $f + d + Og],
                    [qg, $f + d + qg],
                    [Qg, $f + d + Zg],
                    [ih, $f + d + th],
                    [rh, $f + d + fh],
                    [sh, $f + d + sh],
                    [Gh, $f + d + Gh],
                    [Yh, $f + d + Yh],
                  ],
              r === Tc && c[ds]([yc + ww, yc + Ks + yw]),
              (e(n[ll]) && !l(n[$w], 'rtb')) || c[ds]([ll + tl, ll + d + il]),
              a = c[rs],
              ai(c, n, i),
              u = 0;
            u < a;
            u++
          )
            ci(c[u][0] + Th, fi(s, f, t + c[u][1], o, n), n), e(n[c[u][0] + $h]) && (n[c[u][0] + $h] = !1);
          r === wc || r === hc
            ? (e(n[Kc + nw + Th]) || (n[Og + Th] = n[Og + Th][wl](n[Kc + nw + Th])),
              e(n[ga + nw + Th]) || (n[Og + Th] = n[Og + Th][wl](n[ga + nw + Th])))
            : r === cc &&
              (e(n[cc + mo + 0 + nw + Th]) || e(n[Og + Th]) || (n[Og + Th] = n[Og + Th][wl](n[cc + mo + 0 + nw + Th]))),
            e(n[Zh + Th]) || e(n[Og + Th]) || (n[Og + Th] = n[Og + Th][wl](n[Zh + Th])),
            n[ml] &&
              1 === n[ml] &&
              !n[Zo + kh] &&
              (n[(e(n[Dc]) ? uc + Fg : Og) + Th][ds](
                '//fqtag.com/pixel.cgi?org=FRP3bBoRc8yjb59flhkI&p=' +
                  Kr +
                  Ms +
                  Mr +
                  '&a=' +
                  Kr +
                  Ms +
                  Mr +
                  Ms +
                  qr[xy] +
                  '&cmp=' +
                  f +
                  '&fmt=' +
                  (e(n[Dc]) ? yc : $f) +
                  '&rd=' +
                  h(is) +
                  '&rt=displayImg&sl=1&fq=1%%fqpb%%'
              ),
              n[mh + Th][ds](
                '//fqtag.com/pixel.cgi?org=FRP3bBoRc8yjb59flhkI&p=' +
                  Kr +
                  Ms +
                  Mr +
                  '&a=' +
                  Kr +
                  Ms +
                  Mr +
                  Ms +
                  qr[xy] +
                  '&cmp=' +
                  f +
                  '&fmt=video&rd=' +
                  h(is) +
                  '&rt=clickImg&sl=1&fq=1%%fqpb%%'
              ));
        }
      }
      function ci(n, i, t) {
        n in t ? t[n][ds](i) : (t[n] = [i]);
      }
      function ai(n, i, t) {
        if (!e(t) && l(t, 'ima-'))
          for (var r = 0; r < n[rs]; r++)
            if (!e(i[n[r][0] + Th]) && d(i[n[r][0] + Th]) && !i[n[r][0] + $h])
              for (var f = i[n[r][0] + Th], o = 0; o < f[rs]; o++) l(f[o], kf) && f[ls](o, 1);
      }
      function ui(i, t, r, f, o, c) {
        if (e(i)) return '';
        var a = ts.doNotTrack;
        return (
          (t = e(t) ? ld : t),
          (r = e(r) ? ld : r),
          (f = e(f) ? Vb : f),
          (i = i[Cs](/\%\%timestamp\%\%|\[timestamp\]/gi, n())),
          (i = i[Cs](/\%\%domain\%\%|\[domain\]/gi, h(on(Hu[Qu][Lw])))),
          (i = i[Cs](/\%\%pageurl\%\%|\[URL_ENCODED_PAGEURL\]|\[pageurl\]|\[INSERT_PAGE_URL\]|\[PAGE_URL\]/gi, h(is))),
          (i = i[Cs](/\%\%referrer\%\%|\[referrer\]/gi, h(qu.referrer))),
          (i = i[Cs](/\%\%useragent\%\%|\[URL_ENCODED_USER_AGENT\]|\[useragent\]|\[USER_AGENT\]|\[UA\]/gi, h(es))),
          (i = i[Cs](/\%\%pid\%\%/gi, Kr)),
          (i = i[Cs](/\%\%sid\%\%/gi, Mr)),
          (i = i[Cs](/\%\%uuid\%\%/gi, Ur)),
          e(qr) ||
            e(Fr) ||
            ((i = i[Cs](/\%\%ipaddress\%\%|\[URL_ENCODED_IP_ADDRESS\]|\[ipaddress\]|\[IP_ADDRESS\]|\[IP\]/gi, qr[su])),
            (i = i[Cs](/\%\%deviceos\%\%|\[deviceos\]/gi, h(Fr[ty]))),
            (i = i[Cs](/\%\%deviceosv\%\%|\[deviceosv\]/gi, h(Fr[ey]))),
            (i = i[Cs](/\%\%devicevendor\%\%|\[devicevendor\]/gi, h(Fr[au]))),
            (i = i[Cs](/\%\%devicemodel\%\%|\[devicemodel\]/gi, h(Fr[Ld])))),
          (i = i[Cs]('%%advertId%%', h(r))),
          (i = i[Cs]('%%publisherId%%', Kr)),
          (i = i[Cs]('%%siteId%%', Mr)),
          (i = i[Cs]('%%device%%', Ur)),
          (i = i[Cs]('%%publisher_id%%', Kr + '__' + Mr)),
          (i = i[Cs]('%%click_id%%', t + '__' + r)),
          (i = i[Cs]('%%gdomain%%', h(h(is)))),
          (i = i[Cs](/\%\%donottrack\%\%|\[DO_NOT_TRACK\]/gi, e(a) || null === a ? 'unspecified' : a)),
          (i = i[Cs](/\%\%errorcode\%\%|\[ERRORCODE\]/gi, f)),
          (i = i[Cs](
            /\[CACHEBUSTING\]|\[CACHEBUSTER\]|\[CACHE_BUSTER\]|\[CACHE_BREAKER\]|\[CB\]/gi,
            Wu[bv]()
              [Is]()
              [Rs](2, 10)
          )),
          e(o) ||
            e(o[os]) ||
            e(o[us]) ||
            ((i = i[Cs](/\[CONTENTPLAYHEAD\]/gi, o[os])),
            (i = i[Cs](/\[ASSETURI\]|___ASSETURI___/gi, h(o[us]))),
            (i = i[Cs](/\%\%width\%\%/gi, o[Up + Pp])),
            (i = i[Cs](/\%\%height\%\%/gi, o[Up + Rp]))),
          (i = i[Cs](/\%\%vld\%\%/gi, e(rf) || e(rf[uu]) ? ld : rf[uu])),
          (i = i[Cs](/\%\%usc\%\%/gi, e(rf) || e(rf[ow]) ? ld : rf[ow])),
          (i = i[Cs](/\%\%psg\%\%/gi, e(rf) || e(rf[cw]) ? ld : rf[cw])),
          e(rf) ||
            (i = i[Cs](
              /\%\%fqpb\%\%/gi,
              '&c1=' +
                Ur +
                '&c2=' +
                (n() - Cf) +
                '&c3=' +
                qr[su] +
                '&c4=' +
                qr[xy] +
                '&c5=' +
                qr.city +
                '&c6=' +
                jr +
                '&c7=' +
                (e(pf) ? ld : pf[0] + $s + pf[1] + $s + pf[2]) +
                '&c8=' +
                (+rf[uu] + $s + (e(rf[ow]) ? -1 : rf[ow]) + $s + (e(rf[cw]) ? -1 : rf[cw])) +
                '&c9=' +
                uf
                ? 1
                : 0
            )),
          Rf && !e(c)
            ? ((i = i[Cs](/%%vid_t%%/gi, h(c.t))),
              (i = i[Cs](/%%vid_d%%/gi, h(c.d))),
              (i = i[Cs](/%%vid_kw%%/gi, h(c.k))))
            : (i = i[Cs](/&vid_t=%%vid_t%%&vid_d=%%vid_d%%&vid_kw=%%vid_kw%%/gi, '')),
          i
        );
      }
      function si(i) {
        new Image()[us] = l(i, kf) ? i + '&tsl=' + (n() - Cf) : i;
      }
      function di(n, t, r, f, o) {
        var a,
          u,
          s = [],
          v = {};
        if (((v[Qg] = nh), (v[ih] = eh), (v[rh] = oh), d(n) || (n = []), c(t) && !e(r))) {
          if (((u = e(r[gc]) ? (e(r[kc]) ? r[ac] : r[kc]) : r[gc]), !1 === r[t + $h])) {
            if (
              ((r[t + $h] = !0),
              e(r[gc]) || t !== Og || De(r, ic + Qh + Fg),
              De(r, ic + i(e(v[t]) ? t : v[t])),
              t === qg && e(r[Ig]))
            )
              for (
                e(r[gc]) ? ((s = [uc + Fg, Og]), e(r[Ac]) || r[Ac] !== Tc || s[ds](yc + ww)) : (s = [Og]),
                  l(r[$w], 'rtb') &&
                    !0 === Sf &&
                    si(
                      ui(If, Hg, r[$w])
                        [Cs]('%%spot%%', e(r[Ac]) ? Pv : strBanner)
                        [Cs]('%%type%%', e(r[Ac]) ? cc : r[Ac]) + r[xh]
                    ),
                  a = 0;
                a < s[rs];
                a++
              )
                di(r[s[a] + Th], s[a], r, f, o);
            if (!e(r[xw])) for (a = 0; a < r[xw][rs]; a++) Df[r[xw][a]][xc][t + $h] = !0;
            for (a = 0; a < n[rs]; a++) si(ui(n[a], t, u, f, o));
          }
        } else for (a = 0; a < n[rs]; a++) si(ui(n[a], ld, ld, f, o));
      }
      function vi(n) {
        (u(n[cs]) || 30.1234 === n[cs]) &&
          un(function() {
            vi(n);
          }, _b),
          (n[Qg] = 0.25 * +n[cs]),
          (n[ih] = 0.5 * +n[cs]),
          (n[rh] = 0.75 * +n[cs]),
          (n[ch] = 0.9 * +n[cs]);
      }
      function li(n, i, t) {
        var r,
          f = n[Ig];
        (r = e(t) ? [wo, i] : [wo, i, xo, t]), Ln(H(f, $(r)));
      }
      function pi(n, i) {
        var t;
        return (
          (t = e(i) ? (n === cc ? mi() : gi()) : bi(i)),
          (t[Au] = Kr),
          (t[ku] = Mr),
          (t[bu] = Ur),
          (t[Mv] = Af),
          (t[wo] = n),
          (t[Dl] = i),
          (t[Pu] = jf),
          (t[Ns] = Cr),
          (t[vu] = jr),
          (t.udsl = Hf),
          (t.basr = vf && jf.bs === $c),
          (t.tbase = kf),
          t
        );
      }
      function bi(n) {
        var i = {},
          t = Df[n],
          e = t[xc];
        return (i[uc] = e), (i[xo] = t), i;
      }
      function mi() {
        var n = {};
        return (n[uc] = of), n;
      }
      function gi() {
        return [];
      }
      function hi(n) {
        if (o(n) && !e(n[gs]) && 'FallbackException' == n[gs]) {
          var i = n[xo],
            t = n[wo];
          if (!e(i)) {
            for (; i[Bo]; ) i[Co](i[Bo]);
            t !== cc && jf.bs === $c && T(i);
          }
          t === cc ? ir(Zr, nf, tf, ef, cc) : e(n[Dl]) || ir(Yr, Jr, $r, Qr, yc, +n[Dl]);
        }
      }
      function wi(n) {
        return Gy[n];
      }
      function yi(n) {
        n = !e(n) && n;
        var i,
          t,
          r,
          f,
          o,
          c,
          a,
          u,
          s,
          d,
          v,
          p,
          b,
          m = !1 === n ? ff : Df[n][xc];
        if (
          (!1 === n
            ? ((i = 'aw'),
              (t = 'adspruce-wrapper'),
              (r = 'al'),
              (f = 'an'),
              (o = 'ac'),
              (c = 'acc'),
              (a = 'ab'),
              (u = 'abc'),
              (s = 'dhs'))
            : ((i = 'bw'),
              (t = 'adspruce-banner-wrapper'),
              (r = 'bl'),
              (f = 'bn'),
              (o = 'bc'),
              (c = 'bcc'),
              (a = 'bb'),
              (u = 'bbc'),
              (s = 'bhs')),
          !e(jf[i]))
        )
          return void (!1 === n && Pi(!0));
        if ((Bi(), !Vr)) {
          for (p = jf.bowr = R(eo), p.id = 'as-body-wrapper'; zu[Bo]; ) p[ho](zu[Bo]);
          zu[ho](p);
        }
        for (
          v = jf[i] = R(eo),
            v.id = t,
            Y(v, J([Gp, 0, Mp, 0, Ap, hp, kp, _p, vp, mp, ig, Qb, ag, Gb], gf)),
            v[Ew] = function(n) {
              (n = n || Hu[Us]), n[Ls]();
            },
            p = jf[r] = R(ro),
            Y(p, J([vp, mp, Kl, am, Wl, 0, ug, ym])),
            p[us] = Cr[dl],
            v[ho](p),
            p = jf[f] = R(eo),
            Y(
              p,
              J([
                Ea,
                Zb + sg,
                vp,
                mp,
                Kl,
                0,
                Hl,
                0,
                Cp,
                Cm,
                dg,
                'Verdana, sans-serif' + sg,
                vg,
                lm + sg,
                pg,
                vm,
                bg,
                am,
                mg,
                vm,
                Zm,
                _p + sg,
                ng,
                '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              ])
            ),
            !1 === n
              ? (p[fs] = '<span>ADVERT - CAN SKIP IN <span id="ad-timer">' + Pc + '</span></span>')
              : ((p[fs] = 'ADVERT - CLICK TO EXIT'),
                (p[Ew] = function() {
                  Qt(n, jf.bvi);
                })),
            v[ho](p),
            p = jf[a] = R(eo),
            Y(p, J([og, Ul, cg, Ul, vp, mp, zl, 0, Hl, 0, Wl, 0, Qm, Xl])),
            v[ho](p),
            jf[u] = R(ro),
            p[ho](jf[u]),
            p = jf[o] = R(eo),
            Y(p, J([Cp, Om, Qm, Xl, vp, pp])),
            v[ho](p),
            jf[c] = R(ro),
            Y(jf[c], J([og, Ul, cg, Ul])),
            p[ho](jf[c]),
            d = 0;
          d < bn(m[wg])[rs];
          d++
        )
          (b = m[wg][bn(m[wg])[d]]),
            (p = b[ao] = R(eo)),
            Y(p, J([Cp, b[Cp] + Os, Bp, b[Bp] + Os, tg, rn(b[Lc]), vp, bp], yf)),
            0 !== b[Yl] && Q(p),
            e(b[Sh]) ||
              (p[Ew] = (function(n) {
                return function(i) {
                  (i = i || Hu[Us]), i[Ls](), e(n[Rh]) || di(n[Rh]), Hu[_l](n[Sh]);
                };
              })(b)),
            jf[o][ho](p);
        for (
          !1 !== n &&
            Vr &&
            ((p = jf.bvi = R($f)),
            _(p, Bl, Ul),
            jf[o][ho](p),
            Y(p, J([kp, _p, og, Ul, cg, Ul])),
            2 === jf.ast ? _(p, Pw, Cr[Pw]) : O() && _(p, Rw),
            (p = jf.bld = R(eo)),
            Y(p, J([Kl, 0, Cp, Om, Bp, Om, Qm, Xl, vp, bp, ig, nm, tg, rn(Cr[Ka]), rg, Um], wf)),
            v[ho](p)),
            V() &&
              l(es[Bs](), 's40ovibrowser') &&
              ((p = jf.bkl = R(eo)),
              Y(p, J([Ea, Zb + sg, vg, lm + sg, bg, vm, mg, vm, Zm, _p + sg, og, Ul, cg, Ul, Qm, Xl])),
              (p[fs] = 'BACK'),
              (p[Ew] = function() {
                Hu[Qu][Cs](is);
              }),
              v[ho](p)),
            p = jf[s] = [],
            d = 1;
          d < 4;
          d++
        )
          (p[da + d] = R(ro)), Y(p[da + d], J([kp, _p, vp, bp])), jf[o][ho](p[da + d]);
        zu[ho](v), !1 === n && Pi(!0);
      }
      function Ai(n) {
        n = !e(n) && n;
        var i,
          t,
          r,
          f,
          o,
          c,
          a,
          s,
          d,
          p,
          m,
          g = !1 !== n,
          h = g ? jf.bvi : jf.vi,
          w = g ? Df[n][xc] : ff,
          y = ni(),
          A = Eb;
        if (
          (g
            ? ((i = 'bw'),
              (t = 'bl'),
              (r = 'bn'),
              (f = 'bc'),
              (o = 'bcc'),
              (c = 'bb'),
              (a = 'bbc'),
              (s = 'bhs'),
              (d = 'bAd'),
              (p = 'bPst'),
              (m = 'bBan'))
            : ((i = 'aw'),
              (t = 'al'),
              (r = 'an'),
              (f = 'ac'),
              (o = 'acc'),
              (c = 'ab'),
              (a = 'abc'),
              (s = 'dhs'),
              (d = 'pAd'),
              (p = 'pPst'),
              (m = 'pBan')),
          !e(jf[p]) && !e(jf[d]) && !e(jf[m]))
        ) {
          var k = bp,
            x = jf[i],
            _ = x[up],
            E = jf[t],
            T = E[up],
            I = jf[r],
            S = I[up],
            B = jf[c],
            R = B[up],
            C = jf[a],
            P = C[up],
            U = jf[f],
            L = U[up],
            N = jf[o],
            D = N[up];
          !V() || l(es, Wa) ? T[vp] === mp && (k = mp) : W(zu, [Gp, Mp, zp], [0, 0, 0]),
            W(_, [Bp, Cp, vp, Kl, zl, Hl, Wl], [y[Bp], y[Cp], k, 0, 0, 0, 0], [1, 1]),
            e(w[Sa]) ||
              (y[Cp] > y[Bp]
                ? W(_, [Yp, $p], [_p, e(w[Ba]) ? Qb : w[Ba][Rs](0, v(w[Ba], qs))])
                : (W(_, [Yp, $p], [rn(w[Sa]), e(w[Ba]) ? Qb : w[Ba][Rs](0, v(w[Ba], qs))]),
                  l(w[Sa], Ga) ? W(_, Qp, ib) : W(_, Qp, tb))),
            y[Cp] > y[Bp] && y[Cp] > Ub ? W(T, qp, '25%') : W(T, qp, '40%'),
            (E[Np] / E[Lp] <= 7 || E[Np] / E[Lp] >= 8) && W(T, Bp, E[Np] / (A / 40)),
            y[Cp] > y[Bp] && y[Cp] > Ub
              ? W(S, [Kp, cp], [E[Lp] / 2, (E[Lp] + 6) / 2], [1, 1])
              : y[Cp] < Ub
              ? W(S, [Kp, cp], [15, 12], [1, 1])
              : W(S, [Kp, cp], [17, 14], [1, 1]),
            W(T, [vp, Wl, Kl], [k, 0, 5], [0, 0, 1]),
            (B[Cp] = y[Cp] + Os);
          var O,
            K,
            M = b(P[Cp]),
            z = b(P[Bp]);
          z >= 50
            ? ((O = 50),
              (K = O * (jf[m][Cp] / jf[m][Bp])),
              K > y[Cp]
                ? ((O = Wu[pd]((y[Cp] / jf[m][Cp]) * jf[m][Bp])), W([R, P, P], [Bp, Bp, Cp], [O, O, y[Cp]], [1, 1, 1]))
                : W([R, P, P], [Bp, Bp, Cp], [O, O, K], [1, 1, 1]))
            : M >= y[Cp]
            ? ((O = Wu[pd]((y[Cp] / jf[m][Cp]) * jf[m][Bp])), W([R, P, P], [Bp, Bp, Cp], [O, O, y[Cp]], [1, 1, 1]))
            : y[Cp] < jf[m][Cp]
            ? ((K = y[Cp]), (O = K * (jf[m][Bp] / jf[m][Cp])), W([R, P, P], [Bp, Bp, Cp], [O, O, K], [1, 1, 1]))
            : W([R, P, P], [Bp, Bp, Cp], [jf[m][Bp], jf[m][Bp], jf[m][Cp]], [1, 1, 1]),
            W([R], [vp, zl, Hl, Wl], [k, 0, 0, 0]);
          var H,
            G,
            X,
            Y = B[Lp] + E[Lp],
            J = y[Bp] - Y;
          if (
            ((J -= 20),
            J > jf[d][Bp] ? ((G = jf[d][Bp]), (H = jf[d][Cp])) : ((G = J), (H = G * (jf[d][Cp] / jf[d][Bp]))),
            H > y[Cp] && ((H = y[Cp]), (G = H * (jf[d][Bp] / jf[d][Cp]))),
            W([L, D, D], [Bp, Bp, Cp], [G, G, H], [1, 1, 1]),
            e(h) || h[So][Bs]() !== $f || W(h, [Cp, Bp], [H, G], [1, 1]),
            G < J ? W(L, Xp, (J - G) / 2 + E[Lp] + 10, 1) : W(L, Xp, E[Lp] + 10, 1),
            bn(w[wg])[rs])
          ) {
            var $,
              nn,
              tn,
              en,
              fn = { topleft: 0, bottomleft: 0, topright: 0, bottomright: 0 };
            for (nn = 0; nn < bn(w[wg])[rs]; nn++)
              (tn = w[wg][bn(w[wg])[nn]]),
                (en = tn[ao]),
                (tn[Yl] <= h[os] || 0 === tn[Yl]) && (tn[cs] >= h[os] || 0 === tn[cs]) && !w[sh + $h]
                  ? (($ = (u(+tn[_g]) ? tn[_g] : Kl) + (u(+tn[xg]) ? tn[xg] : Hl)),
                    W(
                      en,
                      [kp, u(+tn[xg]) ? tn[xg] : Hl, u(+tn[_g]) ? tn[_g] : Kl],
                      [xp, (u(+tn[xg]) ? 0 : +tn[xg]) + fn[$], u(+tn[_g]) ? 0 : +tn[_g]],
                      [0, 1, 1]
                    ),
                    (fn[$] += tn[Cp] + (u(+tn[xg]) ? 0 : +tn[xg])),
                    e(tn[Ww]) || tn[Rl + $h] || ((tn[Rl + $h] = !0), di(tn[Ww], bf, bf, bf, h)))
                  : Q(en);
          }
          if (
            (F() && W([T, S], [Kl, Kl], [15, 10], [1, 1]),
            g || (0 === N[Op] && 0 === N[Dp] && ((X = N[us]), (N[us] = ''), (N[us] = X))),
            0 === C[Op] && 0 === C[Dp] && ((X = C[us]), (C[us] = ''), (C[us] = X)),
            (w[sh + $h] && h[up][kp] === _p) || (!g && w[mc] === wc && !j()) || q() || 2 === jf.ast)
          ) {
            var on = jf[s],
              cn = 0,
              an = N[$l];
            for (
              (q() || 2 === jf.ast) && y[Cp] > y[Bp] && (an = (y[Cp] - b(D[Cp])) / 2),
                2 === jf.ast ? Z(N) : q() && g && (Q(h), Z(N)),
                X = Oc + mo,
                e(w[X + 2]) ? (e(w[X + 1]) ? e(w[X + 0]) || (cn = 1) : (cn = 2)) : (cn = 3),
                nn = 0;
              nn < cn;
              nn++
            )
              !(function(n) {
                W(
                  on[da + (n + 1)],
                  [kp, Bp, Cp, Kl, Hl],
                  [
                    xp,
                    G * (w[X + n + Bp] / gb),
                    H * (w[X + n + Cp] / gb),
                    G * (w[X + n + Kl] / gb),
                    H * (w[X + n + Hl] / gb) + an,
                  ],
                  [0, 1, 1, 1, 1]
                );
              })(nn);
          }
        }
      }
      function ki(n, i) {
        var t = 0;
        n[Jd]
          ? ((t = 1), n[Jd]())
          : (qu[Wd] || qu[Wd + po]) && qu[Jd]
          ? ((t = 1), qu[Jd]())
          : n[Al + $d]
          ? ((t = 1), n[Al + $d]())
          : qu[Al + $d]
          ? ((t = 1), qu[Al + $d]())
          : n[kl + vl + Da + Md]
          ? ((t = 1), n[kl + vl + Da + Md]())
          : qu[kl + vl + Da + Md]
          ? ((t = 1), qu[kl + vl + Da + Md]())
          : n[xl + $d] && ((t = 1), n[xl + $d]()),
          !t || e(i) || i[Jd + $h] || ((i[Jd + $h] = !0), di(i[Jd + Th], bf, bf, bf, n));
      }
      function xi(n, i) {
        var t = 0;
        n[Zd]
          ? ((t = 1), n[Zd]())
          : n[Al + Qd + Xd]
          ? ((t = 1), n[Al + Qd + Xd]())
          : n[Al + nv]
          ? ((t = 1), n[Al + nv]())
          : n[kl + Xc + Da + Md]
          ? ((t = 1), n[kl + Xc + Da + Md]())
          : n[xl + nv] && ((t = 1), n[xl + nv]()),
          !t || e(i) || i[Wd + $h] || ((i[Wd + $h] = !0), di(i[Jd + Th], bf, bf, bf, n));
      }
      function _i() {
        dn(jf.rr),
          (jf.rr = sn(function() {
            Ai();
          }, Pb));
      }
      function Ei(n, i, t) {
        if (!U() && !V() && !L()) {
          (n = !e(n) && n), (t = !e(t) && t);
          var r,
            f,
            o = !1 !== n,
            c = e(i) ? jf.vi : i,
            a = o ? Df[n][xc] : ff,
            s = o ? a[Ac] : a[mc],
            d = o ? jf.bld : jf.ald;
          if (2 === jf.ast && 5999 === c[os]) return;
          if (
            ((jf.tt = c[os]),
            e(jf.lt) && (jf.lt = 0),
            jf.tt > 0.5 &&
              (s !== Rc || a[kw]
                ? !0 !== t || a[kw]
                  ? s === Ec && e(a[_w])
                    ? ((a[_w] = !0), ne(n, $f), di(a[Og + Th], Og, a, bf, c))
                    : s !== Ec &&
                      s !== Rc &&
                      !1 === t &&
                      (Q(d), !jf.scrl && s === hc && jf.ast && K() && ((jf.scrl = !0), On()))
                  : re(n)
                : se(n),
              (q() || 2 === jf.ast || (j() && !Yn() && !Jn())) &&
                (a[Wd + $h] || ((a[Wd + $h] = !0), di(a[Wd + Th], bf, bf, bf, c)),
                (jf.eft = un(function() {
                  a[Jd + $h] || ((a[Jd + $h] = !0), di(a[Jd + Th], bf, bf, bf, c));
                }, Nb))),
              di(a[qg + Th], qg, a, bf, c),
              j() && s === _c && e(a[cs]) && (a[cs] = c[cs]),
              !o && q() && c[up][kp] === xp && (Q(c), en(jf.ac, a[Kc]), W(jf.ac, [Jp, Qp, Zp], [Rm, tb, nb]))),
            j() && s !== Rc && !1 === t && (jf.tt < jf.lt + 1 ? (jf.lt = jf.tt) : (c[os] = jf.lt)),
            s === Rc)
          ) {
            for (a[pa] = jf.tt, f = 0; f < a[xw][rs]; f++) Df[a[xw][f]][xc][pa] = jf.tt;
            (j() && !Yn()) || ue();
          }
          if ((s === Rc || s === Ec) && bn(a[wg])[rs]) {
            var v,
              l,
              p,
              m = {
                topleft: 0,
                bottomleft: 0,
                topright: 0,
                bottomright: 0,
                topoffset: s === Rc ? 31 : 0,
                bottomoffset: 0,
              };
            for (f = 0; f < bn(a[wg])[rs]; f++)
              (l = a[wg][bn(a[wg])[f]]),
                (p = l[ao]),
                (l[Yl] <= c[os] || 0 === l[Yl]) && (l[cs] >= c[os] || 0 === l[cs]) && !a[sh + $h]
                  ? ((v = (u(+l[_g]) ? l[_g] : Kl) + (u(+l[xg]) ? l[xg] : Hl)),
                    W(
                      p,
                      [kp, u(+l[xg]) ? l[xg] : Hl, u(+l[_g]) ? l[_g] : Kl],
                      [xp, (u(+l[xg]) ? 0 : +l[xg]) + m[v], u(+l[_g]) ? m[l[_g] + Yl] : +l[_g] + m[Kl + Yl]],
                      [0, 1, 1]
                    ),
                    (m[v] += l[Cp] + (u(+l[xg]) ? 0 : +l[xg])),
                    e(l[Ww]) || l[Rl + $h] || ((l[Rl + $h] = !0), di(l[Ww], bf, bf, bf, i)))
                  : Q(p);
          }
          e(a[bh + Th]) ||
            ((r = a[bh + Th]),
            e(r[b(c[os])]) || r[b(c[os]) + $h] || ((r[b(c[os]) + $h] = !0), di(r[b(c[os])], bf, bf, bf, c))),
            c[os] >= a[Qg] && c[os] < a[ih]
              ? di(a[Qg + Th], Qg, a, bf, c)
              : c[os] >= a[ih] && c[os] < a[rh]
              ? di(a[ih + Th], ih, a, bf, c)
              : c[os] >= a[rh] && c[os] < a[ch]
              ? di(a[rh + Th], rh, a, bf, c)
              : c[os] >= a[ch] && di(a[sh + Th], sh, a, bf, c);
        }
      }
      function Ti(n, i, t) {
        function r() {
          var n = o[os],
            i = sn(function() {
              o[qg](), o[os] > n + 1 && dn(i);
            }, gb);
        }
        if (((n = !e(n) && n), (t = !e(t) && t), !1 !== n)) var f = Df[n];
        var o = e(i) ? jf.vi : i,
          c = !1 === n ? ff : f[xc],
          a = e(c[mc]) ? c[Ac] : c[mc];
        e(jf.lns) && (jf.lns = {}),
          !1 === n
            ? ((jf.lns.eventPlay = function() {
                c[Og + $h] || o[Xg](), Oi();
              }),
              o[dd](qg, jf.lns.eventPlay, !1),
              C() &&
                jf.ast &&
                ((jf.lns.eventCanPlay = function() {
                  o[Xg](), o[qg]();
                }),
                o[dd](qh, jf.lns.eventCanPlay, !1)),
              C() &&
                ((jf.lns.eventPause = function() {
                  !0 === jf.aup && !0 === jf.as && ((jf.aup = !1), o[os] <= 1 && Li());
                }),
                o[dd](Xg, jf.lns.eventPause, !1),
                (jf.lns.eventError = function() {
                  Hn();
                })))
            : C() && a === Rc
            ? ((jf.lns.eventError = function() {
                Hn(n);
              }),
              (jf.lns.eventCanPlay = function() {
                jf.ast && r();
              }))
            : C() &&
              !0 === t &&
              ((jf.lns.eventError = function() {
                o[qa](), o[Xg](), r();
              }),
              (jf.bhr = !1),
              (jf.lns.eventCanPlay = function() {
                jf.ast && !jf.bhr && ((jf.bhr = !0), r());
              })),
          (jf.lns.eventTimeUpdate = function() {
            Ei(n, i, t);
          }),
          (jf.lns.eventPlaying = function() {
            (!1 !== n || j() || N()) &&
              !1 !== n &&
              (a === Rc ? Z(o) : t && P() ? ((o[zh] = 0), (o[Jh] = !0)) : t || a === Ec || (Q(jf.bl), Z(jf.bvi)));
          }),
          (jf.lns.eventEnded = function() {
            if (j() && a !== Ec && (a !== Rc || Yn()) && !t && jf.lt < o[os] - 1) o[os] = jf.lt;
            else if ((C() || (j() && !Yn() && c[mu]) || ki(o, c), !1 === n)) Ni(), Wi(), F() && dn(jf.bbt);
            else if (a === Ec)
              -135 === b(f[up][Wp])
                ? (e(f[$f]) || (Q(f[$f]), Q(f[Gh])),
                  un(function() {
                    ne(n, Oa);
                  }, Mb))
                : ne(n, Na),
                ki(o, c);
            else if (a === Rc) de(n);
            else if (t) {
              if (t) {
                jf.bw[up][kp] === xp && $t(n), dn(c.cpTimer), dn(c.svbViewableTimer), o[Xg]();
                var i = f[ua];
                en(i, Cr[Pw]),
                  W(i, [Jp, Qp, gp], [Rm, ib, wp]),
                  (i[Ew] = function(i) {
                    (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
                  }),
                  Z(f[fa]),
                  Z(f[oa]);
              }
            } else e(c.cpTimer) || dn(c.cpTimer), $t(n);
          }),
          C() && (!1 === n && o[dd](qh, jf.lns.eventCanPlay, !1), o[dd](Vg, jf.lns.eventError, !1)),
          o[dd](Mg, jf.lns.eventPlaying, !1),
          o[dd](ia, jf.lns.eventTimeUpdate, !1),
          o[dd](ah, jf.lns.eventEnded, !1);
      }
      function Ii(n, i, t, r, f) {
        var o, c, a, u, s, d, v, p;
        if (e(n[ac])) {
          if (e(f)) return;
          v = yc;
        } else v = cc;
        (o = R(to)),
          Y(o, J([Cp, t + Os, Bp, v === cc ? r + Os : 0, Gp, Ul, Mp, _p])),
          W(i, Qm, Xl),
          i[ho](o),
          (c = o[ws + Xu]),
          (c.lcb = function() {
            function t() {
              (p = un(function() {
                n[gl + xp] || di(n[uc + Fg + Th], uc + Fg, n);
              }, Ob)),
                (n[ll + na] = p);
            }
            s ||
              ((s = !0),
              (u = a[Ku]),
              Y(u, J([Gp, 0, zp, 0, Mp, 0, Ap, hp])),
              '' !== u[fs] && u[Bo] && 0 != u[Bo][Io]
                ? v === cc
                  ? ((i[up][fp] = 0),
                    Z(i[Po]),
                    nn(i[Po]),
                    i[Bo][dd](
                      mh,
                      function() {
                        dn(p);
                      },
                      !1
                    ),
                    un(function() {
                      n[gl + xp] || (tn(i[Po]), Bn(i, fp, 1, 0.02, 0), t());
                    }, kb))
                  : v === yc && n[Ac] !== Ec && Bn(o, Bp, r, r / (n[Ac] === _c ? 30 : 60), 0, 1, t)
                : (di(n[ll + tl + Th], ll + tl, n, 'as-empty'),
                  e(f) ? ir(Zr, nf, tf, ef, cc) : ir(Yr, Jr, $r, Qr, yc, f)));
          }),
          (a = c[Mu]),
          (d =
            '<script>if(document.readyState=="complete"){lcb()}else{window["' +
            dd +
            '"]("load", lcb)}(new Image()).src="' +
            ui(
              fi(
                Cv,
                v === cc ? n[ac] : n[kc],
                (v === cc ? Pv + Ks + cc : jf.bs + n[Ac]) + Ks + jr + Ks + ll + Ks + 'rendered',
                ll,
                n
              ),
              'rendered',
              n
            ) +
            '";' +
            (!e(n[$w]) && l(n[$w], 'rtb') && !0 === Sf
              ? '(new Image()).src="' +
                ui(If, 'rendered', n[$w])
                  [Cs]('%%spot%%', v === cc ? Pv : v)
                  [Cs]('%%type%%', v === cc ? cc : n[Ac]) +
                n[xh] +
                '";'
              : '') +
            'document.currentScript.parentNode.removeChild(document.currentScript);</script>'),
          a[_l]()[Yu](ui(Si(n[ll], n, t, r), bf, n[Cv + Do]) + d),
          a[El](),
          un(function() {
            s ||
              ((c.lcb = function() {}),
              di(n[ll + tl + Th], ll + tl, n, 'as-timeout'),
              e(f) ? ir(Zr, nf, tf, ef, cc) : ir(Yr, Jr, $r, Qr, yc, f));
          }, 15e3);
      }
      function Si(n, i, t, e) {
        return (
          (n = n[Cs](/\%\%s-wid\%\%/gi, t)),
          (n = n[Cs](/\%\%s-wid-px\%\%/gi, t + Os)),
          (n = n[Cs](/\%\%s-hig\%\%/gi, e)),
          (n = n[Cs](/\%\%s-hig-px\%\%/gi, e + Os))
        );
      }
      function Bi() {
        var n,
          i,
          t = k(oo);
        for (i = 0; i < t[rs]; i++) (n = x(t[i], gs)), c(n) && n[Bs]() === Pl && (jf.vp = t[i]);
        if (e(jf.vp)) {
          var r = k(co)[0],
            f = R(oo);
          _(f, gs, Pl), _(f, ws, ''), r[ho](f), (jf.ovp = ''), (jf.vp = f);
        } else jf.ovp = x(jf.vp, ws);
      }
      function Ri() {
        _(jf.vp, ws, 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
      }
      function Ci() {
        _(jf.vp, ws, jf.ovp);
      }
      function Pi(i) {
        (jf.aw[uc] = ff),
          e(ff[Yw]) ||
            ((ff[Xw] = !1),
            (jf.an[fs] = '<span>ADVERT - CAN SKIP IN <span id="ad-timer">' + ff[Yw] + '</span></span>')),
          mf !== hc || Vr || (ff[mc] = mf = wc),
          mf !== wc ||
            j() ||
            (ff[Cw] +=
              '?' +
              $([
                Au,
                Kr,
                ku,
                Mr,
                Eu,
                ff[gc],
                _u,
                Ur,
                Ru,
                wc + Ks + jr + Ks,
                Cu,
                h(ff[Cw]),
                Pu,
                h(is),
                Uu,
                Bf,
                ju,
                n(),
              ])),
          oi(ff),
          di(ff[uc + Ug + Th], uc + Ug, ff),
          i && Ui();
      }
      function Ui() {
        var n,
          i,
          t,
          r,
          f,
          o,
          c = 0,
          a = jf.ab,
          u = jf.ac,
          s = u[up],
          d = jf.aw,
          v = jf.abc,
          p = jf.acc;
        if (mf !== wc || (!N() && !P())) {
          if (
            ((t = []),
            (r = []),
            (f = []),
            (i = Kc),
            (t[Cw] = e(ff[i]) ? Cr[Oc] : ff[i]),
            (t[mh] = e(ff[i + Bh]) ? ff[Sh] : ff[i + Bh]),
            (t[Cp] = e(ff[i + Pp]) ? Ub : ff[i + Pp]),
            (t[Bp] = e(ff[i + Rp]) ? 338 : ff[i + Rp]),
            (f[Cw] = ff[Cw]),
            (f[Cp] = t[Cp]),
            (f[Bp] = t[Bp]),
            (i = ga),
            (r[mh] = e(ff[i + Bh]) ? ff[Sh] : ff[i + Bh]),
            (r[Cw] = e(ff[i]) ? (e(r[mh]) ? Cr.cont : Cr.lm) : ff[i]),
            (r[Cp] = e(ff[i + Pp]) ? 728 : ff[i + Pp]),
            (r[Bp] = e(ff[i + Rp]) ? 90 : ff[i + Rp]),
            (jf.pPst = t),
            (jf.pBan = r),
            (jf.pAd = f),
            X(d, J([ig], e(ff[Ba]) ? Qb : ff[Ba])),
            e(ff[Sa]) || X(d, J([tg, rn(ff[Sa]), rg, l(ff[Sa], Ga) ? ib : tb], wf)),
            (v[us] = r[Cw]),
            X(v, J([Bp, r[Bp], Cp, r[Cp]])),
            (n = jf.dhs),
            (i = Oc + mo),
            !e(ff[i + 0]))
          )
            for (c = 1, e(ff[i + 2]) ? e(ff[i + 1]) || (c = 2) : (c = 3), o = 0; o < c; o++)
              (n[da + (o + 1)][us] = ff[i + o]),
                (n[da + (o + 1)][Ew] = (function(n) {
                  return function(i) {
                    (i = i || Hu[Us]), i[Ls](), Hi(n);
                  };
                })(o));
          mf === hc || (mf === wc && j())
            ? ((a[Ew] = function(n) {
                (n = n || Hu[Us]), n[Ls](), zi(zc);
              }),
              Vi())
            : ((p[us] = t[Cw]),
              X(p, J([Bp, t[Bp], Cp, t[Cp]])),
              V()
                ? ((s[vp] = pp),
                  (n = R(fo)),
                  (n[Zu] = f[Cw]),
                  Y(n, hf),
                  u[ho](n),
                  (n = R(fo)),
                  (n[Ew] = function(n) {
                    (n = n || Hu[Us]), n[Ls](), (Hu[Qu][Zu] = e(r[mh]) ? f[Cw] : r[mh]);
                  }),
                  Y(n, hf),
                  a[ho](n))
                : ((a[Ew] = function(n) {
                    (n = n || Hu[Us]), n[Ls](), e(r[mh]) ? qi() : zi(zc);
                  }),
                  (u[Ew] = function(n) {
                    (n = n || Hu[Us]), n[Ls](), zi(Pw);
                  }))),
            ji();
        }
      }
      function ji() {
        if (Nf[rs] > 0 && e(jf.stl)) {
          var n,
            i,
            t,
            r,
            o,
            c = Hu[Qu],
            a = c.pathname,
            u = '';
          for (t = jf.soc = [], r = jf.stl = [], o = 0; o < Nf[rs]; o++)
            (n = Nf[o]),
              (i = n[Zu]),
              e(i) ||
                (I(i) ||
                  ((i = x(n, Zu)),
                  0 !== v(i, '#') &&
                    0 !== v(i[Bs](), 'javascript:') &&
                    (0 !== v(i, '/') && ((u = a[Rs](a.lastIndexOf(Xs) + 1)), (u = a[Cs](u, ''))),
                    (i = c.protocol + Xs + Xs + c[Lw] + u + i))),
                (r[o] = i),
                (n[Zu] = Sd)),
              e(n[Ew]) || ((t[o] = n[Ew]), (n[Ew] = null)),
              (n[Ew] = (function(n) {
                return function(i) {
                  (i = i || Hu[Us]), i[Ls](), i[Ds](), Fi(n);
                };
              })(o));
        }
        f(Hu[ec + Jc]) && (Hu[ec + Jc](), (adspruce.awaitingAction = !0));
      }
      function Vi() {
        var n,
          i,
          t = ff,
          e = jf.pPst,
          r = jf.aw,
          f = jf.ac,
          o = jf.acc;
        (i = jf.ald = R(eo)),
          r[ho](i),
          F() || Y(i, J([Cp, Om, Bp, Om, Qm, Xl, ig, nm, tg, rn(Cr[Ka]), rg, Um + Zs + Um], wf + hf)),
          (n = jf.vi = R($f)),
          _(n, Bl, Ul),
          O() && _(n, Rw),
          f[ho](n),
          Y(n, J([kp, xp, og, Ul, cg, Ul])),
          C()
            ? (2 === jf.ast && (X(f, J([tg, rn(e[Cw])], yf)), _(n, Pw, e[Cw])),
              (f[Ew] = function() {
                zi(ca);
              }))
            : (N() && _(n, Pw, e[Cw]),
              (f[Ew] = function(n) {
                (n = n || Hu[Us]), n[Ls](), zi(ca);
              })),
          (n[us] = t[Cw]),
          (o[us] = e[Cw]),
          Q(o),
          vi(ff),
          Ti();
      }
      function Li() {
        var n = jf.vi;
        (C() || P() || j()) &&
          (C() ? Q(jf.acc) : en(jf.ac, _p),
          Z(n),
          j() ||
            (dn(jf.cdt),
            (jf.an[fs] = '<span>ADVERT - CAN SKIP IN <span id="ad-timer">' + Pc + '</span></span>'),
            Xi(),
            Ai(),
            n[qg](),
            n[qg]()));
      }
      function Ni() {
        Q(jf.vi),
          W(jf.acc, kp, Ip),
          (jf.ac[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls](), zi(Pw);
          });
      }
      function Di() {
        var n = y('ad-timer')[fs];
        n--, n > 0 && !0 !== jf.stp ? (y('ad-timer')[fs] = n) : (dn(jf.cdt2), j() && Q(jf.aw), qi());
      }
      function Oi() {
        dn(jf.cdt),
          (2 === jf.ast || q() || (j() && !Yn())) && (ff[Xw] = !1),
          ff[Xw]
            ? (jf.cdt = sn(function() {
                Xi();
              }, Nb))
            : (jf.an[fs] = '<span>ADVERT - CONTENT WILL RESUME SHORTLY</span>');
      }
      function Fi(i) {
        var t = jf.an,
          r = jf.vi;
        if (mf === hc)
          C()
            ? (2 === jf.ast
                ? (t[fs] = '<span>ADVERT - CAN SKIP IN <span id="ad-timer">' + Pc + '</span></span>')
                : l(es, hu + ' /3/') && Hn(),
              jf.fp && (jf.fp = !1))
            : P() &&
              (Ri(),
              F() &&
                (dn(jf.bbt),
                (jf.bbt = sn(function() {
                  Ei();
                }, _b)),
                On()),
              r[qg]());
        else if (mf === wc)
          if (j()) Q(jf.ald);
          else if (V())
            t[fs] =
              '<a href="' +
              jf.stl[i] +
              '" style="color: #ffffff !important; text-decoration: none !important;">ADVERT - CLICK HERE TO SKIP</a>';
          else {
            Hu[Qu] = ff[Cw];
            var f,
              o,
              c = n();
            un(function() {
              (o = n()),
                (f = (o - c) / Nb),
                f > 3
                  ? un(function() {
                      (t[fs] = '<span>ADVERT - SKIPPING IN <span id="ad-timer">' + Pc + '</span></span>'),
                        (jf.cdt = sn(function() {
                          Xi();
                        }, Nb));
                    }, gb)
                  : un(function() {
                      (t[fs] = '<span>ADVERT - CLICK HERE TO SKIP</span>'),
                        (t[Ew] = function(n) {
                          (n = n || Hu[Us]),
                            n[Ls](),
                            e(ff[Ca + Th]) || ff[Ca + $h] || ((ff[Ca + $h] = !0), di(ff[Ca + Th], bf, bf, bf, r)),
                            qi();
                        });
                    }, Nb);
            }, Nb);
          }
        j() &&
          (l(es, 'CriOS') && Hu[Us][Ds](),
          (r[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls](), zi();
          })),
          (adspruce.awaitingAction = !1),
          (adspruce.isDisplaying = !0),
          Ri(),
          e(ff[Og + Th]) ||
            (mf === hc || (j() && mf === wc)
              ? (di(ff[Og + Th], Og, ff, bf, r),
                un(function() {
                  !1 === ff[qg + $h] && b(r[os]) < 1 && qi();
                }, Mb))
              : di(ff[Og + Th], bf, bf, bf, r)),
          (jf.surl = jf.stl[i]),
          (jf.sfn = jf.soc[i]),
          Q(jf.bowr),
          Z(jf.aw),
          _i(),
          C() && mf === hc ? r[qg]() : (j() || N()) && r[qg]();
      }
      function qi() {
        F() && dn(jf.bbt),
          (mf === hc || (j() && mf === wc)) && (jf.stp = !0),
          dn(jf.rr),
          dn(jf.cdt),
          dn(jf.cdt2),
          Ci(),
          Z(jf.bowr),
          Q(jf.aw),
          (mf === hc || (j() && mf === wc)) && (Ki(), Mi()),
          (adspruce.isDisplaying = !1),
          f(jf.sfn)
            ? (jf.sfn(),
              un(function() {
                if (C && xn() && l(jf.surl, 'rtsp://')) return Hu[_l](jf.surl), !1;
                Hu[Qu][Zu] = jf.surl;
              }, jb))
            : (Hu[Qu][Zu] = jf.surl);
      }
      function Ki(n) {
        n = !e(n) && n;
        var i = !1 === n ? jf.vi : jf.bvi,
          t = !1 === n ? ff : Df[n][xc];
        (e(t[mc]) ? t[Ac] : t[mc]) === Rc && (i = Df[n][Sw][$f]),
          !1 === n &&
            (i[vd](qg, jf.lns.eventPlay, !1),
            i[vd](qh, jf.lns.eventCanPlay, !1),
            C && i[vd](Xg, jf.lns.eventPause, !1)),
          C() && (!1 === n && i[vd](qh, jf.lns.eventCanPlay, !1), i[vd](Vg, jf.lns.eventError, !1)),
          i[vd](Mg, jf.lns.eventPlaying, !1),
          i[vd](ia, jf.lns.eventTimeUpdate, !1),
          i[vd](ah, jf.lns.eventEnded, !1);
      }
      function Mi() {
        for (var n, i = 0; i < Nf[rs]; i++)
          (n = Nf[i]), e(jf.stl) || (_(n, Zu, jf.stl[i]), f(jf.soc[i]) ? (n[Ew] = jf.soc[i]) : (n[Ew] = null));
      }
      function zi(n) {
        var i = ff[gc],
          t = jf.vi;
        (mf === hc || (j() && mf === wc)) && (C() ? Fn() : P() ? Wn(t) : j() && Qn(t));
        var r,
          f = '',
          o = Uv + Ks + hc + Ks + jr + Ks + $f + Ks + (n === zc ? zc + Ih + gh : mh + gh);
        n === zc
          ? ((r = ga + Bh), e(ff[r]) || (f = ff[r]), (r = ga + Uh), e(ff[r]) || di(ff[r], bf, bf, bf, t))
          : n === Pw && ((r = Kc + Bh), e(ff[r]) || (f = ff[r]), (r = Kc + Uh), e(ff[r]) || di(ff[r], bf, bf, bf, t)),
          si(ui(fi(Cv, i, o, ff[Cw], ff), o, i)),
          '' !== f || e(ff[Sh]) || ((f = ff[Sh]), e(ff[Rh]) || di(ff[Rh], bf, bf, bf, t)),
          De(ff, ic + Ih),
          Gi(),
          '' === f || e(f) || Hu[_l](ui(f, o, i, bf, t));
      }
      function Hi(n) {
        Gi();
        var i,
          t = ff[gc],
          r = ff[Cw],
          f = jf.vi;
        (mf === hc || (j() && mf === wc)) && (C() ? Fn() : P() ? Wn(f) : j() && Qn(f)),
          (i = Uv + Ks + hc + Ks + jr + Ks + $f + Ks + Oc + Ms + mh + Ms + (n + 1)),
          si(ui(fi(Cv, t, i, r, ff), i, t)),
          e(ff[Oc + Ph + n]) || si(ui(ff[Oc + Ph + n], i, t, bf, f)),
          De(ff, ic + Ih + Fc + (n + 1)),
          Hu[_l](ui(ff[Oc + Bh + n], i, t, bf, f));
      }
      function Gi() {
        dn(jf.cdt),
          dn(jf.cdt2),
          (jf.an[fs] = '<span>ADVERT - CLICK HERE TO SKIP<span id="ad-timer"></span></span>'),
          (jf.an[Ew] = function(n) {
            (n = n || Hu[Us]),
              n[Ls](),
              e(ff[Ca + Th]) || ff[Ca + $h] || ((ff[Ca + $h] = !0), di(ff[Ca + Th], bf, bf, bf, jf.vi)),
              qi();
          });
      }
      function Wi() {
        var n = jf.an;
        (n[fs] = '<span>ADVERT - CLICK TO SKIP OR WAIT <span id="ad-timer">' + Pc + '</span> SECONDS</span>'),
          (n[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls](), Q(jf.aw), qi();
          }),
          N() && dn(jf.cdt),
          dn(jf.cdt2),
          (jf.cdt2 = sn(function() {
            Di();
          }, Nb));
      }
      function Xi() {
        var n,
          i = jf.vi,
          t = jf.an,
          r = y('ad-timer');
        mf === hc || (j() && mf === wc)
          ? (O() && 346 === Hu[jp] && (i[Al + Xc + Xd](), i[Al + $d]()),
            (n = r[fs]),
            n--,
            n > 0 && !jf.stp
              ? (r[fs] = n)
              : (dn(jf.cdt),
                (t[fs] = '<span>ADVERT - CLICK HERE TO SKIP<span id="ad-timer"></span></span>'),
                (t[Ew] = function(n) {
                  (n = n || Hu[Us]),
                    n[Ls](),
                    e(ff[Ca + Th]) || ff[Ca + $h] || ((ff[Ca + $h] = !0), di(ff[Ca + Th], bf, bf, bf, i)),
                    j() && Q(jf.aw),
                    qi();
                }),
                F() && 0 === i[os] && On()))
          : ((n = r[fs]), n--, n >= 0 && !jf.stp ? (r[fs] = n) : (dn(jf.cdt), qi()));
      }
      function Yi() {
        var i, t, r, f, o, c, a, u, s;
        if (
          (At(),
          of[ib] && of[gu] && of[mu] && z(of[wu].f),
          e(of[Ig]) && (oi(of), di(of[uc + Ug + Th], uc + Ug, of)),
          vf
            ? (jf.fsm = uw)
            : Of[rs] > 0
            ? ((jf.fsm = Fa), Ji())
            : (jf.fsm = e(of.clipSource) || !Vr || of[gu] ? Ha : za),
          e(jf.fw) || T(jf.fw),
          (i = jf.fw = R(eo)),
          (i[No] = Sy),
          Y(i, J([ag, Wb, _a, gg, ub, 1, vp, mp, kp, _p], gf)),
          (i[uc] = of),
          i[dd](Lh, _n, !1),
          (t = jf.fc = R(eo)),
          (c = J([Bp, $m, Cp, Jm, vp, mp, Gp, Ul, Ap, hp], gf)),
          e(of[Mc])
            ? e(of[$p])
              ? (c += J([ig, Qb]))
              : (c += J([ig, of[$p]]))
            : (c += J([tg, rn(of[Mc]), rg, l(of[Mc], Ga) ? ib : tb], wf)),
          Y(t, c),
          i[ho](t),
          V() ? ((r = jf.fcl = R(fo)), (r[Zu] = Sd)) : (r = jf.fcl = R(eo)),
          Y(r, J([tg, rn(Cr[El]), Bp, um, Cp, sm, vp, bp, Kl, rm, Wl, fm, ag, Yb], yf)),
          V() && Z(r),
          (r[Ew] = function(n) {
            (n = n || Hu[Us]),
              n[Ls](),
              (of[El + Yg] = !0),
              rt(),
              of[dw + $h] || ((of[dw + $h] = !0), di(of[dw + Th], bf, bf, bf, f));
          }),
          t[ho](r),
          !e(of[ll]))
        )
          return zu[ho](i), W(r, Fl, $b), r[dd](jh, r[Ew]), r[dd](Lh, _n), r[dd](Vh, _n), void Ii(of, t, Sb, Cb);
        if (
          ((o = jf.fm = R(eo)),
          Y(o, J([tg, rn(of[Jh] ? Cr[Gh] : Cr[Yh]), Bp, um, Cp, sm, vp, bp, Kl, rm, Wl, pm, ag, Yb, kp, _p], yf)),
          (Yn() || 2 === jf.ast || (C() && jf.ast && m(Fr[ey]) < 4.3)) && nn(o),
          t[ho](o),
          !e(of[Ig]))
        )
          return zu[ho](i), void li(of, cc);
        if (((u = cc + mo), (jf.fls = []), !e(of[u + 0]))) {
          for (s = 0; s < 3; s++)
            e(of[u + s]) ||
              ((c = jf['fl' + s] = R(ro)),
              (c[us] = of[u + s]),
              (c[Ew] = (function(n) {
                return function(i) {
                  (i = i || Hu[Us]), i[Ls](), ft(n);
                };
              })(s)),
              jf.fls[ds](c),
              t[ho](c));
          switch (jf.fls[rs]) {
            case 3:
              S(of[u + 2]) || (of[u + 2] = H(of[u + 2], $([Cp, Am, Bp, mm, Kl, mb, Hl, pb, gv, 2]))), ii(of, u + 2, cc);
            case 2:
              S(of[u + 1]) || (of[u + 1] = H(of[u + 1], $([Cp, Am, Bp, mm, Kl, mb, Hl, Sm, gv, 2]))),
                ii(of, u + 1, cc),
                S(of[u + 0]) || (of[u + 0] = H(of[u + 0], $([Cp, Am, Bp, mm, Kl, mb, Hl, om, gv, 2]))),
                ii(of, u + 0, cc);
              break;
            case 1:
              S(of[u + 0]) || (of[u + 0] = H(of[u + 0], $([Cp, Am, Bp, mm, Kl, mb, Hl, pb, gv, 2]))), ii(of, u + 0, cc);
          }
          for (s = 0; s < 3; s++)
            e(jf.fls[s]) ||
              ((c = jf.fls[s]),
              Y(
                c,
                J([
                  vp,
                  bp,
                  ag,
                  Xb + (s + 1),
                  Cp,
                  of[u + s + Cp] + nd,
                  Bp,
                  of[u + s + Bp] + nd,
                  Kl,
                  of[u + s + Kl] + nd,
                  Hl,
                  of[u + s + Hl] + nd,
                ])
              ));
        }
        if (!e(of[Dc]) || of[Zo + kh]) {
          if (Vr) {
            if (
              ((f = jf.fvi = e(jf.fvi2) ? R($f) : jf.fvi2),
              (f[us] = of[Zo + kh] ? (of[mu] ? of[wu].v : Cr[$f]) : of[Dc]),
              O() ? _(f, Rw) : 2 === jf.ast && _(f, Pw, Cr[Pw]),
              Z(o),
              of[gu] || ((f[zh] = 0), (f[Jh] = !0)),
              t[ho](f),
              of[Zo + kh])
            )
              return zu[ho](i), of[gu] && wt(), void ot();
            Qi(), l(f[ko], Tw) || of[gu] ? (of[bw] = !0) : ti(f, Zi);
          } else {
            (f = jf.fvi = R(ro)), (f[us] = Cr[Pw]);
            var d =
              of[Dc] +
              $([
                Au,
                Kr,
                ku,
                Mr,
                Eu,
                of[ac],
                _u,
                Ur,
                Ru,
                cc + Ks + jr + Ks + $f + Ks,
                Cu,
                h(of[Dc]),
                Pu,
                h(is),
                Uu,
                Bf,
                ju,
                n(),
              ]);
            if (V()) {
              var v = R(fo);
              _(v, Zu, d + n()), v[ho](f), t[ho](v);
            } else
              (f[Ew] = function(i) {
                (i = i || Hu[Us]), i[Ls](), Hu[_l](ui(d + n(), cc + Ks + mh, of[ac]));
              }),
                t[ho](f);
          }
          for (s = 0; s < bn(of[wg])[rs]; s++)
            (a = of[wg][bn(of[wg])[s]]),
              (c = a[ao] = R(eo)),
              Y(c, J([Cp, a[Cp] + Os, Bp, a[Bp] + Os, tg, rn(a[Lc]), ag, Yb, vp, bp], yf)),
              0 !== a[Yl] && Q(c),
              e(a[Sh]) ||
                (c[Ew] = (function(n) {
                  return function(i) {
                    (i = i || Hu[Us]), i[Ls](), e(n[Rh]) || di(n[Rh]), Hu[_l](n[Sh]);
                  };
                })(a)),
              t[ho](c);
          if (S(of[Dc])) ii(of, Dc, cc);
          else {
            var p, b, g, w;
            jf.fls[rs] > 0 ? ((p = Tm), (b = Nm), (g = cm), (w = hm)) : ((p = Im), (b = gb), (g = 0), (w = _m)),
              (of[Dc + Bp] = p),
              (of[Dc + Cp] = b),
              (of[Dc + Hl] = g),
              (of[Dc + Kl] = w);
          }
          Y(
            f,
            J([
              vp,
              bp,
              ag,
              Xb + 5,
              Cp,
              of[Dc + Cp] + nd,
              Bp,
              of[Dc + Bp] + nd,
              Kl,
              of[Dc + Kl] + nd,
              Hl,
              of[Dc + Hl] + nd,
            ])
          ),
            q() && (of[Dc + Bp] < hb || of[Dc + Cp] < wb) && _(f, Pw, Cr[Pw]);
        } else of[bw] = !0;
        zu[ho](i), jf.fsm === Ha || (jf.fsm === za && l(f[ko], Tw)) ? At(of[gu] ? wt : nt) : jf.fsm === uw && xt();
      }
      function Ji() {
        jf.fst = [];
        for (var n = 0; n < Of[rs]; n++) jf.fst[ds](Of[n][Ql]);
        Hu[dd](Fa, $i, !1);
      }
      function $i() {
        var n,
          i = Hu[Nl] ? Hu[Nl] : zu[Ll],
          t = Hu[jp];
        if (e(of[bw]) || of[bw]) {
          for (n = 0; n < jf.fst[rs]; n++)
            if (i + t > jf.fst[n]) {
              jf.fst[ls](n, 1), At(of[gu] ? wt : nt);
              break;
            }
          0 === jf.fst[rs] && Hu[vd](Fa, $i, !1);
        }
      }
      function Qi() {
        var n,
          i = jf.fvi;
        vi(of),
          e(jf.lns) && (jf.lns = []),
          F() &&
            (jf.fbt = sn(function() {
              jf.lns.fpteTimeUpdate();
            }, kb)),
          (jf.lns.fpteTimeUpdate = function() {
            (n = i[os]),
              n > 0 && of[no + Ug] ? nt() : of[no + Ug] || i[Xg](),
              n < 1 && j() && !Yn() && On(),
              n < of[Qg] && n > 0
                ? di(of[qg + Th], qg, of)
                : n < of[ih] && n >= of[Qg]
                ? di(of[Qg + Th], Qg, of)
                : n < of[rh] && n >= of[ih]
                ? di(of[ih + Th], ih, of)
                : n < of[ch] && n >= of[rh]
                ? di(of[rh + Th], rh, of)
                : n < of[cs] - 1 && n >= of[ch] && di(of[sh + Th], sh, of);
          }),
          (jf.lns.fpteEnded = function() {
            dn(jf.fbt), di(of[sh + Th], sh, of), of[mu] ? yt() : ki(i, of);
          }),
          i[dd](ia, jf.lns.fpteTimeUpdate, !1),
          i[dd](ah, jf.lns.fpteEnded, !1);
      }
      function Zi() {
        if (of[Zo + kh]) return void at();
        var n = jf.fvi,
          i = jf.fsm;
        jf.ast || (P() && !O()) || N() || (j() && !Yn())
          ? n[qa]()
          : (O() || (n[qg](), n[Xg]()), (of[bw] = !0), i === za && of[no + Ug] && n[qg]()),
          Jn() && !Yn() && e(of[bw])
            ? ((of[bw] = !1),
              (n[Mh] = function() {
                (of[bw] = !0), i === za && of[no + Ug] && nt();
              }))
            : j() && !Yn() && !Jn() && of[no + Ug]
            ? nt()
            : i === za && of[no + Ug]
            ? jf.ast || (P() && !O) || q()
              ? nt()
              : N() && n[qg]()
            : of[no + Ug] || At(Zi);
      }
      function nt(n, i) {
        function t() {
          u(p[cs]) ||
            (p[os] + lb < +p[cs] - 0.5
              ? ((p[os] += lb), (e(of[wu]) || p[us] !== of[wu].v) && jf.lns.fpteTimeUpdate())
              : (dn(jf.ff), e(of[wu]) || p[us] === of[wu].v || yt(t)));
        }
        if (jf.fw[up][kp] !== xp && !0 !== jf.fclsd) {
          var r,
            o,
            a,
            s = jf.fw,
            d = jf.fc,
            v = jf.fm,
            p = jf.fvi;
          (jf.fvm = c(n) || f(i)),
            of[Zo + kh]
              ? (Z(s), W([s, d], fp, [1, 0]), at(n, i))
              : (Z(s),
                it(),
                di(of[uc + Fg + Th], uc + Fg, of, bf, p),
                !e(of[Dc]) &&
                  Vr &&
                  (un(function() {
                    (of[Ua] !== mh && 'cpc' !== of[Ua]) || 2 === jf.ast || (N() && q()) || (j() && !Yn() && !Jn())
                      ? (p[Ew] = function(n) {
                          (n = n || Hu[Us]),
                            n[Ls](),
                            xi(p, of),
                            p[qg](),
                            dn(jf.ff),
                            p[dd](
                              qw,
                              function() {
                                of[Jd + $h] || ((of[Jd + $h] = !0), di(of[Jd + Th], bf, bf, bf, p));
                              },
                              !1
                            );
                        })
                      : (p[Ew] = function(n) {
                          (n = n || Hu[Us]), n[Ls](), ft(ca);
                        });
                  }, Ob),
                  xn() < 64
                    ? ((p[zh] = +!of[Jh]), (p[Jh] = of[Jh]), en(v, of[Jh] ? Cr[Gh] : Cr[Yh]))
                    : xn() > 63 && en(v, Cr[Gh]),
                  di(of[Og + Th], Og, of, bf, p),
                  j() || (0 !== p[zh] && !p[Jh]) || di(of[Gh + Th], Gh, of, bf, p),
                  (v[Ew] = function(n) {
                    (n = n || Hu[Us]),
                      n[Ls](),
                      (j() && !Jn()) || q()
                        ? p[qg]()
                        : (!j() && (p[zh] > 0 || !p[Jh])) || ($n() && !p[Jh])
                        ? ((p[zh] = 0), (p[Jh] = !0), en(v, Cr[Gh]), di(of[Gh + Th], Gh, of, bf, p))
                        : ((p[zh] = 1),
                          (p[Jh] = !1),
                          en(v, Cr[Yh]),
                          di(of[Yh + Th], Yh, of, bf, p),
                          Jn() &&
                            !Yn() &&
                            (dn(jf.ff),
                            p[qg](),
                            en(v, Cr[Gh]),
                            of[Wd + $h] || ((of[Wd + $h] = !0), di(of[Wd + Th], bf, bf, bf, p))));
                  }),
                  (j() && !Yn()) || q() || 2 === jf.ast
                    ? Jn() &&
                      (Vn(s),
                      (jf.ff = sn(t, 33)),
                      p[dd](
                        qw,
                        function() {
                          (p[Jh] = !0),
                            en(v, Cr[Gh]),
                            (jf.ff = sn(t, 33)),
                            of[Jd + $h] || ((of[Jd + $h] = !0), di(of[Jd + Th], bf, bf, bf, p));
                        },
                        !1
                      ))
                    : f(p[qg]) && (p[qg](), l(es, 'Android 4.1') && jf.ast && Hn(!1, !0))),
                un(function() {
                  (of[mh + Ev] = !0),
                    (d[Ew] = function(n) {
                      (n = n || Hu[Us]), n[Ls](), ft();
                    });
                }, Ob)),
            jf.fvm &&
              ((r = jf.feb = R(eo)),
              Y(r, J([Bp, Pm, ig, gg, Mp, 'solid 1px #fff', Mp + Ms + Wl, _p, vp, mp, Kl, 20 + nd, Wl, 0])),
              (o = jf.fem = R('p')),
              (o[fs] = Tl + Qs + Qh),
              Y(
                o,
                J([
                  hg,
                  Pm,
                  Bp,
                  Pm,
                  vg,
                  bm,
                  dg,
                  'helvetica, sans serif',
                  lg,
                  kb,
                  Ea,
                  Zb,
                  pg,
                  gm,
                  Gp,
                  Ul,
                  kp,
                  Ip + Ms + xp,
                  Ap,
                  hp,
                ])
              ),
              (a = jf.fec = R(eo)),
              Y(a, J([Cp, Pm, Bp, Pm, tg, rn(Cr[Yd + El]), kp, Ip, ql, Wl, rg, bm, Gp, Ul], wf)),
              r[ho](o),
              r[ho](a),
              s[ho](r),
              un(function() {
                (o[up][Cp] = o[Np] - 19 + Os),
                  Cn(o, Cp, 0, -2, bf, 1, function() {
                    Cn(o, zp + Gl, 0, -2);
                  });
              }, Kb),
              (r[Ew] = function() {
                _t(n, i);
              }));
        }
      }
      function it() {
        et(),
          (jf.frr = sn(function() {
            et();
          }, 125)),
          Hu[dd](td, et, !1);
      }
      function tt() {
        dn(jf.frr), Hu[vd](td, et, !1);
      }
      function et(n) {
        var i,
          t,
          r,
          f = !e(n) && +n === n,
          o = f ? Df[n] : {},
          c = f ? o[xc] : of,
          a = f ? o[vy] : jf.fw,
          s = f ? o[ly] : jf.fc,
          d = s[Np],
          v = s[Lp],
          l = f ? (e(o[ay]) ? [] : o[ay]) : e(jf.fls) ? [] : jf.fls,
          p = !e(c[ja]) && c[ja],
          b = f ? !e(o[sy]) && o[sy] : !e(jf.fvi) && jf.fvi,
          m = Sb,
          g = Cb,
          h = ni(),
          w = v,
          y = d,
          A = f ? 'ifsf' : 'fsf',
          k = jf.fcf;
        if (
          (jf.fvm && (W([a, jf.fm], [$p, Wl], [Qb, fm]), Q(jf.fcl)),
          (h[Bp] < g && v > h[Bp]) || (h[Cp] < m && d > h[Cp]) || p
            ? p && (h[Bp] === v || h[Cp] === d) && d <= h[Cp] && v <= h[Bp]
              ? ((w = v), (y = d))
              : (j() && (jf[A] = !1), (w = h[Bp]), (y = (m / g) * w) > h[Cp] && ((y = h[Cp]), (w = (g / m) * y)))
            : ((h[Bp] >= v && v < g) || (h[Cp] >= d && d < m)) &&
              ((i = h[Bp] > g ? g : h[Bp]),
              (t = h[Cp] > m ? m : h[Cp]),
              (w = i),
              (y = (m / g) * w) > t && ((y = t), (w = (g / m) * y))),
          (d === y && v === w) ||
            ((d = y),
            (v = w),
            W(s, [Cp, Bp], [d, v], [1, 1]),
            c[ib] && k && W(k, [Cp, Bp, Kl, Hl], [d, v, 0, 0], [1, 1, 0, 0])),
          bn(c[wg])[rs])
        ) {
          var x,
            _,
            E,
            T = {
              topleft: b[$l],
              bottomleft: b[$l],
              topright: d - (b[$l] + b[Np]),
              bottomright: d - (b[$l] + b[Np]),
              topoffset: b[Ql],
              bottomoffset: b[Ql] + b[Lp],
            };
          for (r = 0; r < bn(c[wg])[rs]; r++)
            (_ = c[wg][bn(c[wg])[r]]),
              (E = _[ao]),
              (_[Yl] <= b[os] || 0 === _[Yl]) && (_[cs] >= b[os] || 0 === _[cs])
                ? ((x = (u(+_[_g]) ? _[_g] : Kl) + (u(+_[xg]) ? _[xg] : Hl)),
                  W(
                    E,
                    [kp, u(+_[xg]) ? _[xg] : Hl, u(+_[_g]) ? _[_g] : Kl],
                    [xp, (u(+_[xg]) ? 0 : +_[xg]) + T[x], u(+_[_g]) ? T[_[_g] + Yl] : +_[_g] + T[Kl + Yl]],
                    [0, 1, 1]
                  ),
                  (T[x] += _[Cp] + (u(+_[xg]) ? 0 : +_[xg])),
                  e(_[Ww]) || _[Rl + $h] || ((_[Rl + $h] = !0), di(_[Ww], bf, bf, bf, b)))
                : Q(E);
        }
        if ((!0 === jf.ast || (j() && p)) && (e(jf[A]) || !jf[A])) {
          for (jf[A] = !0, r = 0; r < l[rs]; r++)
            Q(l[r]),
              (function(n) {
                un(function() {
                  Z(l[n]);
                }, gb);
              })(r);
          !1 !== b &&
            (Q(b),
            un(function() {
              Z(b);
            }, gb));
        }
      }
      function rt() {
        jf.fclsd = !0;
        var n = jf.fvi;
        !e(jf.fst) && jf.fst[rs] > 0 && Hu[vd](Fa, $i, !1),
          dn(jf.ff),
          e(of[Dc]) ||
            !a(n[Jg]) ||
            n[Jg] ||
            (n[Xg](), (n[us] = ''), n[qa](), n[vd](ia, jf.lns.fpteTimeUpdate, !1), n[vd](ah, jf.lns.fpteEnded, !1)),
          tt(),
          Q(jf.fw);
      }
      function ft(n) {
        if (of[mh + Ev]) {
          n = !e(n) && n;
          var i = ic + Ih,
            t = Ks + vc + Ks,
            r = '',
            f = of[Sh],
            o = jf.fvi;
          if (
            (!1 === n
              ? (t += mh)
              : n === ca
              ? ((t += mh), (r = of[Dc]))
              : ((t += Oc + Ms + mh + Ms + (n + 1)),
                (i += Av + (n + 1)),
                e(of[cc + Ph + n]) || si(ui(of[cc + Ph + n], t, of[ac], bf, o)),
                (f = e(of[cc + Bh + n]) ? f : of[cc + Bh + n])),
            !e(f))
          ) {
            if (
              (si(ui(fi(Cv, of[ac], Pv + Ks + cc + Ks + jr + t, r, of), t, of[ac])),
              De(of, i),
              (!1 !== n && n !== ca) || di(of[mh + Th]),
              !e(of[Dc]) && N() && !q() && !o[Jg])
            )
              var c = sn(function() {
                qu[hp] || (dn(c), o[qg]());
              }, _b);
            Hu[_l](ui(f, t, of[ac], bf, o));
          }
        }
      }
      function ot() {
        var n, i, t;
        (n = jf.fvf = R(to)),
          Y(n, sb),
          zu[ho](n),
          (i = n[ws + Xu]),
          (t = i[Mu]),
          t[_l]()[Yu]('<script src="' + ui(of[Zo + kh]) + '"></script>'),
          t[El](),
          st(),
          f(i[ny])
            ? ((of[Zo] = i[ny]()), ct())
            : (of[Zo + na] = sn(function() {
                try {
                  f(i[ny]) && ((of[Zo] = i[ny]()), e(of[Zo]) || (dn(of[Zo + na]), ct()));
                } catch (n) {}
              }, gb));
      }
      function ct() {
        dt();
        var n,
          i,
          t,
          r = of[Zo],
          f = jf.fm,
          o = jf.fcl,
          c = jf.fvi;
        if (e(r) || !je(r) || m(r[tv + jd](Wf)) > 2) return void ut();
        (of[Zo + hv] = Ns),
          of[gu] || ((c[Jh] = !!$n() || !c[zh]), en(f, Yn() ? Cr[Rv] : c[Jh] || (j() && !$n()) ? Cr[Gh] : Cr[Yh])),
          $n() && (c[qg + uo + Sp] = !0),
          Q(f),
          W(f, Fl, 3),
          (f[Ew] = function() {
            if (!Yn()) {
              var n = (0 === c[zh] && c[Jh]) || ($n() && c[Jh]) ? 1 : 0;
              of[Zo + hv] === Tv
                ? ((c[Jh] = !n),
                  en(f, n ? Cr[Yh] : Cr[Gh]),
                  r[so + Qh + Hh](+n),
                  di(of[(n ? Yh : Gh) + Th], n ? Yh : Gh, of, bf, c))
                : !j() || l(c[us], Cr[$f]) || (!e(of[wu]) && l(c[us], of[wu].v))
                ? ((l(c[us], Cr[$f]) || (!e(of[wu]) && l(c[us], of[wu].v)) || of[Zo + hv] === Sv) &&
                    '' !== i[fs] &&
                    (j() && !$n() && (n = l(f[up][Yp], Cr[Gh]) ? 1 : 0),
                    (of[Gh + na] = un(function() {
                      (c[Jh] = !n),
                        (c[zh] = n),
                        en(f, n ? Cr[Yh] : Cr[Gh]),
                        di(of[(n ? Yh : Gh) + Th], n ? Yh : Gh, of, bf, c);
                    }, gb))),
                  r[so + Qh + Hh](n))
                : ((n = l(f[up][Yp], Cr[Gh]) ? 1 : 0),
                  (c[Jh] = !n),
                  (c[zh] = n),
                  en(f, n ? Cr[Yh] : Cr[Gh]),
                  di(of[(n ? Yh : Gh) + Th], n ? Yh : Gh, of, bf, c));
            }
          }),
          W(o, Fl, 3),
          (o[Ew] = function() {
            (of[El + Yg] = !0), l(of[Zo + kh], jv) ? r[Xg + Qh]() : r[Vs + Qh](), c[Xg](), lt(), Q(jf.fw);
          }),
          Y(c, J([Cp, Om, Gp, Ul, ag, 1], hf)),
          (n = jf.fvw = R(eo)),
          (n[ko] = Zo + eu),
          Y(n, J([Cp, Om, Bp, c[Lp] + Os, ag, 2, Gp, Ul], hf)),
          (i = jf.fvs = R(eo)),
          (i[ko] = Zo + ov),
          Y(i, J([Cp, Om, Bp, Om, vp, pp, ag, 3])),
          n[ho](i),
          jf.fc[ho](n),
          Vn(jf.fc[Bo]),
          e(jf.fvi2) && ((t = jf.fvi2 = R($f)), (t[us] = Cr[$f])),
          of[gu] || (jf.fsm === uw ? xt() : l(c[ko], Tw) || (of[gu] && !of[mu]) ? at() : (ti(t), ti(c, Zi)));
      }
      function at(n, i) {
        var t,
          r = jf.fw,
          f = of[Zo],
          o = {},
          c = {};
        (Dy = n),
          (Oy = i),
          (o[Qh + iv] = e(of[uc + iv]) ? '' : of[uc + iv]),
          (c[fv] = jf.fvs),
          (c[$f + ov] = jf.fvi),
          (c[$f + ov + Fh + jl + Kg] = !of[gu]),
          e(n) && e(i) && !of[gu] && (W(r, fp, 0), r[vd](Lh, _n, !1), Z(r)),
          (t = pt(!0)),
          bt();
        try {
          st(), f[Ep + Qh](t[Cp], t[Bp], cv, Cy, o, c);
        } catch (a) {
          ut();
        }
      }
      function ut(n) {
        var i = of[Zo],
          t = jf.fw,
          e = jf.fvf;
        lt(), dt(), of[Zo + sd] && Ue(of[Zo + sd], i, iy), jf.fsm === uw && _t(Dy, Oy);
        try {
          i[Ca + Qh](), i[Vs + Qh]();
        } catch (n) {}
        nr(of, !1, kn(n) ? kn(n) : Lb, c(n) ? n : bf),
          e && (Q(t), T(t), (jf.fla = bf), T(e), (e = bf)),
          un(function() {
            ir(Zr, nf, tf, ef, cc);
          }, Py);
      }
      function st() {
        dt(), (of[Zo + Lg + na] = un(ut, Py));
      }
      function dt() {
        dn(of[Zo + Lg + na]);
      }
      function vt() {
        lt(),
          (of[Zo + na] = sn(function() {
            var n = pt(),
              i = of[Zo];
            !e(n[Cp]) && f(i[td + Qh]) && i[td + Qh](n[Cp], n[Bp]);
          }, _b));
      }
      function lt() {
        dn(of[Zo + na]);
      }
      function pt(n) {
        var i,
          t,
          r,
          f,
          o,
          c,
          a = of[Zo],
          u = jf.fvi,
          s = u[Lp],
          d = jf.fw,
          v = jf.fc,
          l = v[up],
          b = jf.fvw,
          m = v[Np],
          g = v[Lp],
          h = Sb,
          w = Cb,
          y = Hu[Vp],
          A = Hu[jp],
          k = {},
          x = 3,
          _ = 4;
        return (
          e(b) || (t = b[up]),
          (n = !e(n) && n),
          (i = !n && a[vo + Qh + Aw]()),
          jf.fsm === uw && (W([d, jf.fm], [$p, Wl], [Qb, fm]), Q(jf.fcl)),
          A >= w && y >= h ? ((f = w), (r = h)) : ((f = A), (r = (h / w) * A) > y && ((r = y), (f = (w / h) * y))),
          (r = p(r)),
          (f = p(f)),
          (f === g && r === m && s === of[pv + Rp] && i === of[pv + Aw] && A === of[pv + Kd + Rp]) ||
            ((o = (A - f) / 2),
            i || (!n && !a[vo + Qh + Rd]()) || of[ib] ? ((c = f), of[Zo + hv] === Bv && (x = Yb)) : (c = s),
            of[ib] && W(u, [Cp, Bp], [r, f], [1, 1]),
            i || (_ += Yb),
            W([l, l, l, t, t, jf.fm, jf.fcl], [Xp, Cp, Bp, Bp, Fl, Fl, Fl], [o, r, f, c, x, _, _], [1, 1, 1, 1]),
            (k[Bp] = c),
            (of[pv + Aw] = i),
            (of[pv + Rp] = s),
            (of[pv + Kd + Rp] = A),
            (k[Cp] = r)),
          (u[Cp] = u[Np]),
          (u[Bp] = u[Lp]),
          k
        );
      }
      function bt() {
        function n() {
          (j() && !$n()) || en(c, a[zh] ? Cr[Yh] : Cr[Gh]),
            Ue(of[Zo + sd], t, iy),
            (a[us] = of[wu].v),
            a[qa](),
            (a[Ew] = ''),
            Q(o),
            Fe(of[wu]),
            of[Zo + hv] === Iv && tn(a),
            !j() || Yn() || $n()
              ? ((c[Ew] = function() {
                  var n = (0 === a[zh] && a[Jh]) || ($n() && a[Jh]) ? 1 : 0;
                  (a[Jh] = !n), (a[zh] = n), en(c, n ? Cr[Yh] : Cr[Gh]);
                }),
                a[qg]())
              : ((c[Ew] = function() {
                  gt();
                  var n = function() {
                    a[vd](qw, n, !1), a[ah] || mt();
                  };
                  a[dd](qw, n, !1), a[pv + Kg]();
                }),
                mt()),
            a[dd](
              ah,
              function() {
                Q(jf.fw), ki(a), lt();
              },
              !1
            ),
            dt();
        }
        var i = (of[Zo + sd] = {}),
          t = of[Zo],
          f = jf.fvs,
          o = jf.fvw,
          c = jf.fm,
          a = jf.fvi,
          u = 0;
        (i[Qh + Ug] = function() {
          st(),
            j()
              ? $n() &&
                '' !== f[fs] &&
                (j() && $n() && !of[gu] && (en(c, Cr[Gh]), t[so + Qh + Hh](0), (a[Jh] = !0), (a[zh] = 0)), Z(c))
              : (of[gu] || t[so + Qh + Hh](0),
                C() ||
                  !(l(a[us], Cr[$f]) || (!e(of[wu]) && l(a[us], of[wu].v))) ||
                  f[fs] ||
                  (en(c, +t[vo + Qh + Hh]() ? Cr[Yh] : Cr[Gh]),
                  Z(c),
                  (c[Ew] = function() {
                    en(c, +!t[vo + Qh + Hh]() ? Cr[Yh] : Cr[Gh]), t[so + Qh + Hh](+!t[vo + Qh + Hh]());
                  }))),
            !j() ||
              Yn() ||
              $n() ||
              ((a[pv + Kg] = a[qg]),
              (a[qg] = function() {
                (c[Ew] = function() {
                  gt();
                  var n = function() {
                    a[vd](qw, n, !1), a[ah] || (mt(), wn([Mg, !1, !0], a));
                  };
                  a[dd](qw, n, !1), a[pv + Kg]();
                }),
                  Z(c),
                  wn([Mg, !1, !0], a),
                  mt();
              })),
            t[Hg + Qh]();
        }),
          (i[Qh + Wg] = function() {
            dt(),
              vt(),
              l(a[us], Cr[$f]) || (!e(of[wu]) && l(a[us], of[wu].v))
                ? (nn(a), '' === f[fs] ? ((of[Zo + hv] = Iv), Q(o)) : (of[Zo + hv] = Sv), Z(c), tn(c))
                : (a[dd](ia, function() {
                    a[os] > 0.2 && ht();
                  }),
                  l(of[Zo + kh], '//imasdk.googleapis.com/')
                    ? ((of[Zo + hv] = Uc), W([c, jf.fcl], Fl, zb))
                    : ((of[Zo + hv] = Bv), W(o, Fl, zb)),
                  Z(c),
                  tn(c)),
              of[Zo + hv] === Sv &&
                of[gu] &&
                (en(c, t[by + Hh]() ? Cr[Yh] : Cr[Gh]), (a[zh] = t[by + Hh]()), (a[Jh] = !!t[by + Hh]()));
          }),
          (i[Qh + ph] = function() {
            of[Vs] ||
              (of[uc + Fg + $h]
                ? of[mu] && !of[El + Yg]
                  ? n()
                  : (jf.fsm === uw && _t(Dy, Oy), Q(jf.fw), lt())
                : ut()),
              (of[Vs] = !0);
          }),
          (i[Qh + Aw + av] = function() {
            t.getAdExpanded() ? (lt(), gt()) : (vt(), mt());
            var n = pt();
            t[td + Qh](n[Cp], n[Bp]);
          }),
          (i[Qh + sv + Zc + av] = function() {
            of[Zo + hv] === Sv && '' !== jf.fvs[fs] && ht();
          }),
          (i[Qh + Hh + av] = function() {
            if (!Yn()) {
              dn(of[Gh + na]), Z(jf.fm);
              var n = t[vo + Qh + Hh]();
              (j() && n === +a[Jh]) ||
                ((a[Jh] = !n),
                (a[zh] = n),
                en(c, n ? Cr[Yh] : Cr[Gh]),
                di(of[(n ? Yh : Gh) + Th], n ? Yh : Gh, of, bf, a));
            }
          }),
          (i[Qh + Lg] = function(i) {
            of[mu] && of[gu] && !of[El + Yg] ? un(n, _b) : (di(of[Vg + Th], Vg, of, Lb, a), ut(i));
          }),
          (i[Qh + Ih + wh] = function(n, i, t) {
            e(n) ||
              r(n) ||
              (gt(),
              di(of[mh + Th], mh, of, bf, a),
              si(ui(fi(Cv, of[ac], Pv + Ks + cc + Ks + jr + Ks + $f + Ks + Zo + Ms + mh, n, of), Zo + Ms + mh, of[ac])),
              De(of, ic + nc + Ih),
              t && !e(n) && Hu[_l](n));
          }),
          (i[Qh + Fg] = function() {
            u++,
              u > 1 && ((of[Zo + hv] = Tv), tn(a)),
              of[Zo + hv] !== Sv || of[gu] || t[so + Qh + Hh](0),
              di(of[uc + Fg + Th], uc + Fg, of, bf, a),
              nr(of, !0),
              di(of[Og + Th], Og, of, bf, a),
              1 === of[ml] &&
                Ln(
                  ui(
                    '//c.fqtag.com/tag/implement-r.js?org=FRP3bBoRc8yjb59flhkI&p=' +
                      Kr +
                      Ms +
                      Mr +
                      '&a=' +
                      Kr +
                      Ms +
                      Mr +
                      Ms +
                      qr[xy] +
                      '&cmp=' +
                      of[Cv + Do] +
                      '&fmt=video&rd=' +
                      h(is) +
                      '&rt=display&sl=1&fq=1&ad=' +
                      jf.fw[No] +
                      '%%fqpb%%',
                    Og,
                    of[No]
                  )
                );
          }),
          (i[Qh + Qf + Gg] = function() {
            of[Zo + hv] === Sv && a[up][gp] === hp && tn(a),
              di(of[qg + Th], qg, of, bf, a),
              un(function() {
                ht();
              }, Nb);
          }),
          (i[Qh + Qf + nh] = function() {
            di(of[Qg + Th], Qg, of, bf, a);
          }),
          (i[Qh + Qf + eh] = function() {
            di(of[ih + Th], ih, of, bf, a);
          }),
          (i[Qh + Qf + oh] = function() {
            di(of[rh + Th], rh, of, bf, a);
          }),
          (i[Qh + Qf + dh] = function() {
            di(of[sh + Th], sh, of, bf, a);
          }),
          (of[Zo + sd] = i),
          Ue(i, t, rv);
      }
      function mt() {
        var n = jf.fvi;
        !j() ||
          Yn() ||
          $n() ||
          l(n[us], Cr[$f]) ||
          (gt(),
          (of[qg + na] = sn(function() {
            (n[os] += lb), wn([ia, !1, !0], n), n[os] + 0.2 >= p(n[cs]) && (gt(), wn([ah, !1, !0], n));
          }, 33)));
      }
      function gt() {
        dn(of[qg + na]);
      }
      function ht() {
        var n = jf.fvi,
          i = jf.fw,
          t = jf.fc;
        1 != i[up][fp]
          ? (W(i, fp, 1),
            i[dd](Lh, _n, !1),
            !C() ||
              l(n[us], Cr[$f]) ||
              (!e(of[wu]) && l(n[us], of[wu].v)) ||
              '' === jf.fvs[fs] ||
              !0 !== jf.ast ||
              !l(es, 'Android 4.4') ||
              (nn(n),
              un(function() {
                tn(n);
              }, gb),
              (n[Jh] = l(jf.fm[up][Yp], Cr[Gh])),
              (n[zh] = +!n[Jh])))
          : e(Dy) || e(Oy) || 1 == t[up][fp] || W(t, fp, 1);
      }
      function wt() {
        var n,
          i = jf.fm,
          t = jf.fvi,
          e = of[mu] ? of[wu].f : Cr[Pw];
        z(e),
          (t[Jh] = of[Jh]),
          (t[zh] = +!of[Jh]),
          en(i, of[Jh] ? Cr[Gh] : Cr[Yh]),
          jf.ast && (t[Pw] = Cr[Rv]),
          (n = jf.fcf = R(eo)),
          Y(n, J([vp, bp, tg, rn(e), rg, l(e, Ga) ? ib : tb, ag, of[Zo + kh] ? 2 : Xb + 9], wf + (of[gu] ? gf : ''))),
          q() && en(n, Cr[Rv]),
          of[ib] && X(n, J([Kl, 0, Hl, 0, Cp, Jm, Bp, $m])),
          Vn(jf.fw),
          Q(i),
          j() &&
            !Yn() &&
            ($n() && !of[Zo + kh] && ((t[Jh] = !1), (t[zh] = 1)),
            t[dd](
              qw,
              function() {
                Z(n);
              },
              !1
            )),
          (n[Ew] = function() {
            Q(n), Z(i), of[mu] && (en(n, Cr[Pw]), (of[ib] = !1)), of[Zo + kh] ? (t[qa](), at()) : t[qg]();
          }),
          (i[Ew] = function() {
            t[Jh]
              ? ((t[Jh] = !1), (t[zh] = 1), en(i, Cr[Yh]), di(of[Yh + Th], Yh, of, bf, t))
              : ((t[Jh] = !0), (t[zh] = 0), en(i, Cr[Gh]), di(of[Gh + Th], Gh, of, bf, t));
          }),
          jf.fc[ho](n),
          of[mu] ||
            t[dd](
              ah,
              function() {
                nn(n);
              },
              !1
            ),
          t[dd](
            Cg + Ng,
            function() {
              it(),
                un(
                  function() {
                    Z(jf.fw);
                  },
                  of[gu] ? Nb : 0
                ),
                di(of[uc + Fg + Th], uc + Fg, of, bf, t);
            },
            !1
          ),
          of[Zo + kh] && !of[gu] && W(n, Fl, 2),
          t[qa]();
      }
      function yt(n) {
        var i = jf.fvi;
        i[vd](ia, jf.lns.fpteTimeUpdate, !1),
          i[vd](ah, jf.lns.fpteEnded, !1),
          (of[Gh + $h] = of[Yh + $h] = !0),
          (i[us] = of[wu].v),
          Fe(of[wu]),
          i[qa](),
          Jn() && !Yn()
            ? (f(n) ? (jf.ff = sn(n, 33)) : i[qg](),
              i[dd](
                ah,
                function() {
                  ki(i);
                },
                !1
              ))
            : i[qg](),
          of[gu] &&
            i[dd](
              ah,
              function() {
                nn(jf.fcf);
              },
              !1
            );
      }
      function At(n) {
        var i,
          t = 0,
          r = 0,
          f = 0,
          o = function() {
            r++;
          };
        for (e(of[Mc]) || (t++, kt(of[Mc], o)); f < 3; f++) e(of[cc + mo + f]) || (t++, kt(of[cc + mo + f], o));
        i = sn(function() {
          r === t && (dn(i), (of[no + Ug] = !0), e(n) || n());
        }, 25);
      }
      function kt(n, i) {
        function t() {
          !1 === r && ((r = !0), i());
        }
        var e = new Image(),
          r = !1;
        (e[Ha] = t), (e[gy] = t), (e[us] = n);
      }
      function xt(n) {
        z(Cr[Yd + El]);
        var i,
          t,
          r,
          o,
          a = [],
          u = [],
          s = [],
          p = [],
          b = Cc,
          m = 0;
        if (e(jf.fet)) {
          for (
            e(Hu[wy]) ? B(lf, Nu) && ((p = B(lf, Nu)), (p = p[vs](1, -1)[bs]($s))) : (p = Hu[wy]),
              d(p) || (p = []),
              p[ds](Hs + jw),
              B(lf, Du) && (((b = B(lf, Du)) === Ou && b === Fu) || (b = Cc)),
              i = qu[Mo](fo);
            m < i[rs];
            m++
          )
            a[ds](i[m]);
          for (m = 0; m < a[rs]; m++)
            if (((r = a[m]), (b === Fu && !jy(r[Zu])) || (b === Ou && jy(r[Zu])))) a[ls](m, 1), m--;
            else
              for (o = 0; o < p[rs]; o++)
                (t = p[o]),
                  ((0 === v(t, Hs) && l(r[ko], t[Rs](1))) ||
                    (0 === v(t, id) && l(r[No], t[Rs](1))) ||
                    x(r, Zu) === t) &&
                    (a[ls](m, 1), m--);
        } else a = jf.fet;
        for (m = 0; m < a[rs]; m++)
          (r = a[m]),
            c(r[Zu]) && (s[m] = r[Zu]),
            f(r[Ew]) && (u[m] = r[Ew]),
            e(n)
              ? (r[Ew] = (function(n, i) {
                  return function() {
                    nt(n, i);
                  };
                })(r[Zu], r[Ew]))
              : (r[Ew] = (function(i, t) {
                  return function() {
                    n(i, t);
                  };
                })(r[Zu], r[Ew])),
            (r[Zu] = id);
        e(jf.fet) && ((jf.fet = a), (jf.fel = s), (jf.feo = u));
      }
      function _t(n, i) {
        var t,
          r = jf.fet,
          o = jf.fel,
          a = jf.feo,
          u = 0;
        for (t = Hu[Us], e(t) || t[Ls](); u < r[rs]; u++)
          _(r[u], Zu, c(o[u]) ? o[u] : Sd), (r[u][Ew] = f(a[u]) ? a[u] : '');
        f(i) && i(), c(n) && (Hu[Qu][Zu] = n);
      }
      function Et(n) {
        function i() {
          jf.wff = !0;
        }
        function t() {
          jf.wff = !1;
        }
        var r,
          f,
          o,
          c,
          a = [];
        for (0 === n && 1 === Df[rs] && jf.bs === $c && T(Df[n]), r = 0; r < Kf[rs]; r++)
          if (((o = Kf[r]), (c = o[Ac]), (o[Jh] = !!e(o[Jh]) || o[Jh]), (o[Ra] = !e(o[Ra]) && o[Ra]), c === Cc))
            if (V() || L() || U()) (o[Ac] = _c), a[ds](o);
            else {
              if (Lr) o[Ac] = Ec;
              else if (Nr) o[Ac] = Sc;
              else {
                if (!Dr) continue;
                o[Ac] = Rc;
              }
              a[ds](o);
            }
          else
            ((c === _c && !N()) ||
              (!V() && !L() && !U() && ((c === Rc && Dr) || (c === Sc && Nr) || ((c === Ec || c === Tc) && Lr)))) &&
              a[ds](o);
        if (0 !== a[rs]) {
          for (Kf = a, 0 === Df[rs] ? (jf.bs = $c) : (jf.bs = pw), r = 0; r < Kf[rs]; r++)
            if (Kf[r][Ac] === Rc && Kf[r][Ra]) {
              Kf = [Kf[r]];
              break;
            }
          if (!e(n) && Df[rs] > 0)
            (o = Df[n][xc] = mn(Kf[0])), oi(o), di(o[uc + Ug + Th], uc + Ug, o), o[Ra] || Kf[ls](0, 1);
          else if (e(n))
            for (r = 0, f = 0; r < Df[rs]; r++, f++)
              0 !== Kf[rs]
                ? ((f = f < Kf[rs] ? f : 0),
                  (o = Df[r].bAdvert = mn(Kf[f])),
                  oi(o),
                  di(o[uc + Ug + Th], uc + Ug, o),
                  o[Ra] || Kf[ls](f, 1))
                : (Bt([Df[r]]), r--);
          0 === Df[rs] ? It(Df) : Tt(Df), e(jf.wff) && ((jf.wff = !0), Hu[dd](rd, i, !1), Hu[dd](fd, t, !1));
        }
      }
      function Tt(n) {
        var i, t, e, r, f;
        for (i = 0; i < n[rs]; i++) {
          for (t = n[i], e = t[xc], r = e[Ac]; t[Bo]; ) t[Co](t[Bo]);
          (f = R(eo)),
            t[ho](f),
            r === Ec || r === Tc
              ? (Y(t, J([Qm, Xl, vp, bp, Kl, t[Ql] + Os, Hl, 0, ag, Hb])), r === Ec ? Ut(i) : jt(i))
              : (Y(t, J([ap, Xl])), r === _c ? Rt(i) : r === Sc ? Ct(i) : r === Rc && Pt(i));
        }
      }
      function It(n) {
        for (var i, t = R(eo), r = t[up], f = (t[xc] = Kf[0]), o = f[Ac], c = R(eo); t[Bo]; ) t[Co](t[Bo]);
        if (
          (W(c, vp, pp),
          (t[ko] = Uw),
          (Kf = []),
          Y(t, J([Qm, Xl, vp, mp, zl, o === Ec || o === Tc ? Pm : 0, Hl, 0, Wl, 0, ag, Hb])),
          o !== Ec && o !== Tc && !V() && (o !== Rc || q() || 2 === jf.ast))
        ) {
          var a = R(ro);
          (a[us] = Cr[El]),
            (a[Ew] = function(n) {
              (n = n || Hu[Us]), n[Ls](), St(n, 0);
            }),
            Y(a, J([vp, bp, ag, Fb, Kl, 0, Wl, 0, Cp, km, Bp, km])),
            e(f[ll]) || (W(a, Fl, $b), a[dd](jh, a[Ew]), a[dd](Lh, _n), a[dd](Vh, _n)),
            c[ho](a);
        }
        switch (
          (t[ho](c),
          r[vp] !== mp || V() || L()
            ? V() || L()
              ? ((V() || L()) &&
                  (Y(t, J([Qm, Xl, ag, Hb, vp, bp, Hl, 0, Wl, 0, Kl, 0])),
                  (i = zu[Dw][up]),
                  (i[Hp] = !s(b(i[Hp])) || e(i[Hp]) ? '65px' : b(i[Hp]) + 65 + Os),
                  Hu[Vl](0, 0)),
                zu[Lo](t, zu[Bo]))
              : (Y(t, J([Qm, Xl, vp, bp, Hl, 0, Wl, 0, ag, Hb])),
                zu[ho](t),
                (t[mp + na] = sn(function() {
                  r[Kl] = Hu[jp] + Hu[rp] - t[Lp] + Os;
                }, gb)))
            : zu[ho](t),
          A(Uw),
          oi(f),
          di(f[uc + Ug + Th], uc + Ug, f),
          o)
        ) {
          case _c:
            Rt(0);
            break;
          case Sc:
            Ct(0);
            break;
          case Rc:
            Pt(0);
            break;
          case Ec:
            Ut(0);
            break;
          case Tc:
            jt(0);
        }
      }
      function St(n, i) {
        (n = n || Hu[Us]), n[Ls]();
        var t,
          r = Df[i],
          f = r[xc];
        f[dw + $h] || ((f[dw + $h] = !0), di(f[dw + Th])),
          dn(r[mp + na]),
          Q(r),
          L() &&
            f[Ac] === _c &&
            ((t = zu[Dw][Ow][up]), (t[Hp] = !s(parseInt(t[Hp])) || e(t[Hp]) ? '0' : parseInt(t[Hp]) - 65 + Os));
      }
      function Bt(n) {
        var t = 0,
          r = n === Df;
        if ((!Mf || f(Hu[ec + i(yc) + Lg])) && !e(n)) {
          for (; t < n[rs]; t++) (n[t][ko] = ''), r && t--;
          r && Ze(9, yc);
        }
      }
      function Rt(i) {
        var t,
          r,
          f,
          o,
          c = Df[i],
          a = c[Bo],
          u = c[xc],
          s = a[up];
        if (
          (jf.bs === pw ? W(c, Fl, Fb) : W(c, Fl, Hb),
          e(u[Dc]) ||
            j() ||
            (u[Dc] = H(
              u[Dc],
              $([
                Au,
                Kr,
                ku,
                Mr,
                Eu,
                u[kc],
                _u,
                Ur,
                Ru,
                jf.bs + 'static_' + jr + Ks + $f + Ks,
                Cu,
                h(u[Dc]),
                Pu,
                h(is),
                Uu,
                Bf,
                ju,
                n(),
              ])
            )),
          (s[Gp] = tm),
          X(c, J([ig, e(u[$p]) ? cb : u[$p]])),
          X(a, J(ig, e(u[$p]) ? cb : u[$p])),
          c[Np] < Sb ? W(s, [Cp, Bp], [c[Np], 0.15625 * c[Np]], [1, 1]) : W(s, [Cp, Bp], [Sb, 50], [1, 1]),
          !e(u[ll]))
        )
          return W(a, Bp, Ul), void Ii(u, a, a[Np], bb, i);
        (t = a.bannerImg = R(ro)),
          (t[us] = e(u[ma]) ? (e(u[ba]) ? Cr.lm6_1 : u[ba]) : u[ma]),
          Y(t, J([Cp, s[Cp], Bp, s[Bp]])),
          a[ho](t),
          e(u[ma]) || e(u[ma + nw + Th]) || u[ma + nw + $h]
            ? e(u[ba]) || e(u[ba + nw + Th]) || u[ba + nw + $h] || ((u[ba + nw + $h] = !0), di(u[ba + nw + Th]))
            : ((u[ma + nw + $h] = !0), di(u[ma + nw + Th])),
          !e(u[Dc]) && (V() || (P() && !O()))
            ? ((r = R(fo)),
              _(r, Zu, u[Dc]),
              W(a, vp, pp),
              a[ho](r),
              Y(r, hf),
              (f = R(eo)),
              Y(f, J([vp, pp, Qm, Xl])),
              (o = R(fo)),
              _(o, Zu, ui(u[Sh], jf.bs + u[Ac] + Ks + jr + Ks + yc + Ks + mh + gh, u[kc])),
              (o[fs] = 'CLICK HERE TO LEARN MORE'),
              f[ho](o),
              a[Po][ho](f))
            : j() && !e(u[Dc])
            ? (yi(i),
              (jf.bvi[us] = H(u[Dc], 'node=' + i)),
              (a[Ew] = function() {
                jf.bvi[us] !== H(u[Dc], 'node=' + i) && (jf.bvi[us] = H(u[Dc], 'node=' + i)),
                  Xt(i),
                  (Df[i][Bo][Ew] = function() {
                    Yt(i);
                  });
              }))
            : e(u[Dc])
            ? (a[Ew] = function() {
                Gt(i, yc);
              })
            : (a[Ew] = function() {
                Zt(i);
              }),
          (u[Og + na] = sn(function() {
            !1 === u[uc + Fg + $h] && Mt(a) && (dn(u[Og + na]), di(u[uc + Fg + Th], uc + Fg, u));
          }, Nb));
      }
      function Ct(n) {
        function i(i) {
          (i = i || Hu[Us]),
            i[Ls](),
            dn(d.svbViewableTimer),
            Jn() && !Yn() && dn(d[ra]),
            o[Xg](),
            Xt(n, !0),
            en(c, Cr[Pw]),
            W(c, [Jp, Qp], [Rm, ib]),
            (c[Ew] = function(i) {
              (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
            });
        }
        var t,
          r,
          f,
          o,
          c,
          a,
          u = Df[n],
          s = u[Bo],
          d = u[xc];
        return (
          (u[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls]();
          }),
          jf.bs === pw ? W(u, Fl, Fb) : W(u, Fl, Hb),
          (t = e(d[$p]) ? cb : d[$p]),
          (r = e(d[ha]) ? Cr.accompany : d[ha]),
          X(u, ig + Fs + t),
          Y(s, J([Gp, tm, Cp, Jm, Bp, 0, Ap, hp, ig, t])),
          e(d[Ig])
            ? e(d[ll])
              ? ((f = u[fa] = R(eo)),
                Y(f, J([Bp, Fm, Cp, Gm, ql, Hl, ig, t, vp, pp])),
                Vn(f),
                (o = u[aa] = e(jf.imaBBV) || e(jf.imaBBV[n]) ? R($f) : jf.imaBBV[n]),
                (o[us] = d[Dc]),
                (o[zh] = 0),
                (o[Jh] = !0),
                Y(o, J([Bp, Fm, Cp, Gm, ig, t])),
                _(o, Bl, Ul),
                2 === jf.ast
                  ? (o[qa](),
                    o[qg](),
                    o[Xg](),
                    (o[Pw] = Cr[Pw]),
                    (o[Ew] = function() {
                      Xt(n, !0),
                        (o[Ew] = function(i) {
                          (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
                        });
                    }))
                  : O() && _(o, Rw),
                (c = u[ua] = R(eo)),
                Y(c, J([ag, Fb, Bp, Fm, Cp, Gm, vp, bp, Kl, 0, fg, nb, eg, Dm + Zs + Lm, rg, km, tg, rn(Cr[Gh])])),
                (c[Ew] = i),
                q() && (en(c, Cr[Pw]), W(c, [Jp, Qp], [Rm, ib])),
                f[ho](o),
                f[ho](c),
                !j() || (!Yn() && Jn()) || (nn(c), Yn() && (f[Ew] = i)),
                (a = u[oa] = R(eo)),
                (a[Ew] = function() {
                  Gt(n, yc);
                }),
                Y(a, J([Bp, Fm, Cp, Mm, ql, Wl, vp, pp, tg, rn(r)], yf)),
                s[ho](f),
                s[ho](a),
                yi(n),
                (jf.bvi[us] = d[Dc]),
                void (o && l(o[ko], Tw) ? ((d[bw] = !0), te(n)) : ti(bf, Kt)))
              : (W(s, Bp, Ul), void Ii(d, s, Eb, gb, n))
            : void li(d, Bc, n)
        );
      }
      function Pt(n) {
        var i,
          t,
          r,
          f,
          o,
          c,
          a,
          u,
          s,
          d,
          v,
          b,
          m,
          g,
          h,
          w = Df[n],
          y = w[Bo],
          A = w[xc],
          k = 0;
        if (
          ((i = !!A[Zo + kh]),
          A[ib] && A[gu] && A[mu] && z(A[wu].l),
          jf.bs === $c &&
            vf &&
            (250 / Hu[jp]) * 100 > 27 &&
            ((g = yb),
            (h = Eb),
            (219 / Hu[jp]) * 100 <= 27
              ? (k = 1)
              : (200 / Hu[jp]) * 100 <= 27
              ? (k = 2)
              : (169 / Hu[jp]) * 100 <= 27
              ? (k = 3)
              : ((k = 4), (g = p(0.27 * Hu[jp])), (h = p(Eb * (g / yb)))),
            (A[Bp + To] = g),
            (A[Cp + To] = h)),
          (A[Bp + hv] = k),
          q() && (A[gu] = !0),
          !e(A[Dc]))
        )
          for (jf.lvbp = !1, vi(A), A[pa] = 0, A[xw] = [], f = 0; f < Df[rs]; f++)
            (b = Df[f][xc]), f === n || e(b) || b[Ac] !== Rc || b[kc] !== A[kc] || i || A[xw][ds](f);
        if (
          ((w[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls]();
          }),
          jf.bs === pw ? W(w, [Fl, vp, Ap], [zb, pp, hp]) : W(w, Fl, Hb),
          !e(A[Ig]))
        )
          return void li(A, Rc, n);
        if (!e(A[ll]))
          return (
            jf.bs === $c &&
              ((s = w[El] = R(ro)),
              (s[us] = Cr[El]),
              Y(s, J([vp, bp, Cp, km, Bp, km, Hl, Rm, og, qm, Kl, 0])),
              (s[Ew] = function(n) {
                (n = n || Hu[Us]),
                  n[Ls](),
                  (A[gl + xp] = !0),
                  Bn(y[Bo], Bp, 0, -4.166, _b, 1, function() {
                    Q(w);
                  });
              }),
              w[ho](s),
              W(s, Fl, $b),
              s[dd](jh, s[Ew]),
              s[dd](Lh, _n),
              s[dd](Vh, _n)),
            void Ii(A, y, Eb, _b, n)
          );
        if (
          ((t = !e(A[ba]) && !A[ib] && k < 2),
          (r = !e(A[Sh])),
          t && !i
            ? (Y(y, J([Cp, Ym, Bp, Pm, tg, rn(A[ba]), Gp, Ul], yf)),
              q() && W(y, vp, pp),
              (y[Ew] = function(i) {
                (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
              }),
              e(A[ba]) || e(A[ba + nw + Th]) || A[ba + nw + $h] || ((A[ba + nw + $h] = !0), di(A[ba + nw + Th])))
            : W(y, Gp, tm),
          (o = w[Iw] = R(eo)),
          (c = w[Sw] = R(eo)),
          (s = w[El] = R(ro)),
          Y(o, J([Gp, Ul, Cp, e(h) ? Ym : h + Os, Bp, 0, Ap, hp, vp, pp, ig, e(A[$p]) ? nm : A[$p]])),
          w[Lo](o, y),
          Y(
            c,
            J([
              Bp,
              A[ib] || (i && 0 === k) ? Xm : e(g) ? Wm : g + Os,
              Cp,
              e(h) ? Ym : h + Os,
              Gp,
              Ul,
              kp,
              pw + Ms + xp,
              vp,
              pp,
            ])
          ),
          o[ho](c),
          (s[us] = Cr[El]),
          Y(s, J([vp, bp, Cp, km, Bp, km, Hl, Rm, og, e(h) ? qm : 120 - (Eb - h) / 2 + Os, Kl, 0, kp, _p])),
          (s[Ew] = function(i) {
            (i = i || Hu[Us]), i[Ls](), (A[El + Yg] = !0), ve(n);
          }),
          w[ho](s),
          (!e(A[Dc]) || i) &&
            ((a = c[$f] = e(jf.imaBBV) || e(jf.imaBBV[n]) ? R($f) : jf.imaBBV[n]),
            Y(
              a,
              J([
                kp,
                _p,
                vp,
                bp,
                Cp,
                e(h) ? Ym : h + Os,
                Bp,
                A[ib] ? Xm : e(g) || g >= yb ? Hm : g + Os,
                Kl,
                A[ib] || k > 2 || 1 === k ? 0 : xm,
              ])
            ),
            (a[us] = i ? (A[mu] ? A[wu].v : Cr[$f]) : A[Dc]),
            (a[Ew] = function() {
              Gt(n, yc);
            }),
            _(a, Bl, Ul),
            2 === jf.ast && (a[qa](), a[qg](), a[Xg](), (a[Pw] = Cr[Pw])),
            O() && _(a, Rw),
            c[ho](a),
            Vn(c),
            (d = w[Gh] = R(ro)),
            (a[zh] = 0),
            (a[Jh] = !0),
            (d[us] = Cr[Gh]),
            Y(d, J([vp, bp, Kl, 0, Cp, km, Bp, km, Hl, Rm, og, e(h) ? Vm : 85 - (Eb - h) / 2 + Os, kp, _p])),
            (d[Ew] = function(i) {
              (i = i || Hu[Us]), i[Ls](), pe(n);
            }),
            j() && (Yn() && !$n() ? nn(d) : Yn() || Z(d)),
            o[ho](d),
            !i))
        )
          for (f = 0; f < bn(A[wg])[rs]; f++)
            (m = A[wg][bn(A[wg])[f]]),
              (b = m[ao] = R(eo)),
              Y(b, J([Cp, m[Cp] + Os, Bp, m[Bp] + Os, tg, rn(m[Lc]), vp, bp], yf)),
              0 !== m[Yl] && Q(b),
              e(m[Sh]) ||
                (b[Ew] = (function(n) {
                  return function(i) {
                    (i = i || Hu[Us]), i[Ls](), e(n[Rh]) || di(n[Rh]), Hu[_l](n[Sh]);
                  };
                })(m)),
              c[ho](b);
        if (i) return A[gu] && Ce(n), void we(n);
        if (
          (!A[ib] &&
            k < 3 &&
            1 !== k &&
            ((u = c[ya] = R(eo)),
            Y(u, J([Cp, Ym, Bp, xm, ig, nm, Kl, 0, tg, rn(e(A[ka]) ? Cr[ka] : A[ka])], yf)),
            (u[Ew] = function(i) {
              (i = i || Hu[Us]), i[Ls](), Gt(n, ka);
            }),
            c[ho](u)),
          r)
        ) {
          for (
            v = c[Gc] = R(eo),
              Y(
                v,
                J(
                  [
                    kp,
                    _p,
                    Cp,
                    e(h) ? Ym : h + Os,
                    Bp,
                    A[ib] ? Xm : e(g) ? Hm : g + Os,
                    tg,
                    rn(e(A[Kc]) ? Cr[Oc] : A[Kc]),
                    rg,
                    ib,
                    vp,
                    pp,
                  ],
                  wf
                )
              ),
              v[Ew] = function(i) {
                (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
              },
              e(A[Kc]) ||
                e(A[Kc + nw + Th]) ||
                (e(A[Dc])
                  ? ((A[Kc + nw + $h] = !0), di(A[Kc + nw + Th]))
                  : (A[sh + Th] = A[sh + Th][wl](A[Kc + nw + Th]))),
              A[sa] = [],
              f = 1;
            f < 4;
            f++
          )
            (A[sa][da + f] = R(ro)), Q(A[sa][da + f]), v[ho](A[sa][da + f]);
          c[ho](v);
        }
        A[gu] ? Ce(n) : a && l(a[ko], Tw) ? ((A[bw] = !0), fe(n)) : q() || ti(bf, Kt);
      }
      function Ut(n) {
        var t,
          r,
          f,
          o,
          c,
          a,
          u,
          s,
          d = Df[n],
          v = d[Bo],
          p = d[xc],
          b = !1;
        if (
          (!e(p[Ec + i(Dc)]) && (P() || (N() && !q()) || (C() && 2 !== jf.ast) || Yn()) && (b = p[Ec + i(Dc)]),
          !1 !== b || e(p[Dc]) || (b = p[Dc]),
          vi(p),
          W(d, [Bp, Cp, Ap, Wp], [76, 167, hp, -168], [1, 1, 0, 1]),
          Y(v, J([vp, pp, Cp, zm, Bp, jm])),
          (v[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls]();
          }),
          (t = d[Ec] = R(eo)),
          Y(
            t,
            J(
              [
                ig,
                e(p[$p]) ? cb : p[$p],
                tg,
                rn(e(p[wa]) ? Cr[qc] : p[wa]),
                Bp,
                jm,
                Cp,
                Km,
                Ap,
                hp,
                vp,
                bp,
                Hl,
                0,
                Kl,
                0,
              ],
              yf
            )
          ),
          (t[Ew] = function(i) {
            (i = i || Hu[Us]), i[Ls](), Gt(n, Ec);
          }),
          (r = d[va] = R(eo)),
          Y(
            r,
            J([
              Bp,
              Em,
              Cp,
              Bm,
              Gp,
              Ul,
              vp,
              bp,
              Wl,
              0,
              Kl,
              0,
              tg,
              rn(Cr[la]),
              rg,
              gm + Zs + gm,
              fg,
              nb,
              eg,
              bm + Zs + em,
            ])
          ),
          (r[Ew] = function(i) {
            (i = i || Hu[Us]), i[Ls](), p[Va] === La ? (!1 !== b ? ne(n, $f) : ne(n, Na)) : ne(n, La);
          }),
          v[ho](t),
          v[ho](r),
          !1 !== b)
        ) {
          for (
            f = d[$f] = e(jf.imaBBV) || e(jf.imaBBV[n]) ? R($f) : jf.imaBBV[n],
              Y(f, J([Cp, Km, Bp, jm, ig, Qb])),
              f[us] = b,
              (2 === jf.ast || q()) &&
                (_(f, Pw, Cr[Pw]),
                (f[Ew] = function(n) {
                  (n = n || Hu[Us]), n[Ls](), f[qg]();
                })),
              O() && _(f, Rw),
              Vn(d),
              f[Jh] = !0,
              f[zh] = 0,
              t[ho](f),
              o = d[Gh] = R(eo),
              q()
                ? Y(o, J([Cp, Km, Bp, jm, fg, nb, tg, rn(Cr[Pw])]))
                : (Y(o, J([vp, bp, zl, 0, Wl, 0, Cp, Em, Bp, Em, eg, dm + Zs + dm, fg, nb, rg, wm + Zs + wm])),
                  j() && !Jn() && Q(o)),
              t[ho](o),
              a = 0;
            a < bn(p[wg])[rs];
            a++
          )
            (s = p[wg][bn(p[wg])[a]]),
              (u = s[ao] = R(eo)),
              Y(u, J([Cp, s[Cp] + Os, Bp, s[Bp] + Os, tg, rn(s[Lc]), vp, bp], yf)),
              0 !== s[Yl] && Q(u),
              e(s[Sh]) ||
                (u[Ew] = (function(n) {
                  return function(i) {
                    (i = i || Hu[Us]), i[Ls](), e(n[Rh]) || di(n[Rh]), Hu[_l](n[Sh]);
                  };
                })(s)),
              t[ho](u);
          f && l(f[ko], Tw) ? ((p[bw] = !0), ie(n)) : ti(bf, Kt);
        } else
          c = sn(function() {
            ((jf.bs === $c && Mt(v)) || (jf.bs === pw && Mt(d))) && (dn(c), ne(n, Na));
          }, Pb);
        ne(n, La);
      }
      function jt(n) {
        var i,
          t,
          r,
          f,
          o,
          c,
          a,
          u,
          s,
          d = Df[n],
          v = d[Bo],
          p = d[xc];
        if (
          (vi(p),
          X(d, J([Bp, jm, Cp, zm, Ap, hp, og, im])),
          Y(v, J([vp, pp, Cp, zm, Bp, jm])),
          (v[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls]();
          }),
          (i = d[Ec] = R(eo)),
          Y(
            i,
            J(
              [
                ig,
                e(p[$p]) ? cb : p[$p],
                tg,
                rn(e(p[wa]) ? Cr[qc] : p[wa]),
                Bp,
                jm,
                Cp,
                Km,
                Ap,
                hp,
                vp,
                bp,
                Hl,
                0,
                Kl,
                0,
              ],
              yf
            )
          ),
          (i[Ew] = function() {
            qt(n);
          }),
          (t = d[va] = R(eo)),
          Y(
            t,
            J([
              Bp,
              Em,
              Cp,
              Bm,
              Gp,
              Ul,
              vp,
              bp,
              Wl,
              0,
              Kl,
              0,
              tg,
              rn(Cr[la]),
              rg,
              gm + Zs + gm,
              fg,
              nb,
              eg,
              bm + Zs + em,
            ])
          ),
          (t[Ew] = function(i) {
            (i = i || Hu[Us]), i[Ls](), p[Va] === La ? ne(n, Na) : ne(n, La);
          }),
          v[ho](i),
          v[ho](t),
          (r = d[vy] = R(eo)),
          Y(r, J([ag, Wb, _a, gg, ub, 1, vp, mp, kp, _p], gf)),
          r[dd](Lh, _n, !1),
          (f = d[ly] = R(eo)),
          Y(f, J([Bp, $m, Cp, Jm, vp, mp, Gp, Ul, Ap, hp], gf)),
          e(p[ry]) || (X(f, J([tg, rn(p[ry]), rg, l(p[ry], Ga) ? ib : tb], wf)), z(p[ry])),
          r[ho](f),
          (o = d[fy] = R(eo)),
          Y(o, J([tg, rn(Cr[El]), Bp, um, Cp, sm, vp, bp, Kl, rm, Wl, fm, ag, Yb], yf)),
          V() && Z(o),
          (o[Ew] = function(n) {
            (n = n || Hu[Us]), n[Ls](), d[oy]();
          }),
          f[ho](o),
          (u = Tc + mo),
          !e(p[u + 0]))
        ) {
          d[ay] = [];
          for (var b = 0; b < 3; b++)
            e(p[u + b]) ||
              ((s = d[Tc + Av + b] = R(ro)),
              (s[us] = p[u + b]),
              z(s[us]),
              (s[Ew] = (function(n) {
                return function(i) {
                  (i = i || Hu[Us]), i[Ls](), d[xv + Ic](n);
                };
              })(b)),
              d[ay][ds](s),
              f[ho](s),
              ii(p, u + b, cc),
              Y(
                s,
                J([
                  vp,
                  bp,
                  ag,
                  Xb + (b + 1),
                  Cp,
                  p[u + b + Cp] + nd,
                  Bp,
                  p[u + b + Bp] + nd,
                  Kl,
                  p[u + b + Kl] + nd,
                  Hl,
                  p[u + b + Hl] + nd,
                ])
              ));
        }
        e(p[Dc]) ||
          ((a = d[sy] = R($f)),
          (a[us] = p[Dc]),
          (a[zh] = 0),
          (a[Jh] = !0),
          ii(p, Dc, cc),
          Y(
            a,
            J([vp, bp, ag, Xb + 5, Cp, p[Dc + Cp] + nd, Bp, p[Dc + Bp] + nd, Kl, p[Dc + Kl] + nd, Hl, p[Dc + Hl] + nd])
          ),
          O() && _(a, Rw),
          (c = d[dy] = R(eo)),
          Y(c, J([tg, rn(p[Jh] ? Cr[Gh] : Cr[Yh]), Bp, um, Cp, sm, vp, bp, Kl, rm, Wl, pm, ag, Yb], yf)),
          (Yn() || 2 === jf.ast || (C() && jf.ast && m(Fr[ey]) < 4.3)) && nn(c),
          f[ho](a),
          f[ho](c),
          ii(p, Dc, cc),
          (p[Dc + Bp] < 152 || p[Dc + Cp] < 168) && q() && _(a, Pw, Cr[Pw])),
          zu[ho](r),
          Vt(n);
        var g = sn(function() {
          ((jf.bs === $c && Mt(d[Bo])) || (jf.bs === pw && Mt(d))) && (dn(g), ne(n, Na));
        }, Pb);
        ne(n, La);
      }
      function Vt(n) {
        var i = Df[n],
          t = i[xc];
        Lt(n), e(t[Dc]) || (Nt(n), Dt(n), Ot(n), Ft(n), ti(i[sy]));
      }
      function Lt(n) {
        var i = Df[n],
          t = i[sy];
        i[oy] = function() {
          Q(i[vy]), ne(n, Oa), dn(i[cy]), !e(t) && f(t[Xg]) && t[Xg]();
        };
      }
      function Nt(n) {
        var i = Df[n],
          t = i[dy],
          e = i[sy],
          r = i[xc];
        t[Ew] = function(n) {
          (n = n || Hu[Us]),
            n[Ls](),
            j() && !Jn()
              ? e[qg]()
              : (!j() && (e[zh] > 0 || !e[Jh])) || ($n() && !e[Jh])
              ? ((e[zh] = 0), (e[Jh] = !0), en(t, Cr[Gh]), di(r[Gh + Th], Gh, r, bf, e))
              : ((e[zh] = 1),
                (e[Jh] = !1),
                en(t, Cr[Yh]),
                di(r[Yh + Th], Yh, r, bf, e),
                Jn() &&
                  !Yn() &&
                  (dn(i[uy]),
                  e[qg](),
                  $n() || en(t, Cr[Gh]),
                  r[Wd + $h] || ((r[Wd + $h] = !0), di(r[Wd + Th], bf, bf, bf, e))));
        };
      }
      function Dt(n) {
        var i,
          t = Df[n],
          e = t[sy],
          r = t[xc];
        (t[Tc + ta] = function() {
          (i = e[os]),
            i < 1 && j() && !Yn() && On(),
            i > 0 && i < r[Qg]
              ? di(r[qg + Th], qg, r, bf, e)
              : i >= r[Qg] && i < r[ih]
              ? di(r[Qg + Th], Qg, r, bf, e)
              : i >= r[ih] && i < r[rh]
              ? di(r[ih + Th], ih, r, bf, e)
              : i >= r[rh] && i < r[ch]
              ? di(r[rh + Th], rh, r, bf, e)
              : i >= r[ch] && i < b(r[cs]) - 1 && di(r[sh + Th], sh, r, bf, e);
        }),
          e[dd](ia, t[Tc + ta], !1);
      }
      function Ot(n) {
        var i = Df[n],
          t = i[xc],
          e = i[sy];
        (i[Tc + uh] = function() {
          di(t[sh + Th], sh, n), ki(e, t);
        }),
          e[dd](ah, i[Tc + uh], !1);
      }
      function Ft(n) {
        var i = Df[n],
          t = i[xc],
          r = i[sy];
        i[xv + Ic] = function(n) {
          n = e(n) ? 0 : n;
          var i,
            f = ic + Ih,
            o = Ks + Iw + Ks,
            c = e(t[Dc]) ? (e(t[ry]) ? '' : t[ry]) : t[Dc],
            a = t[Sh];
          if (
            (0 === n
              ? (o += mh)
              : ((f += Av + n),
                (o += yv + Ms + mh + Ms + n),
                (i = e(t[Tc + Ph + n]) ? bf : t[Tc + Ph + n]),
                (a = e(t[Tc + Bh + n]) ? a : t[Tc + Bh + n])),
            e(i) || si(i),
            si(ui(fi(Cv, t[kc], jf.bs + Tc + Ks + jr + o, c, t), o, t[kc])),
            De(t, f),
            !e(t[Dc]) && N() && !q() && !r[Jg])
          )
            var u = sn(function() {
              qu[hp] || (dn(u), r[qg]());
            }, _b);
          Hu[_l](a);
        };
      }
      function qt(n) {
        function i(n) {
          (n = n || Hu[Us]), n[Ls](), a[qg]();
        }
        var t,
          r = Df[n],
          o = r[xc],
          c = r[Tc + eu],
          a = r[Tc + Qf + rb],
          u = b(o[cs]),
          s = r[dy];
        Z(c),
          dn(r[cy]),
          (r[cy] = sn(function() {
            et(n);
          }, 125)),
          e(o[py]) && ((o[py] = !0), di(o[yc + ww + Th]), De(o, ic + ww)),
          o[Gd + $h] || ((o[Gd + $h] = !0), di(o[Gd + Th], bf, bf, bf, a)),
          e(o[Dc]) ||
            ((a[Jh] = o[Jh]),
            (a[zh] = +!o[Jh]),
            q() ||
              un(function() {
                a[Ew] = function(n) {
                  (n = n || Hu[Us]), n[Ls](), xi(a, o), l(s[up][Yp], Cr[Gh]) && s[Ew](), a[qg](), dn(r[uy]);
                };
              }, Ob),
            j() &&
              $n() &&
              !Yn() &&
              a[dd](
                qw,
                function() {
                  l(s[up][Yp], Cr[Yh]) && s[Ew]();
                },
                !1
              ),
            di(o[Og + Th], Og, n),
            j() || (0 !== a[zh] && !a[Jh]) || di(o[Gh + Th], Gh, n),
            (j() && !Yn()) || q() || 2 === jf.ast
              ? Jn()
                ? (Vn(c),
                  (r[uy] = sn(function() {
                    (t = a[os]), a[os] + lb < u ? ((a[os] += lb), r[Tc + ta]()) : dn(r[uy]);
                  }, 33)))
                : 2 === jf.ast
                ? _(a, Pw, Cr[Pw])
                : q() && ((a[Ew] = i), (s[Ew] = i))
              : f(a[qg]) &&
                (a[qg](),
                !jf.ast && l(es, 'Android 4.1')
                  ? Hn(!0, !1)
                  : l(es, 'Android 4.3')
                  ? (a[qa](),
                    un(function() {
                      a[qg]();
                    }, kb))
                  : jf.ast && _(a, Pw, Cr[Pw]))),
          un(function() {
            r[Tc + rb][Ew] = function(n) {
              (n = n || Hu[Us]), n[Ls](), r[xv + Ic]();
            };
          }, Ob);
      }
      function Kt() {
        e(jf.tlc) && (jf.tlc = !0);
        var n, i, t, r, f;
        for (f = 0; f < Df[rs]; f++)
          if (((t = Df[f][xc]), (r = t[Ac]) !== _c && !t.tlc)) {
            if (((t.tlc = !0), !e(t[Dc]) || t[Zo + kh])) {
              if (r === Rc) {
                if (e(Df[f][Sw])) {
                  t.tlc = !1;
                  continue;
                }
                (n = Df[f][Sw][$f]),
                  t[Zo + kh] &&
                    e(jf.imaBBV) &&
                    ((jf.imaBBV = []), (i = R($f)), (i[us] = Cr[$f]), i[qa](), (i[ko] = Tw), (jf.imaBBV[f] = i));
              } else n = r === Ec ? Df[f][$f] : Df[f][aa];
              if (e(n)) {
                t.tlc = !1;
                continue;
              }
              ((Hf && !uf && e(n[qg + Ma + qa])) || n[qg + Ma + qa]) &&
                (_(n, Jh, ''), _(n, Ul + qg, ''), _(n, Bw, ''), (n[Jh] = !0), (n[bw] = !0), (n[ko] += Zs + Tw)),
                n[Jg] || (n[Xg](), (n[os] = 0)),
                jf.ast || P() || N() || (j() && !Yn()) ? n[qa]() : (Yn() && !Jn() && n[qa](), n[qg](), n[Xg]()),
                Jn() &&
                  !Yn() &&
                  e(t[bw]) &&
                  ((t[bw] = !1),
                  (function(i) {
                    n[Mh] = function() {
                      i[bw] = !0;
                    };
                  })(t));
            } else if (r === Ec) continue;
            r === Rc ? (t[Zo + kh] ? Ae(f) : fe(f)) : r === Ec ? ie(f) : te(f);
          }
      }
      function Mt(n) {
        if (!1 !== jf.wff && !e(n)) {
          var i,
            t,
            o,
            c,
            a,
            u,
            s,
            d = n[Po];
          if (((s = zt(n)), (u = s.isFixed), (a = s.isBodyChild), (o = !u && r(n[Zl])), a && !o)) {
            if (f(Hu[sp])) {
              var v = Hu[sp](n);
              (i = v[kp] !== _p), (t = v[gp] !== hp && v[gp] !== yp), (c = !!e(v[fp]) || 1 == v[fp]);
            } else (i = !0), (t = !0), (c = !0);
            if (i && t && c) {
              var l,
                p,
                b = Hu[jp],
                m = Hu[Vp],
                g = Hu[rp],
                h = Hu[ep],
                w = n[Lp],
                y = n[Np];
              if (
                (u
                  ? ((l = (h + m - y) / 2), (p = g + b - w))
                  : d[up][vp] === pp
                  ? ((l = d[$l] + n[$l]), (p = d[Ql] + n[Ql]))
                  : ((l = n[$l]), (p = n[Ql])),
                !(e(n[xc]) || (n[xc][Ac] !== Ec && n[xc][Ac] !== Tc) || n[up][vp] !== bp))
              )
                return (p + w > g && g + b > p && l + y > h && h + m > l) || u ? 1 : void 0;
              if (
                (p + w >= g &&
                  p + w - g >= 0.7 * w &&
                  g + b >= p &&
                  g + b - p >= 0.7 * w &&
                  l + y >= h &&
                  l + y - h >= 0.7 * y &&
                  h + m >= l &&
                  h + m - l >= 0.7 * y) ||
                u
              ) {
                if (!e(d[xc]) && (d[xc][Ac] === Ec || d[xc][Ac] === Tc)) return 1;
                var A, k, x, _, E, T, I, S, B;
                if (
                  ((A = qu[xs](l + 2 - h, p + 2 - g)),
                  (k = qu[xs](l + y - 2 - h, p + 2 - g)),
                  (x = qu[xs](l + y - 2 - h, p + w - 2 - g)),
                  (_ = qu[xs](l + 2 - h, p + w - 2 - g)),
                  N())
                ) {
                  for (E = !1, T = !1, I = !1, S = !1, B = A; !r(B) && B[Po] && !1 === E; ) (E = n == B), (B = B[Po]);
                  for (B = k; !r(B) && B[Po] && !1 === T; ) (T = n == B), (B = B[Po]);
                  for (B = x; !r(B) && B[Po] && !1 === I; ) (I = n == B), (B = B[Po]);
                  for (B = _; !r(B) && B[Po] && !1 === S; ) (S = n == B), (B = B[Po]);
                }
                var R,
                  C = 0;
                if (
                  (r(A) || n[Uo](A) || (n[eb](A) && !1 !== E) || ((R = Ht(n, A)), (C = R > C ? R : C)),
                  r(k) || n[Uo](k) || (n[eb](k) && !1 !== T) || ((R = Ht(n, k)), (C = R > C ? R : C)),
                  r(x) || n[Uo](x) || (n[eb](x) && !1 !== I) || ((R = Ht(n, x)), (C = R > C ? R : C)),
                  r(_) || n[Uo](_) || (n[eb](_) && !1 !== S) || ((R = Ht(n, _)), (C = R > C ? R : C)),
                  !(C > 0.3))
                )
                  return 1;
                if (d[Lp] < gb && (V() || (P() && !O()))) return 1;
              }
            }
          }
        }
      }
      function zt(n) {
        var i = !1,
          t = !1,
          e = !1;
        do {
          r(n[Zl]) && (i = !0),
            (r(n[Po]) || n[Po] === qu[Bo]) && (e = !0),
            n[Po] === zu && ((t = !0), (e = !0)),
            (n = n[Po]);
        } while (!e);
        return { isFixed: i, isBodyChild: t };
      }
      function Ht(n, i) {
        var t,
          e,
          r = n[Ql],
          f = n[$l],
          o = n[Lp],
          c = n[Np],
          a = i[Ql],
          u = i[$l],
          s = i[Lp],
          d = i[Np];
        return (
          (t = r + o < a + s ? r + o - a : o - (r + o - (a + s))),
          (e = f + c > u + d ? c - (f + c - (u + d)) : f + c - u),
          0 === t || 0 === e || 0 === c || 0 === o ? 0 : (t * e) / (c * o)
        );
      }
      function Gt(n, i, t) {
        t = !e(t) && t;
        var r,
          o = jf.bvi,
          c = Df[n],
          a = c[xc],
          u = a[Ac],
          s = jf.bs + u + Ks + jr + Ks + i + Ks + (t ? zc + Ih + gh : mh + gh);
        e(a[Dc]) ||
          (u === Rc ? (o = c[Sw][$f]) : u === Ec ? (o = c[$f]) : u === Tc && (o = c[sy]),
          C() && i === $f ? qn(a) : P() ? Xn(o, a) : j() && Qn(o)),
          Hu[Us] && f(Hu[Us][Ls]) && Hu[Us][Ls](),
          e(a[Sh]) ||
            ((r = i === ka ? (e(a[ka]) ? Cr[ka] : a[ka]) : e(a[ba]) ? Cr.lm6_1 : a[ba]),
            si(ui(fi(Cv, a[kc], s, r, a), s, a[kc])),
            e(a[mh + Th]) || di(a[mh + Th], bf, bf, bf, o),
            De(a, ic + Ih),
            Hu[_l](ui(a[Sh], s, a[kc], bf, o)));
      }
      function Wt(n, i) {
        var t,
          r = jf.bvi,
          f = Df[n],
          o = f[xc],
          c = o[Ac],
          a = o[kc],
          u = c === Tc,
          s = u ? Iw : Oc;
        c === Rc ? (r = f[Sw][$f]) : c === Ec ? (r = f[$f]) : u && !e(o[Dc]) && (r = f[sy]),
          C() && !r[Jg] ? qn(o) : P() ? Xn(r, o) : j() && Qn(r),
          (t = jf.bs + c + Ks + jr + Ks + $f + Ks + s + Ms + mh + Ms + (i + 1)),
          si(ui(fi(Cv, a, t, o[Dc], o), t, a)),
          De(o, ic + Ih + Fc + (i + 1)),
          (s = u ? Tc : Oc),
          e(o[s + Ph + i]) || si(ui(o[s + Ph + i], t, a, bf, r)),
          Hu[_l](ui(o[s + Bh + i], t, a, bf, r));
      }
      function Xt(n, i) {
        i = !e(i) && i;
        var t,
          r,
          f,
          o = Df[n],
          c = o[xc],
          a = jf.bvi,
          u = i ? o.ldvid : a;
        if (
          (W(jf.bw, $p, e(c[Ba]) ? Qb : c[Ba]),
          e(c[Sa]) || X(jf.bw, J([tg, rn(c[Sa]), rg, l(c[Sa], Ga) ? ib : tb], wf)),
          i
            ? q()
              ? q() && u[qg]()
              : ((a[us] = u[us]),
                2 === jf.ast
                  ? (Ti(n, a),
                    a[qa](),
                    a[qg](),
                    un(function() {
                      a[qg]();
                    }, gb))
                  : N() || P() || !a[bd] || (a[os] = u[os]),
                (c.cpTimer = sn(function() {
                  (u[os] = a[os]),
                    C() && l(es, '5.0;') && a[Jg] && (a[qa](), a[qg]()),
                    Ei(n, u),
                    u[os] > u[cs] - 1 && (j() && !Yn() && ki(a, c), jf.lns.eventEnded());
                }, _b)))
            : (vi(c), (jf.lt = 0), (jf.tt = 0), Ti(n, u)),
          e(c[Kc])
            ? (jf.bcc[us] = Cr[Oc])
            : ((jf.bcc[us] = c[Kc]),
              e(c[Kc + nw + Th]) ||
                l(c[sh + Th], c[Kc + nw + Th][0]) ||
                (c[sh + Th] = c[sh + Th][wl](c[Kc + nw + Th]))),
          Q(jf.bcc),
          (t = jf.bhs),
          !e(c[Oc + mo + 0]))
        )
          for (r = e(c[Oc + mo + 0]) ? (e(c[Oc + mo + 0]) ? 1 : 2) : 3, f = 0; f < r; f++)
            (t[da + (f + 1)][us] = c[Oc + mo + f]),
              (t[da + (f + 1)][Ew] = (function(i) {
                return function(t) {
                  (t = t || Hu[Us]), t[Ls](), Wt(n, i);
                };
              })(f));
        for (f = 1; f < 4; f++) Q(t[da + f]);
        i ? (Q(jf.bld), Z(a)) : (di(c[Og + Th], Og, c, bf, u), Z(jf.bld)), Jt(n);
      }
      function Yt(n) {
        var i = Df[n],
          t = i[xc],
          e = jf.bvi;
        l(e[us], xo + zs + n) ? (Z(e), Ti(n, e), Jt(n)) : ((e[us] = H(t[Dc], xo + zs + n)), Xt(n));
      }
      function Jt(n) {
        function i(i) {
          return function(t) {
            (t = t || Hu[Us]), t[Ls](), Gt(n, $f, i);
          };
        }
        (jf.bPst = []),
          (jf.bAd = []),
          (jf.bBan = []),
          (jf.bPst[Cp] = Ub),
          (jf.bPst[Bp] = 339),
          (jf.bAd[Cp] = 640),
          (jf.bAd[Bp] = 340),
          (jf.bBan[Cp] = Eb),
          (jf.bBan[Bp] = 50),
          Q(jf.bcc);
        var t = Df[n],
          r = t[xc],
          f = e(r[ba]) ? Cr.lm6_1 : r[ba],
          o = jf.bvi;
        (jf.bBan[Cw] = f),
          jf.bbc[us] != f && (jf.bbc[us] = f),
          e(r[ba]) ||
            e(r[ba + nw + Th]) ||
            r[ba + nw + $h] ||
            ((r[ba + nw + $h] = !0), di(r[ba + nw + Th], bf, bf, bf, o)),
          r[Gd + $h] || ((r[Gd + $h] = !0), di(r[Gd + Th], bf, bf, bf, o)),
          (jf.bb[Ew] = i(!0)),
          N() || 2 === jf.ast || (jf.bc[Ew] = i(!1)),
          Ri(),
          Z(jf.bw),
          (jf.brt = sn(function() {
            Ai(n);
          }, gb)),
          o[qg](),
          P()
            ? ((jf.lns.bbtf = function(n) {
                (n = n || Hu[Us]), n[Ds]();
              }),
              zu[dd](Lh, jf.lns.bbtf, !1))
            : 2 === jf.ast &&
              ((jf.absf = !1),
              (o[Ew] = function(n) {
                (n = n || Hu[Us]), n[Ls](), n.target[qg]();
              }));
      }
      function $t(n) {
        function i() {
          return function(i) {
            (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
          };
        }
        var t,
          r = Df[n],
          f = r[Bo],
          o = r[xc],
          c = jf.bvi;
        Q(c),
          Z(jf.bcc),
          Yn() && !e(r[ua]) && tn(r[ua]),
          r[$a] ||
            ((r[$a] = !0),
            (t = e(o[ba]) ? Cr.lm6_1 : o[ba]),
            o[Ac] === _c ? (f.bannerImg[us] = t) : o[Ac] !== Sc && en(f, t),
            e(o[ba]) ||
              e(o[ba + nw + Th]) ||
              o[ba + nw + $h] ||
              ((o[ba + nw + $h] = !0), di(o[ba + nw + Th], bf, bf, bf, c)),
            (f[Ew] = i()),
            (r[Ew] = i()));
      }
      function Qt(n, i) {
        var t = Df[n],
          e = t[xc];
        e[dw + $h] || ((e[dw + $h] = !0), di(e[dw + Th], bf, bf, bf, i)),
          P() && zu[vd](Lh, jf.lns.bbtf, !1),
          Ki(n),
          Z(jf.bld),
          Q(jf.bvi),
          Ci(),
          Q(jf.bw),
          dn(jf.brt),
          jf.bvi[Xg]();
      }
      function Zt(n) {
        var i,
          t = Df[n],
          r = t[Bo],
          f = t[xc];
        (i = e(f[ba]) ? Cr.lm6_1 : f[ba]),
          f[Ac] === _c ? (r.bannerImg[us] = i) : en(r, i),
          e(f[ba]) || e(f[ba + nw + Th]) || f[ba + nw + $h] || ((f[ba + nw + $h] = !0), di(f[ba + nw + Th])),
          (r[Ew] = function(i) {
            (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
          }),
          L()
            ? un(function() {
                Hu[Qu][Zu] = f[Dc];
              }, 1200)
            : (Hu[Qu][Zu] = f[Dc]);
      }
      function ne(n, i) {
        i = e(i) ? Oa : i;
        var t,
          r,
          o = Df[n],
          c = o[xc],
          a = o[up],
          u = b(a[Wp]),
          s = 2;
        if (
          (i === $f && Yn() && nn(o[Gh]),
          i === La
            ? ((t = -136),
              (r = function() {
                en(o[va], Cr[la]);
              }))
            : i === Na || i === $f
            ? ((t = 0),
              (r = function() {
                en(o[va], Cr[yp]),
                  di(c[uc + Fg + Th], uc + Fg, c),
                  i === Na &&
                    (e(o[$f]) || (Q(o[$f]), Q(o[Gh])),
                    c[Ac] !== Tc &&
                      un(function() {
                        ne(n, Oa);
                      }, Mb));
              }))
            : i === Oa && (t = -168),
          u === t && i === c[Va])
        )
          return !0;
        u > t && (s *= -1), (c[Va] = i), Cn(o, Wp, t, s, bf, bf, f(r) ? r : bf);
      }
      function ie(n) {
        function i() {
          ne(n, $f),
            (e = sn(function() {
              o[os] + lb < o[cs]
                ? (o[os] += lb)
                : (dn(e),
                  -135 === b(r[up][Wp])
                    ? (Q(o),
                      Q(c),
                      un(function() {
                        ne(n, Oa);
                      }, Mb))
                    : ne(n, Na));
            }, 33));
        }
        var t,
          e,
          r = Df[n],
          f = r[xc],
          o = r[$f],
          c = r[Gh];
        vi(f),
          Ti(n, o),
          (f[Og + na] = sn(function() {
            ((jf.bs === $c && Mt(r[Bo])) || (jf.bs === pw && Mt(r))) &&
              (dn(f[Og + na]),
              f[Jh] ? ((o[zh] = 0), (o[Jh] = !0), en(c, Cr[Gh])) : ((o[zh] = 1), (o[Jh] = !1), en(c, Cr[Yh])),
              q()
                ? (r[Gh][Ew] = o[qg])
                : (c[Ew] = function(n) {
                    (n = n || Hu[Us]),
                      n[Ls](),
                      (!$n() && (o[zh] > 0 || !o[Jh])) || ($n() && !o[Jh])
                        ? ((o[zh] = 0), (o[Jh] = !0), en(c, Cr[Gh]), di(f[Gh + Th], Gh, f, bf, o))
                        : ((o[zh] = 1), (o[Jh] = !1), en(c, Cr[Yh]), di(f[Yh + Th], Yh, f, bf, o), f[Kw] && xi(o, f));
                  }),
              j() && Jn() && !Yn()
                ? (di(f[Gh + Th], Gh, f, bf, o),
                  (r[Gh][Ew] = function(n) {
                    (n = n || Hu[Us]), n[Ls](), dn(e), di(f[Yh + Th], Yh, f, bf, o), $n() && (o[Jh] = !1), o[qg]();
                  }),
                  o[dd](
                    qw,
                    function() {
                      f[Jd + $h] || ((f[Jd + $h] = !0), di(f[Jd + Th], bf, bf, bf, o)),
                        en(c, Cr[Gh]),
                        (o[Jh] = !0),
                        0 !== o[os] && o[os] + 1 < o[cs] && i();
                    },
                    !1
                  ),
                  f[bw]
                    ? i()
                    : (t = sn(function() {
                        f[bw] && (dn(t), i());
                      }, gb)))
                : (j() && !Jn() && !Yn()) || 2 === jf.ast || q()
                ? (ne(n, $f),
                  un(function() {
                    o[os] <= 1 && ne(n, Na);
                  }, Mb))
                : (o[qg](), jf.ast && Hn(n)));
          }, Pb));
      }
      function te(n) {
        var i = Df[n],
          t = i[xc];
        vi(t),
          Ti(n, i[aa], !0),
          (t[Og + na] = sn(function() {
            Mt(i[Bo]) &&
              (dn(t[Og + na]),
              di(t[uc + Fg + Th], uc + Fg, t),
              e(t[bw]) || !0 === t[bw]
                ? ee(n)
                : (t.cpiTimer = sn(function() {
                    !0 === t[bw] && (dn(t.cpiTimer), ee(n));
                  }, gb)));
          }, Nb));
      }
      function ee(n) {
        var i = Df[n],
          t = i[Bo],
          e = i[xc],
          r = i[aa];
        (e[ra] = null),
          (e.svbViewableTimer = sn(function() {
            if ((j() && !Yn()) || q() || 2 === jf.ast)
              if (q())
                dn(e.svbViewableTimer),
                  (i[ua][Ew] = function(t) {
                    (t = t || Hu[Us]),
                      t[Ls](),
                      Xt(n, !0),
                      (i[ua][Ew] = function(i) {
                        (i = i || Hu[Us]), i[stopPropagation](), Gt(n, yc);
                      });
                  }),
                  re(n);
              else if (Jn())
                Mt(t)
                  ? null === e[ra] &&
                    (e[ra] = sn(function() {
                      di(e[Og + Th], Og, e, bf, r),
                        di(e[qg + Th], qg, e, bf, r),
                        r[os] < r[cs] - 1
                          ? (r[os] += lb)
                          : (dn(e[ra]),
                            en(i[ua], Cr[Pw]),
                            W(i[ua], [Jp, Qp], [Rm, tb]),
                            (i[ua][Ew] = function(i) {
                              (i = i || Hu[Us]), i[Ls](), Gt(n, yc);
                            }));
                    }, 33))
                  : null !== e[ra] && (dn(e[ra]), (e[ra] = null));
              else {
                e[kw] || re(n), Q(i[ua]);
                var f = sn(function() {
                  r[os] > 0 && (dn(f), di(e[Og + Th], Og, e, bf, r), di(e[qg + Th], qg, e, bf, r));
                }, _b);
              }
            else
              Mt(t) && r[Jg]
                ? (r[qg](), di(e[Og + Th], Og, e, bf, r), di(e[qg + Th], qg, e, bf, r))
                : Mt(t) || r[Jg] || r[Xg]();
          }, _b));
      }
      function re(n) {
        var i = Df[n],
          t = i[Bo];
        (i[xc][kw] = !0), Cn(t, Bp, gb, 2.5);
      }
      function fe(n) {
        var i,
          t,
          r,
          f = Df[n],
          o = f[Bo],
          c = f[xc],
          a = f[Sw][$f];
        if (
          (e(c[Dc]) || Ti(n, a),
          xn() < 64
            ? ((a[zh] = +!c[Jh]), (a[Jh] = c[Jh]), (f[Gh][us] = c[Jh] ? Cr[Gh] : Cr[Yh]))
            : xn() > 63 && (f[Gh][us] = Cr[Gh]),
          c[Ac] === Rc && e(c.closureCalled))
        )
          if (
            ((c.closureCalled = !0),
            (c[Og + na] = sn(function() {
              if (Mt(o) && (!j() || Yn() || c[bw]))
                c[bw] && (Z(a), j() && jf.bs === $c && (a[qa](), se(n))),
                  dn(c[Og + na]),
                  di(c[uc + Fg + Th], uc + Fg, c, bf, a);
              else if (j() && !Jn())
                for (
                  dn(c[Og + na]), !0 !== c[kw] && se(n), di(c[uc + Fg + Th], uc + Fg, c, bf, a), le(n), i = 0;
                  i < c[xw][rs];
                  i++
                )
                  le(c[xw][i]);
            }, kb)),
            e(c[Dc]))
          ) {
            if ((le(n), !e(c[xw]))) for (i = 0; i < c[xw][rs]; i++) le(c[xw][i]);
          } else
            2 === jf.ast || q()
              ? e(c[Wd + na]) &&
                (c[Wd + na] = sn(function() {
                  Mt(o) &&
                    ((t = y(Rc + na + n)),
                    (r = b(t[fs])),
                    1 !== r
                      ? (r--, (t[fs] = r))
                      : (dn(c[Wd + na]),
                        (c.timerFired = !0),
                        C() && a[qg](),
                        ae(),
                        (c.playChecker = sn(function() {
                          c[qg + $h] && (dn(c.playChecker), de(n, !0));
                        }, kb))));
                }, Nb))
              : (oe(), j() || ae());
      }
      function oe() {
        e(jf.ltea) &&
          ((jf.ltea = !0),
          N()
            ? (Hu[dd](Dh, ae, !1), Hu[dd](Oh, ae, !1), Hu[dd](Nh, ae, !1), Hu[dd](Fa, ae, !1))
            : !j() || Yn()
            ? (zu[dd](jh, ae, !1), zu[dd](Vh, ae, !1), zu[dd](Lh, ae, !1), Hu[dd](Fa, ae, !1))
            : Jn() && be());
      }
      function ce() {
        e(jf.lter) &&
          ((jf.lter = !0),
          N()
            ? (Hu[vd](Dh, ae, !1), Hu[vd](Oh, ae, !1), Hu[vd](Nh, ae, !1), Hu[vd](Fa, ae, !1))
            : !j() || Yn()
            ? (zu[vd](jh, ae, !1), zu[vd](Vh, ae, !1), zu[vd](Lh, ae, !1), Hu[vd](Fa, ae, !1))
            : Jn() && ge()),
          dn(jf.ttr);
      }
      function ae() {
        dn(jf.ttr),
          (jf.ttr = un(function() {
            ue();
          }, kb));
      }
      function ue() {
        var n,
          i,
          t,
          r = Df;
        if (!jf.lter && !e(r[0]) && !e(r[0][xc]))
          for (e(jf.lvbp) && (jf.lvbp = !1), n = 0; n < r[rs]; n++)
            if (!e(r[n]) && !e(r[n][xc]) && ((i = r[n][xc]), i[Ac] === Rc && !i[gu]))
              if (((t = r[n][Sw][$f]), Mt(r[n][Bo]))) {
                if (
                  (i[Og + $h] ||
                    (di(i[Og + Th], Og, i, bf, t),
                    di(i[qg + Th], qg, i, bf, t),
                    (e(i[Jh]) || i[Jh]) && di(i[Gh + Th], Gh, i, bf, t)),
                  !1 === jf.lvbp)
                )
                  (jf.lvbp = n),
                    ((j() && !Yn()) || 0 !== i[pa]) && (t[os] = i[pa]),
                    (N() || P()) && Z(t),
                    t[qg](),
                    K() &&
                      un(
                        (function(n) {
                          n[qg]();
                        })(t),
                        Nb
                      ),
                    r[n][Gh][up][kp] !== xp && Z(r[n][Gh]);
                else if (jf.lvbp === n && t[Jg]) {
                  if (t[os] === t[cs]) return;
                  (N() || P()) && Z(t),
                    t[qg](),
                    K() &&
                      un(
                        (function(n) {
                          n[qg]();
                        })(t),
                        Nb
                      );
                }
              } else jf.lvbp === n ? (t[Xg](), (jf.lvbp = !1), ae()) : t[Xg]();
      }
      function se(n) {
        var i,
          t,
          r,
          f = Df[n],
          o = f[xc],
          c = o[Bp + hv],
          a = o[Bp + To];
        for (r = 0; r < Df[rs]; r++)
          (t = Df[r]),
            (i = t[xc]),
            i[Ac] === Rc &&
              ((i[kw] = !0), Z(t[El]), Cn(t[Iw], Bp, i[ib] ? _b : 2 === c || 0 === c ? kb : e(a) ? yb : a, 5));
      }
      function de(n, i) {
        var t,
          r = Df[n],
          f = r[xc],
          o = r[Sw],
          c = o[$f];
        if (e(i)) {
          for (t = 0; t < f[xw][rs]; t++) de(f[xw][t], !0);
          if (!e(f.timerFired))
            var a = sn(function() {
              Q(o[$f]), o[$f][up][kp] === _p && dn(a);
            }, gb);
          jf.ltea &&
            (N()
              ? (Hu[vd](Dh, ae, !1), Hu[vd](Oh, ae, !1), Hu[vd](Nh, ae, !1), Hu[vd](Fa, ae, !1))
              : (zu[vd](jh, ae, !1), zu[vd](Vh, ae, !1), zu[vd](Lh, ae, !1), Hu[vd](Fa, ae, !1)));
        }
        Jn() && !Yn() && f[mu] && f[gu]
          ? (Ki(n),
            (c[us] = f[wu].v),
            Fe(f[wu]),
            c[qa](),
            c[qg](),
            c[dd](
              ah,
              function() {
                ki(c);
              },
              !1
            ))
          : e(f[Sh])
          ? ve(n)
          : (dn(f[qg + na]), Q(o[$f]), e(f.timerFired) && o[$f][Xg](), f[mu] || Q(r[Gh]), le(n));
      }
      function ve(n) {
        if (!e(Df[n]) && !e(Df[n][xc])) {
          var i,
            t,
            r,
            f = Df[n],
            o = f[xc],
            c = !e(o[Dc]),
            a = f[Lp];
          if (0 !== a) {
            if (((i = f[Sw][$f]), ce(), c)) {
              for (Ki(n), t = 0; t < o[xw][rs]; t++) Ki(o[xw][t]);
              i[Jg] || i[Xg]();
            }
            if (jf.bs === pw)
              for (t = 0; t < Df[rs]; t++)
                (r = Df[t][xc]),
                  r[Ac] === Rc &&
                    (r[uc + Fg + $h] || dn(r[Og + na]),
                    r[sh + $h] || dn(r[qg + na]),
                    Q(Df[t][El]),
                    Cn(Df[t][Iw], Bp, 0, -5));
            else
              Cn(f[Bo], Bp, 0, -5, bf, bf, function() {
                Q(f);
              });
          }
        }
      }
      function le(n) {
        var i,
          t,
          r = Df[n],
          f = r[xc],
          o = r[Sw],
          c = 1,
          a = f[Cp + To],
          u = f[Bp + To];
        if ((Z(o[Gc]), !e(f[Oc + mo + 0])))
          for (i = f[sa], e(f[Oc + mo + 2]) ? e(f[Oc + mo + 1]) || (c = 2) : (c = 3), t = 0; t < c; t++)
            (i[da + (t + 1)][us] = f[Oc + mo + t]),
              (i[da + (t + 1)][Ew] = (function(i) {
                return function(t) {
                  (t = t || Hu[Us]), t[Ls](), Wt(n, i);
                };
              })(t)),
              Y(
                i[da + (t + 1)],
                J([
                  kp,
                  xp,
                  vp,
                  bp,
                  Bp,
                  f[Oc + mo + t + Bp] + nd,
                  Cp,
                  f[Oc + mo + t + Cp] + nd,
                  Kl,
                  (e(u) ? yb : u) * (f[Oc + mo + t + Kl] / gb) + Os,
                  Hl,
                  (e(a) ? Eb : a) * (f[Oc + mo + t + Hl] / gb) + Os,
                ])
              );
        !f[mu] || (j() && !Yn() && f[gu]) || Pe(n);
      }
      function pe(n) {
        function i() {
          o[vd](qw, i, !1),
            di(f[Gh + Th], Gh, f, bf, o),
            f[Jd + $h] || ((f[Jd + $h] = !0), di(f[Jd + Th], bf, bf, bf, o)),
            0 !== o[os] && o[os] + 1 < o[cs] && ($n() && (o[Jh] = !0), me());
        }
        var t,
          e,
          r = Df[n],
          f = r[xc],
          o = r[Sw][$f];
        if (((o[zh] > 0 || !o[Jh]) && !j()) || ($n() && !o[Jh]))
          for (r[Gh][us] = Cr[Gh], di(f[Gh + Th], Gh, f, bf, o), o[zh] = 0, o[Jh] = !0, t = 0; t < f[xw][rs]; t++)
            (e = Df[f[xw][t]]), (e[Sw][$f][zh] = 0), (e[Sw][$f][Jh] = !0), (e[Gh][us] = Cr[Gh]);
        else {
          for (di(f[Yh + Th], Yh, f, bf, o), o[zh] = 1, o[Jh] = !1, t = 0; t < f[xw][rs]; t++)
            (e = Df[f[xw][t]]), (e[Sw][$f][zh] = 1), (e[Sw][$f][Jh] = !1), (e[Gh][us] = Cr[Yh]);
          Jn() && !Yn()
            ? (f[Wd + $h] || ((f[Wd + $h] = !0), di(f[Wd + Th], bf, bf, bf, o)), he(), o[qg](), o[dd](qw, i, !1))
            : (r[Gh][us] = Cr[Yh]);
        }
      }
      function be() {
        var n,
          i,
          t,
          e,
          f = Df[rs],
          o = !1,
          c = !1,
          a = [],
          u = 0;
        (jf.ivn = !1),
          dn(jf.ivs),
          (jf.ivs = sn(function() {
            for (c = !1, n = 0; n < f; n++)
              if (
                ((i = Df[n]), i[xc][Ac] === Rc && ((t = i[Sw][$f][os]), t >= 0 && a[ds](t), !r(i[Bo]) && Mt(i[Bo])))
              ) {
                c = n;
                break;
              }
            for (
              !1 !== c && c !== o && (Z(Df[c][Sw][$f]), (o = c)), jf.ivn = c, u = Wu[Fp][mv](Wu, a), n = 0;
              n < f;
              n++
            )
              Df[n][xc][Ac] === Rc && ((e = Df[n][Sw][$f]), e[os] < u - 0.3 && (e[os] = u));
          }, _b)),
          me();
      }
      function me() {
        var n,
          i,
          t,
          r,
          o,
          c = !1;
        dn(jf.inf),
          (jf.inf = sn(function() {
            !1 !== (i = jf.ivn) &&
              i >= 0 &&
              ((t = Df[i]),
              (r = t[Sw][$f]),
              (n = r[cs]),
              (o = t[xc]),
              !c && o[uc + Fg + $h] && r[os] > 0 && ((c = !0), di(o[Og + Th], Og, o), di(o[qg + Th], qg, o)),
              (r[os] += lb),
              r[os] + lb > n &&
                (ge(),
                e(o[wu]) || r[us] !== o[wu].v ? !e(jf.lns) && f(jf.lns.eventEnded) && jf.lns.eventEnded() : ve(i)));
          }, 33));
      }
      function ge() {
        dn(jf.ivs), he();
      }
      function he() {
        dn(jf.inf);
      }
      function we(n) {
        var i,
          t,
          r,
          o = Df[n],
          c = o[xc];
        (i = c[Zo + io] = R(to)),
          (o[No] = ec + Ks + xo + Ks + n),
          Y(i, sb),
          zu[ho](i),
          (t = i[ws + Xu]),
          (r = t[Mu]),
          r[_l]()[Yu]('<script src="' + ui(c[Zo + kh]) + '"></script>'),
          r[El](),
          Be(n),
          f(t[ny])
            ? ((c[Zo] = t[ny]()), ye(n))
            : (c[Zo + na] = sn(function() {
                try {
                  f(t[ny]) && ((c[Zo] = t[ny]()), e(c[Zo]) || (dn(c[Zo + na]), ye(n)));
                } catch (i) {}
              }, gb));
      }
      function ye(n) {
        var i,
          t,
          r = Df[n],
          f = r[Bo],
          o = r[xc],
          c = o[Zo],
          a = r[Gh],
          u = r[El],
          s = r[Sw][$f];
        if ((Re(n), e(c) || !je(c) || m(c[tv + jd](Wf)) > 2)) return void Te(n);
        (o[Zo + hv] = Ns),
          o[Bd + hv] === Bd &&
            (o[gu] || (s[Jh] = !!$n() || !s[zh]),
            (a[us] = Yn() ? Cr[Rv] : s[Jh] || (j() && !$n()) ? Cr[Gh] : Cr[Yh]),
            Q(a),
            W(a, [fp, Fl], [0, 3]),
            (a[Ew] = function() {
              if (!Yn()) {
                var n = (0 === s[zh] && s[Jh]) || ($n() && s[Jh]) ? 1 : 0;
                o[Zo + hv] === Tv
                  ? ((s[Jh] = !n),
                    (a[us] = n ? Cr[Yh] : Cr[Gh]),
                    c[so + Qh + Hh](+n),
                    di(o[(n ? Yh : Gh) + Th], n ? Yh : Gh, o, bf, s))
                  : !j() || l(s[us], Cr[$f]) || (!e(o[wu]) && l(s[us], o[wu].v))
                  ? ((l(s[us], Cr[$f]) || (!e(o[wu]) && l(s[us], o[wu].v)) || o[Zo + hv] === Sv) &&
                      '' !== i[fs] &&
                      (j() && !$n() && (n = l(a[us], Cr[Gh]) ? 1 : 0),
                      (o[Gh + na] = un(function() {
                        (s[Jh] = !n),
                          (s[zh] = n),
                          (a[us] = n ? Cr[Yh] : Cr[Gh]),
                          di(o[(n ? Yh : Gh) + Th], n ? Yh : Gh, o, bf, s);
                      }, gb))),
                    c[so + Qh + Hh](n))
                  : ((n = l(a[us], Cr[Gh]) ? 1 : 0),
                    (s[Jh] = !n),
                    (s[zh] = n),
                    (a[us] = n ? Cr[Yh] : Cr[Gh]),
                    di(o[(n ? Yh : Gh) + Th], n ? Yh : Gh, o, bf, s));
              }
            }),
            Y(s, J([Cp, Om, Bp, s[up][Bp], Gp, Ul, ag, 1], hf)),
            $n() && (s[qg + uo + Sp] = !0)),
          Z(u),
          o[gu] || W(u, [fp, Fl], [0, 3]),
          (u[Ew] = function() {
            l(o[Zo + kh], jv) ? c[Xg + Qh]() : c[Vs + Qh](), s[Xg](), Ee(n);
          }),
          W(f, [$p, fp], o[ib] ? [Qb, 1] : [cb, o[gu] ? 1 : 0]),
          (t = o[fv + eu] = R(eo)),
          (t[ko] = Zo + eu),
          Y(t, J([Cp, Om, Bp, s[Lp] + Os, ag, 2, Gp, Ul], hf)),
          (i = o[fv] = R(eo)),
          (i[ko] = Zo + ov),
          Y(i, J([Cp, Om, Bp, Om, vp, pp, ag, 3])),
          t[ho](i),
          r[Sw][ho](t),
          o[gu] || (o[Bd + hv] === Cd || l(s[ko], Tw) || (o[gu] && !o[mu]) ? Ae(n) : ti(bf, Kt));
      }
      function Ae(n) {
        var i,
          t = Df[n],
          r = t[xc],
          f = t[Sw][$f],
          o = r[Zo],
          c = {},
          a = {};
        (c[Qh + iv] = e(r[uc + iv]) ? '' : r[uc + iv]),
          (a[fv] = r[fv]),
          (a[$f + ov] = f),
          (a[$f + ov + Fh + jl + Kg] = !r[gu]),
          xe(n),
          ke(n, !0);
        try {
          2024 == r[kc]
            ? (i = sn(function() {
                Mt(t) && (dn(i), Be(n), o[Ep + Qh](f[Np], f[Lp], cv, Cy, c, a));
              }, _b))
            : (Be(n), o[Ep + Qh](f[Np], f[Lp], cv, Cy, c, a));
        } catch (u) {
          Te(n);
        }
      }
      function ke(n, i) {
        var t,
          r = Df[n],
          f = r[xc],
          o = f[Zo],
          c = r[Sw][$f],
          a = f[fv + eu],
          u = r[Gh],
          s = r[El],
          d = 4,
          v = a[up],
          l = e(f[Bp + To]) ? _b : f[Bp + To],
          p = e(f[Cp + To]) ? Eb : f[Cp + To];
        (i = !e(i) && i),
          (t = !i && o[vo + Qh + Aw]()),
          f[ib]
            ? (c[Lp] !== _b && (W([c, a], Bp, _b, 1), o[td + Qh](Eb, _b)), t || (d += zb), W([u, s], Fl, d))
            : f[ib] ||
              (t && a[Lp] !== l
                ? ((v[Bp] = l + Os), i || o[td + Qh](p, l))
                : t || a[Lp] === c[Lp] || ((v[Bp] = c[Lp] + Os), i || o[td + Qh](p, c[Lp]))),
          (c[Cp] = c[Np]),
          (c[Bp] = c[Lp]);
      }
      function xe(n) {
        function i() {
          Ue(a[Zo + sd], a[Zo], iy),
            (d[us] = a[wu].v),
            d[qa](),
            (d[Ew] = ''),
            Q(p),
            Fe(a[wu]),
            a[Zo + hv] === Iv && tn(d),
            W([g, A], fp, 1),
            tn(g),
            !j() || Yn() || $n()
              ? ((g[Ew] = function() {
                  var n = (0 === d[zh] && d[Jh]) || ($n() && d[Jh]) ? 1 : 0;
                  (d[Jh] = !n), (d[zh] = n), (g[us] = n ? Cr[Yh] : Cr[Gh]);
                }),
                d[qg]())
              : ((g[Ew] = function() {
                  Se(n);
                  var i = function() {
                    d[vd](qw, i, !1), d[ah] || Ie(n);
                  };
                  d[dd](qw, i, !1), d[pv + Kg]();
                }),
                Ie(n)),
            d[dd](
              ah,
              function() {
                Ee(n);
              },
              !1
            ),
            Re(n);
        }
        var t = Df[n],
          f = t[Bo],
          c = f[up],
          a = t[xc],
          u = (a[Zo + sd] = {}),
          s = a[Zo],
          d = t[Sw][$f],
          v = a[fv],
          p = a[fv + eu],
          m = p[up],
          g = t[Gh],
          w = g[up],
          A = t[El],
          k = A[up],
          x = 0;
        (u[Qh + Ug] = function() {
          Re(n),
            j()
              ? $n() &&
                '' !== v[fs] &&
                (j() && $n() && !a[mu] && ((g[us] = Cr[Gh]), s[so + Qh + Hh](0), (d[Jh] = !0), (d[zh] = 0)), Z(g))
              : (a[gu] || s[so + Qh + Hh](0),
                C() ||
                  !(l(d[us], Cr[$f]) || (!e(a[wu]) && l(d[us], a[wu].v))) ||
                  v[fs] ||
                  ((g[us] = +s[vo + Qh + Hh]() ? Cr[Yh] : Cr[Gh]),
                  Z(g),
                  (g[Ew] = function() {
                    (g[us] = +!s[vo + Qh + Hh]() ? Cr[Yh] : Cr[Gh]), s[so + Qh + Hh](+!s[vo + Qh + Hh]());
                  }))),
            !j() ||
              Yn() ||
              $n() ||
              ((d[pv + Kg] = d[qg]),
              (d[qg] = function() {
                _e(n),
                  (g[Ew] = function() {
                    Se(n);
                    var i = function() {
                      d[vd](qw, i, !1), d[ah] || (Ie(n), wn([Mg, !1, !0], d));
                    };
                    d[dd](qw, i, !1), d[pv + Kg]();
                  }),
                  Z(g),
                  wn([Mg, !1, !0], d),
                  Ie(n);
              })),
            Be(n),
            s[Hg + Qh]();
        }),
          (u[Qh + Wg] = function() {
            Re(n),
              di(a[uc + Fg + Th], uc + Fg, a, bf, d),
              nr(a, !0),
              l(d[us], Cr[$f]) || (!e(a[wu]) && l(d[us], a[wu].v))
                ? (nn(d),
                  '' === v[fs] ? ((a[Zo + hv] = Iv), Q(p), jf.ast && b(Fr[ey]) < 6 && (k[Fl] = 10)) : (a[Zo + hv] = Sv),
                  Z(g),
                  tn(g))
                : (l(a[Zo + kh], '//imasdk.googleapis.com/')
                    ? ((a[Zo + hv] = Uc), (w[Fl] = zb), (k[Fl] = zb))
                    : ((a[Zo + hv] = Bv), (m[Fl] = zb)),
                  Z(g),
                  tn(g)),
              a[Zo + hv] === Sv &&
                (a[la + na] = un(function() {
                  1 !== c[fp] && _e(n);
                }, Db)),
              a[Zo + hv] === Sv &&
                a[gu] &&
                ((g[us] = s[by + Hh]() ? Cr[Yh] : Cr[Gh]), (d[zh] = s[by + Hh]()), (d[Jh] = !!s[by + Hh]())),
              (a[Zo + uv] = Mg),
              (a[cc + Cl + na] = sn(function() {
                y(Sy) && y(Sy)[up][kp] !== _p
                  ? a[Zo + uv] === Mg && s[Xg + Qh]()
                  : a[Zo + uv] === Jg && Mt(f) && s[ev + Qh]();
              }, gb));
          }),
          (u[Qh + ph] = function() {
            a[Vs] || (a[mu] && !a[El + Yg] ? i() : Ee(n)), (a[Vs] = !0);
          }),
          (u[Qh + Aw + av] = function() {
            ke(n), s.getAdExpanded() ? Se(n) : Ie(n);
          }),
          (u[Qh + Hh + av] = function() {
            if (!Yn()) {
              dn(a[Gh + na]), (j() && !$n()) || Z(g);
              var n = s[vo + Qh + Hh]();
              (j() && n === +d[Jh]) ||
                ((d[Jh] = !n),
                (d[zh] = n),
                (g[us] = n ? Cr[Yh] : Cr[Gh]),
                di(a[(n ? Yh : Gh) + Th], n ? Yh : Gh, a, bf, d));
            }
          }),
          (u[Qh + Lg] = function(t) {
            !o(t) ||
              e(t[Ng]) ||
              e(t[Ng][Vg + Lv]) ||
              e(t[Ng][Vg + Dv]) ||
              (t = Sv + Zs + Lg + Fs + Zs + t[Ng][Vg + Lv] + ' - ' + t[Ng][Vg + Dv]),
              a[mu] && a[gu] && !a[El + Yg] ? un(i, _b) : Te(n, t);
          }),
          (u[Qh + $g] = function() {
            a[Zo + uv] = Jg;
          }),
          (u[Qh + zg] = function() {
            a[Zo + uv] = Mg;
          }),
          (u[Qh + Ih + wh] = function(i, t, f) {
            e(i) ||
              r(i) ||
              (Se(n),
              di(a[mh + Th], mh, a, bf, d),
              si(ui(fi(Cv, a[kc], jf.bs + Rc + Ks + jr + Ks + $f + Ks + Zo + Ms + mh, i, a), Zo + Ms + mh, a[kc])),
              De(a, ic + nc + Ih),
              f && !e(i) && Hu[_l](i));
          }),
          (u[Qh + Fg] = function() {
            x++,
              x > 1 && ((a[Zo + hv] = Tv), tn(d)),
              a[Zo + hv] !== Sv || a[gu] || s[so + Qh + Hh](0),
              di(a[Og + Th], Og, a, bf, d),
              1 === a[ml] &&
                Ln(
                  ui(
                    '//c.fqtag.com/tag/implement-r.js?org=FRP3bBoRc8yjb59flhkI&p=' +
                      Kr +
                      Ms +
                      Mr +
                      '&a=' +
                      Kr +
                      Ms +
                      Mr +
                      Ms +
                      qr[xy] +
                      '&cmp=' +
                      a[Cv + Do] +
                      '&fmt=video&rd=' +
                      h(is) +
                      '&rt=display&sl=1&fq=1&ad=' +
                      t[No] +
                      '%%fqpb%%',
                    Og,
                    a[kc]
                  )
                ),
              _e(n);
          }),
          (u[Qh + Qf + Gg] = function() {
            a[Zo + hv] === Sv && d[up][gp] === hp ? tn(d) : 0 === b(c[Bp]) && (di(a[Og + Th], Og, a, bf, d), _e(n)),
              di(a[qg + Th], qg, a, bf, d);
          }),
          (u[Qh + Qf + nh] = function() {
            di(a[qg + Th], qg, a, bf, d), di(a[Qg + Th], Qg, a, bf, d);
          }),
          (u[Qh + Qf + eh] = function() {
            di(a[ih + Th], ih, a, bf, d);
          }),
          (u[Qh + Qf + oh] = function() {
            di(a[rh + Th], rh, a, bf, d);
          }),
          (u[Qh + Qf + dh] = function() {
            di(a[sh + Th], sh, a, bf, d);
          }),
          (a[Zo + sd] = u),
          Ue(u, s, rv);
      }
      function _e(n) {
        function i() {
          !C() ||
            l(a[us], Cr[$f]) ||
            (!e(f[wu]) && l(a[us], f[wu].v)) ||
            '' === f[fv][fs] ||
            !0 !== jf.ast ||
            !l(es, 'Android 4.4') ||
            ((a[Jh] = !l(o[us], Cr[Gh])), (a[zh] = +!a[Jh]), (a[Jh] = l(o[us], Cr[Gh])), (a[zh] = +!a[Jh])),
            Cn(r, fp, 1, db),
            Cn(c, fp, 1, db),
            Cn(o, fp, 1, db);
        }
        var t = Df[n],
          r = t[Bo],
          f = t[xc],
          o = t[Gh],
          c = t[El],
          a = t[Sw][$f],
          u = f[Bp + To];
        Cn(r, Bp, e(u) ? _b : u, 5, bf, bf, i);
      }
      function Ee(n) {
        var i,
          t,
          f,
          o = Df[n];
        if (!e(o))
          if (
            ((i = o[Bo]),
            (t = o[xc]),
            (f = o[El][up]),
            dn(t[la + na]),
            dn(t[Zo + na]),
            dn(t[cc + Cl + na]),
            Re(n),
            Se(n),
            e(i) || r(i) || i[Lp] === (e(t[Bp + To]) ? _b : t[Bp + To]))
          )
            dn(t[yp + na]),
              (t[yp + na] = sn(function() {
                if (e(i) || r(i)) return void dn(t[yp + na]);
                if ((i[up][fp] > 0 && ((i[up][fp] -= vb), (f[fp] = i[up][fp])), i[Lp] > 0)) i[up][Bp] = i[Lp] - 5 + Os;
                else {
                  for (Q(o[El]), dn(t[yp + na]), t[Zo + io] && (T(t[Zo + io]), (t[Zo + io] = bf)); o[Bo]; )
                    o[Co](o[Bo]);
                  jf.bs === $c && o[Po] && T(o);
                }
              }, 16));
          else if (e(t[yp + na]) && '' !== o[fs]) {
            for (; o[Bo]; ) o[Co](o[Bo]);
            jf.bs === $c && T(o);
          }
      }
      function Te(n, i) {
        var t,
          f = Df[n];
        if (!e(f) && !r(f)) {
          (t = f[xc]), dn(t[cc + Cl + na]), dn(t[Zo + na]), Re(n), t[Zo + sd] && Ue(t[Zo + sd], t[Zo], iy);
          try {
            t[Zo][Ca + Qh](), t[Zo][Vs + Qh]();
          } catch (o) {}
          nr(t, !1, kn(i) ? kn(i) : Lb, c(i) ? i : bf),
            Ee(n),
            (t[Zo + na] = un(function() {
              ir(Yr, Jr, $r, Qr, yc, n);
            }, Py));
        }
      }
      function Ie(n) {
        var i = Df[n],
          t = i[xc],
          e = i[Sw][$f];
        !j() ||
          Yn() ||
          $n() ||
          l(e[us], Cr[$f]) ||
          (Se(n),
          (t[qg + na] = sn(function() {
            (e[os] += lb), wn([ia, !1, !0], e), e[os] + 0.2 >= p(e[cs]) && (Se(n), wn([ah, !1, !0], e));
          }, 33)));
      }
      function Se(n) {
        dn(Df[n][xc][qg + na]);
      }
      function Be(n) {
        Re(n);
        var i,
          t = Df[n];
        e(t) ||
          e(t[xc]) ||
          ((i = t[xc]),
          (i[Zo + Lg + na] = un(function() {
            Te(n);
          }, Py)));
      }
      function Re(n) {
        var i,
          t = Df[n];
        e(t) || e(t[xc]) || ((i = t[xc]), dn(i[Zo + Lg + na]));
      }
      function Ce(n) {
        var i,
          t = Df[n],
          r = t[Bo],
          f = t[xc],
          o = t[Iw],
          c = t[Sw],
          a = c[$f],
          u = t[El],
          s = t[Gh],
          d = f[mu] ? f[wu].l : Cr[Pw],
          v = f[Bp + hv];
        if (
          (W(t, Ap, hp),
          z(d),
          (a[zh] = +!f[Jh]),
          (a[Jh] = f[Jh]),
          (s[us] = f[Jh] ? Cr[Gh] : Cr[Yh]),
          (jf.ast || q()) && (a[Pw] = e(f[Kc]) ? Cr[Oc] : f[Kc]),
          Z(a),
          Z(s),
          Z(u),
          jf.bs === $c && W(u, Fl, 5),
          (f[Og + na] = sn(function() {
            Mt(r) && (dn(f[Og + na]), di(f[uc + Fg + Th], uc + Fg, f, bf, a));
          }, kb)),
          (i = t[gu] = R(eo)),
          Y(i, a[up][dp] + J([tg, rn(d), rg, l(d, Ga) ? ib : tb], wf)),
          f[Zo + kh] ? W(i[up], [Fl, Kl, zl, Gp], [5, 0, 0, Ul]) : Ti(n, a),
          f[ib] && Q(s),
          (i[Ew] = function() {
            f[ib] && Z(s),
              Q(i),
              a[qa](),
              f[Zo + kh] ? (a[qa](), Ae(n)) : (a[qg](), $n() && !Yn() && ((a[Jh] = !1), (a[zh] = 1)));
          }),
          q() && !f[mu] && nn(i),
          a[Po][ho](i),
          j() && !Yn())
        ) {
          nn(s);
          var p = function() {
            le(n), a[vd](qw, p, !1);
          };
          a[dd](qw, p, !1);
        }
        a[dd](
          Cg + Ng,
          function() {
            un(
              function() {
                Cn(o, Bp, f[ib] || f[Zo + kh] ? _b : v > 2 || 1 === v ? yb : kb, 5);
              },
              f[Zo + kh] ? Nb : 0
            );
          },
          !1
        ),
          (j() || uf) && a[qa]();
      }
      function Pe(n) {
        var i = Df[n],
          t = i[xc],
          e = i[Sw],
          r = e[$f],
          f = e[Gc];
        Ki(n),
          (r[us] = t[wu].v),
          Fe(t[wu]),
          r[qa](),
          (t[Gh + $h] = t[Yh + $h] = !0),
          un(function() {
            Jn() && !Yn() ? (W(e, $p, Qb), r[qa](), be(n)) : r[qg](),
              Q(f),
              Z(r),
              r[dd](ah, function() {
                ve(n);
              });
          }, Mb);
      }
      function Ue(n, i, t) {
        var r,
          f = [
            Ug,
            Wg,
            ph,
            vh,
            lh + uv + av,
            op + av,
            Rd + av,
            as + av,
            Aw + av,
            sv + Zc + av,
            Hh + av,
            Fg,
            Qf + Gg,
            Qf + nh,
            Qf + eh,
            Qf + oh,
            Qf + dh,
            Ih + wh,
            dv,
            vv + zd + Hd,
            vv + lv,
            vv + Tl,
            $g,
            zg,
            'Log',
            Lg,
          ];
        for (r = 0; r < f[rs]; r++) e(n[Qh + f[r]]) || i[t](n[Qh + f[r]], Qh + f[r]);
      }
      function je(n) {
        return (
          f(n[tv + jd]) &&
          f(n[Ep + Qh]) &&
          f(n[Hg + Qh]) &&
          f(n[Vs + Qh]) &&
          f(n[Ca + Qh]) &&
          f(n[td + Qh]) &&
          f(n[Xg + Qh]) &&
          f(n[ev + Qh]) &&
          f(n[la + Qh]) &&
          f(n[yp + Qh]) &&
          f(n[rv]) &&
          f(n[iy])
        );
      }
      function Ve() {
        if (Hu[qv] && Hu[qv][Kv]) {
          var t = Hu[qv][Kv];
          (Fy = t[Mv + zv + Gg]),
            (qy = t[Hv + As + Ug + js + Gg]),
            qy > 0
              ? ((Ky = qy - Fy), Ne(ic + Gv + As + Ug, Ky, qy))
              : ((Ky = Xv),
                qu[dd]('DOM' + As + Ug, function() {
                  (qy = t[Hv + As + Ug + js + Gg]), (Ky = qy > 0 ? qy - Fy : ld), Ne(ic + Gv + As + Ug, Ky, qy);
                })),
            (My = t[qa + js + Gg]),
            My > 0
              ? ((zy = My - Fy), Ne(ic + np + Pg, zy, My))
              : ((zy = Xv),
                Hu[dd](qa, function() {
                  (My = t[qa + js + Gg]), (zy = My > 0 ? My - Fy : ld), Ne(ic + np + Pg, zy, My);
                })),
            (Hy = Cf - Fy),
            Ne(ic + Ug, Hy, Cf);
        }
        var e;
        Ne(ic + Wg, Er - Cf, Er),
          ze(),
          Hu[dd](jo + Xh + qa, function() {
            e || ((e = n()), Ne(ic + np + i(Xh) + qa, e - Cf, e), qe());
          }),
          Me();
      }
      function Le(i, t) {
        return (
          o(t) || (t = {}),
          e(i) && (i = fu),
          (t[i + Ud] = Bf),
          e(t[i + Qc]) && (t[i + Qc] = n()),
          (t[i + Ey] = t[i + Qc] - Cf),
          (t[i + Ty] = t[i + Qc] - Fy),
          (t[i + yy] = Kr),
          (t[i + Ay] = Mr),
          (t[i + ky] = on(Hu[Qu][Lw])),
          e(qr) || ((t[i + bu] = Ur), (t[i + vu] = jr), (t[i + su] = qr[su]), (t[i + xy] = qr[xy])),
          e(sf) || (t[i + Uc + Ks + xy] = sf),
          e(df) || (t[i + Uc + Ks + Jv] = df),
          e(Br) || (t = gn(t, Br)),
          e(Rr) || (t = gn(t, Rr)),
          t
        );
      }
      function Ne(i, t, r) {
        e(r) && (r = n()), Oe(i, t, { as_time: r });
      }
      function De(n, i, t, r) {
        e(r) && (r = {});
        var f, o, c, a;
        (f = n[Qw]),
          (o = n[$w]),
          f !== pc && e(n[gc])
            ? f !== yc && e(n[kc])
              ? (f !== cc && e(n[ac])) || ((c = Pv), (a = cc), (o = e(o) ? n[ac] : o), (f = cc))
              : (e(jf.bs) ? (c = ld) : ((c = jf.bs), (c = c[vs](0, -1))),
                (a = e(n[Ac]) ? n[Ao] : n[Ac]),
                (o = e(o) ? n[kc] : o),
                (f = yc))
            : ((c = Uv), (a = e(n[mc]) ? n[Ao] : n[mc]), (o = e(o) ? n[gc] : o), (f = pc)),
          (r[fu + uc + Ks + gv] = f),
          (r[fu + uc + Ks + No] = o),
          (r[fu + uc + Ks + sc] = c),
          (r[fu + uc + Ks + wo] = a),
          Oe(i, t, r);
      }
      function Oe(n, i, t, r) {
        e(n) || (e(i) && (i = null), (t = Le(r, t)), Xf[ds](n + $s + i + $s + an(t)));
      }
      function Fe(n) {
        var i = {};
        (i[wo] = 'vod_clip_view'),
          (i[No] = n.i),
          (i[yy] = Kr),
          (i[Ay] = Mr),
          (i[ky] = on(Hu[Qu][Lw])),
          Xf[ds](1 + $s + 'GBP' + $s + an(i) + $s + wu);
      }
      function qe() {
        var n = jf.fbal,
          i = Xf[ms]();
        if (!e(n)) {
          if (((i = i[bs]($s)), 3 === i[rs])) n[Iy][yu + js](i[0], i[1] == Gu ? null : b(i[1]), cn(i[2]));
          else {
            if (4 !== i[rs]) return;
            n[Iy][yu + 'Purchase'](i[0], i[1], cn(i[2]));
          }
          Xf[rs] > 0 && qe();
        }
      }
      function Ke() {
        Xf[rs] > 0 && qe();
      }
      function Me() {
        jf.fbal ? (jf.elmo = sn(Ke, gb)) : un(Me, _b);
      }
      function ze() {
        var n,
          i,
          t,
          e,
          r = R(to);
        (r[us] = Sd),
          Y(r, sb),
          zu[ho](r),
          (e = r[ws + Xu]),
          (t = e[Mu]),
          (i =
            "<script>var ld=0;fbAsyncInit=function(){FB.init({appId:'" +
            $o +
            "',version:'v2.8'});ld=1;FB.AppEvents.logPageView()};(function(d,s){var js,fjs = d['" +
            Mo +
            "'](s)[0];js=d['" +
            Xo +
            "'](s);js.src='//connect.facebook.net/en_US/sdk.js';fjs['" +
            Po +
            "']['" +
            Lo +
            "'](js,fjs);}(document,'" +
            Zf +
            "'))</script>"),
          t[_l]()[Yu](i),
          t[El](),
          (n = sn(function() {
            e.ld && (dn(n), (jf.fbal = e.FB));
          }, _b));
      }
      function He() {
        jf.eha || ((jf.eha = !0), Hu[dd](Vg, Ge, !1));
      }
      function Ge(n) {
        n = n || Hu[Us];
        var i,
          t,
          r,
          f,
          o,
          c,
          a = {};
        if (n[wo] === Vg && Xe(n) && !l(Hu[Qu], Af)) {
          n[Ds](), Pf[ds](n);
          try {
            (i = n[Vg]),
              (t = e(i[gs]) ? sl : i[gs]),
              (r = e(n[Tp + al]) ? sl : n[Tp + al]),
              (f = e(n[ul + al]) ? sl : n[ul + al]),
              (o = Ye(n) + Fs + r + Fs + f),
              (c = We(e(i[Nv]) ? n[Nv] : i[Nv])),
              (a[fu + Vg + wo] = t),
              (a[fu + Vg + Nv] = c),
              (a[fu + Vg + 'info'] = o),
              Oe(ic + Lg, bf, a);
          } catch (u) {}
        }
      }
      function We(n) {
        return n[rs] >= gb && ((n = n[Cs](/[aeiou]/gi, '')), n[rs] >= gb && (n = n[Rs](0, 99))), n;
      }
      function Xe(n) {
        return l(Ye(n), [rc, fc, oc]);
      }
      function Ye(n) {
        var i, t;
        return e(n[ad + gs]) ? (e(n[Vg]) ? (i = n[Nv]) : ((t = n[Vg]), e(t[cl]) || (i = t[cl]))) : (i = n[ad + gs]), i;
      }
      function Je() {
        if (((zu = qu.body), jn(), !jf.adki)) {
          (jf.adki = !0),
            He(),
            (Er = n()),
            f(Hu[ec + jg + Pg]) && Hu[ec + jg + Pg](),
            (Sr = En()),
            (l(es, fl + yl + ol) || !Tn(hy) || n() - +Tn(hy) > Jb) && Sn(fu + Lc);
          var i,
            t,
            r,
            o,
            c,
            a,
            u,
            s = k(Zf),
            d = s[rs];
          for (i = 0; i < d; i++)
            if ('' !== s[i][us] && l(s[i][us], Af[Rs](2)) && s[i][No] !== ec + Ms + wu) {
              for (
                r = w(s[i][us]),
                  o = r[Rs](v(r, Gs) + 1),
                  -1 !== v(o, ec + '.js?')
                    ? (o = o[Rs](v(o, ec + qo + '.js?') + 12))
                    : -1 !== v(o, ec + qo + '.js?') && (o = o[Rs](v(o, ec + qo + '.js?') + 15)),
                  o = o[bs](Ws),
                  t = 0;
                t < o[rs];
                t++
              )
                (c = o[t][Rs](0, v(o[t], zs))),
                  (a = o[t][Rs](v(o[t], zs) + 1)),
                  c === Au ? (Kr = b(a)) : c === ku ? (Mr = b(a)) : 'or' === c && (zr = +(a[Bs]() === ns));
              l(s[i][us], '/1/adsprucetag.js') && ((u = R(eo)), (u[ko] = Uw), s[i][Po][Lo](u, s[i][Ow])), (lf = s[i]);
            }
          e(Mr) && (Mr = 1),
            e(zr) && (zr = 0),
            (Nf = A(jw)),
            (Df = A(Uw)),
            (Of = A(Vw)),
            f(Hu[ec + jg + Xc + Yc]) && Hu[ec + jg + Xc + Yc](),
            e(Kr)
              ? (jf.adki = !1)
              : ((yr = Ln(ui(_f), bf, tr)),
                (kr = Ln(ui(Tf), bf, tr)),
                (Tr = n()),
                Sr && Tn(fu + Lc) && ($e(Tn(fu + Lc, 1)), un(tr, Mb)),
                Ve(),
                (pf = sr()));
        }
      }
      function $e(n) {
        var t = n[Ng];
        (Fr = t[vu]),
          (qr = t[du]),
          (Ur = t[Lu + Do]),
          (Vr = t.isHTML5),
          (jr = t[vu + yo]),
          (Lr = t[Ev + i(Ec)]),
          (Nr = t[Ev + 'SVB']),
          (Dr = t[Ev + Rc[Ss]()]),
          (Or = t[Ev + cc[Ss]()]),
          (Mf = g(t[Ev + 'BBF'])),
          (zf = g(t[Ev + pl])),
          (af = g(t[Ev + Rg])),
          (uf = g(t[Ry])),
          (Hf = uf || (C() && xn() > 55)),
          (vf = xn() > 63),
          (cf = g(t.gdpr)),
          Kn();
      }
      function Qe(i) {
        if (!Ir) {
          (Ir = !0), T(yr), T(kr), ur();
          var r,
            o,
            c,
            a,
            u,
            s = 0,
            d = 0,
            v = 0;
          if ((f(Hu[ec + Yc + Pg]) && Hu[ec + Yc + Pg](), e(i))) (r = Tn(fu + Lc, 1)), (Uf = 1);
          else {
            if (((r = cn(i)), r.status !== kb)) return void Ze(+r[Vg], Cc);
            In(fu + Lc, i), In(hy, n());
          }
          return (
            $e(r),
            (o = r.pre),
            (c = r.ban),
            (a = r.fpt),
            e(o[Vg])
              ? ((u = 1),
                (Hr = o[Ng]),
                (Gr = o[wo]),
                (Xr = e(o[ml]) ? bf : o[ml]),
                (Wr = An(o[Xa], o[ps])),
                ir(Hr, Gr, Wr, Xr, pc))
              : Ze(o[Vg], lc),
            e(c[Vg])
              ? ((u = 1),
                (s = 1),
                (Yr = c[Ng]),
                (Jr = c[wo]),
                (Qr = e(c[ml]) ? bf : c[ml]),
                ($r = An(c[Xa], c[ps])),
                ir(Yr, Jr, $r, Qr, yc))
              : 3 === c[Vg]
              ? (Bt(Df), (s = 1))
              : Ze(c[Vg], yc),
            e(a[Vg])
              ? Or
                ? ((u = 1),
                  (d = 1),
                  (Zr = a[Ng]),
                  (nf = a[wo]),
                  (ef = e(a[ml]) ? bf : a[ml]),
                  (tf = An(a[Xa], a[ps])),
                  ir(Zr, nf, tf, ef, cc))
                : Ze(a[Vg], 2)
              : (3 === a[Vg] && (d = 1), Ze(a[Vg], cc)),
            (Br = {}),
            (v += Br[fu + pc + Ks + Wc + Ks + dc] = Nf[rs] > 0 || zr ? 1 : 0),
            (v += Br[fu + yc + Ks + Wc + Ks + dc] = Df[rs] > 0 ? Df[rs] : s),
            (v += Br[fu + cc + Ks + Wc + Ks + dc] = Of[rs] > 1 && Or ? 1 : d),
            Ne(ic + Xc, v, Tr),
            (Rr = {}),
            (v = 0),
            (v += Rr[fu + pc + Ks + Nd + Ks + Ah] = e(Wr) ? 0 : Wr[rs]),
            (v += Rr[fu + yc + Ks + Nd + Ks + Ah] = e($r) ? 0 : $r[rs]),
            (v += Rr[fu + cc + Ks + Nd + Ks + Ah] = e(tf) ? 0 : tf[rs]),
            Ne(ic + Dd, v),
            u && t(),
            1
          );
        }
      }
      function Ze(n, t) {
        0 !== n && (t === Cc ? (Ze(n, lc), Ze(n, yc), Ze(n, cc)) : f(Hu[ec + i(t) + Lg]) && Hu[ec + i(t) + Lg](n));
      }
      function nr(n, i, t, r) {
        if (!i && !e(n[Vg + Th])) {
          var f = t <= Lb ? t : n[Zo + kh] ? Lb : Vb;
          di(n[Vg + Th], bf, bf, f, bf);
        }
        si(
          kf +
            '/served?' +
            $([Au, Kr, ku, Mr, _u, Ur, Eu, n[$w], Tu, n[Qw], Iu, h(ui(n[Jw], bf, n[$w])), Su, n[ru], Bu, +i]) +
            (e(t) ? '' : '&erc=' + b(t)) +
            (e(r) ? '' : '&erm=' + h(r)) +
            (e(rf)
              ? ''
              : (e(rf[uu]) ? '' : '&vld=' + Ff) +
                (e(rf[ow]) ? '' : '&usc=' + rf[ow]) +
                (e(rf[cw]) ? '' : '&psg=' + rf[cw]))
        );
        var o = {};
        i || e(t) || (o[fu + Vg + Ks + Vv] = b(t)), De(n, ic + el + (i ? rl : tl), bf, o);
      }
      function ir(n, t, f, o, c, a) {
        function u() {
          (z = !0),
            (N = {}),
            (N[uc + iv] = ''),
            (N[Zo + kh] = !1),
            (N[ru] = 0),
            (N[Vg + Th] = []),
            (N[Og + Th] = []),
            (N[Hg + Th] = []),
            (N[Zg + Th] = []),
            (N[th + Th] = []),
            (N[fh + Th] = []),
            (N[sh + Th] = []),
            (N[Gh + Th] = []),
            (N[Yh + Th] = []),
            (N[mh + Th] = []),
            (N[Wd + Th] = []),
            (N[Jd + Th] = []),
            (N[Zh + Th] = []),
            (N[Gd + Th] = []),
            (N[dw + Th] = []),
            (N[Ca + Th] = []),
            (N[bh + Th] = {}),
            (N[od] = []),
            (N[Ja] = []),
            (N[Bg] = {}),
            (N[wg] = {});
        }
        function p(n) {
          function t(n) {
            if (0 === n[hw][rs]) return bf;
            for (var i, t = 0; t < n[hw][rs]; t++) if (((i = n[hw][t]), 3 !== i[Eo] && 8 !== i[Eo])) return ln(i[Io]);
            return ln(n[hw][0][Io]);
          }
          function f(n, i, r) {
            var f,
              o,
              c = i[Bs]();
            if (pn(n, i))
              for (f = k(i, n), o = 0; o < f[rs]; o++)
                0 !== f[o][hw][rs] && g(t(f[o])) && (e(r) || f[o][Po][Uo](n)) && N[c + Th][ds](t(f[o]));
          }
          function o(n) {
            if (-1 === v(n, '%')) {
              var i = n[bs](Fs);
              return 60 * +i[0] * 60 + 60 * +i[1] + m(i[2]);
            }
            return s(N[cs]) ? N[cs] * (b(n) / gb) : 0;
          }
          var c,
            a,
            u,
            d,
            l,
            p,
            h,
            _,
            T,
            I,
            S,
            B = !0;
          if (((u = k('VAST', n)[0]), e(u) || 0 === u[Jo])) return nr(N, !1, gb, 'Unable to find VAST node'), void E();
          if ((+x(u, Ud), f(u, i(Vg), 1), !pn(u, Qh)))
            return nr(N, !1, Ib, 'Unable to find Ad node in VAST tag'), void E();
          for (d = k(Qh, u), c = 0; c < d[rs]; c++)
            if (((p = d[c]), !x(p, Eg))) {
              u = p;
              break;
            }
          if (
            (u[So] === Qh || 1 !== d[rs] || (0 != x(d[0], Eg) && 1 != x(d[0], Eg)) || (u = d[0]),
            u[So] === Qh && pn(u, Pd))
          ) {
            if (((u = k(Pd, u)[0]), (d = k(Rd, u)[0]), e(d)))
              return nr(N, !1, xb, 'Expected different linearity (unable to find Linear node in Ad)'), void E();
            if (
              (S = Bd) === Bd &&
              ((l = i(cs)),
              pn(d, l) && ((d = k(l, d)[0]), (N[cs] = o(t(d))), (d = d[Po])),
              x(d, Yw) && (N[Yw] = o(x(d, Yw))),
              (l = cd + ud + uo),
              pn(d, l))
            )
              for (d = k(l, d)[0], l = cd + ud, pn(d, l) && (d = k(l, d)), c = 0; c < d[rs]; c++) {
                if (((p = d[c]), 1 === d[rs] && x(p, wo) === Ed))
                  return nr(N, !1, kb, 'Unable to display SWF based VPAID ad'), void E();
                if (N[Qw] === yc && x(p, tc) === Zw && !Dr)
                  return nr(N, !1, kb, 'Advert violates site preferences (VPAID / allowLVB)'), void E();
                !(function(n) {
                  ((S !== Bd || x(n, tc) !== Zw || (x(n, wo) !== Td && x(n, wo) !== Id)) &&
                    (S !== Cd || (x(n, iw) !== Td && x(n, iw) !== Id))) ||
                    ((l = t(n)),
                    (!C() || m(Fr[ey]) > 5.1 || (xn() > 36 && (N[Qw] !== yc || Dr))) &&
                      (N[Qw] === yc && N[Ao] !== Rc && (N[Ao] = Rc), (N[Zo + kh] = l)));
                })(p),
                  !x(p, wo) ||
                    (x(p, wo) !== wd && x(p, wo) !== yd) ||
                    ((!C() || D() < 4) && x(p, wo) === yd) ||
                    ((h = {}),
                    (h[Cp] = +x(p, Cp)),
                    (h[Bp] = +x(p, Bp)),
                    (h[ss] = +x(p, ss)),
                    (h[us] = t(p)),
                    N[od][ds](h));
              }
            if (
              ((l = Qh + iv),
              N[Zo + kh] && pn(u, l) && ((d = k(l, u)[0]), (N[uc + iv] = t(d))),
              0 === N[od][rs] && (b(N[$w]) != N[$w] || N[ru] > 0) && !N[Zo + kh])
            )
              return (
                nr(
                  N,
                  !1,
                  d[rs] > 0 ? Rb : Bb,
                  d[rs] > 0 ? 'Unable to display media files' : 'Unable to obtain media files'
                ),
                void E()
              );
          } else {
            if (u[So] !== Qh || !pn(u, eu))
              return nr(N, !1, kb, 'Unsupported ad (unable to fine linear/wrapper elements)'), void E();
            if (((u = k(eu, u)[0]), (B = x(u, Tg) === ns || r(x(u, Tg))), (l = 'VASTAdTagURI'), !pn(u, l)))
              return nr(N, !1, gb, 'Unable to obtain URI for wrapped tag'), void E();
            T = t(k(l, u)[0]);
          }
          if ((f(u, i(Vg)), f(u, i(Og)), (d = k(Rd, u)[0]), S === Bd && e(d) && u[So] === Pd))
            return nr(N, !1, kb, 'Unable to display ad (cannot find inline node for Linear ad)'), void E();
          if (((l = Ag), pn(d, l))) {
            for (d = k(yg, d), c = 0; c < d[rs]; c++)
              if (((p = d[c]), pn(p, Nc))) {
                if (
                  ((l = vn(x(p, kg))),
                  (l = l || ld),
                  (_ = N[wg][l] = {}),
                  (_[Cp] = +x(p, Cp)),
                  (_[Bp] = +x(p, Bp)),
                  (_[xg] = x(p, xg)),
                  (_[_g] = x(p, _g)),
                  (_[Cp] > 35 || _[Bp] > 35) &&
                    (_[Cp] > _[Bp]
                      ? ((_[Bp] = (_[Bp] / _[Cp]) * 35), (_[Cp] = 35))
                      : _[Cp] < _[Bp]
                      ? ((_[Cp] = (_[Cp] / _[Bp]) * 35), (_[Bp] = 35))
                      : ((_[Cp] = 35), (_[Bp] = 35))),
                  (_[Yl] = x(p, Yl) ? o(x(p, Yl)) : 0),
                  (_[cs] = x(p, cs) ? o(x(p, cs)) : 0),
                  (_[cs] += _[Yl]),
                  (_[Lc] = t(k(Nc, p)[0])),
                  pn(p, Mw))
                ) {
                  if (((p = k(Mw, p)[0]), (_[Sh] = t(k(zw, p)[0])), pn(p, Hw))) {
                    for (p = k(Hw, p), _[Rh] = [], a = 0; a < p[rs]; a++) g(t(p[a])) && _[Rh][ds](t(p[a]));
                    p = p[0][Po];
                  }
                  p = p[Po];
                }
                if (pn(p, Gw)) for (p = k(Gw, p), _[Ww] = [], a = 0; a < p[rs]; a++) g(t(p[a])) && _[Ww][ds](t(p[a]));
              }
            d = d[Po];
          }
          if (((l = Eh + js + uo), pn(d, l))) {
            if (((d = k(l, d)[0]), (l = Eh), pn(d, l)))
              for (p = k(l, d), c = 0; c < p[rs]; c++)
                (I = x(p[c], Us)),
                  I === bh
                    ? ((l = b(o(x(p[c], Yl)))),
                      e(N[bh + Th][l]) && (N[bh + Th][l] = []),
                      g(t(p[c])) && N[bh + Th][l][ds](t(p[c])))
                    : !e(N[I + Th]) && g(t(p[c])) && N[I + Th][ds](t(p[c]));
            d = d[Po];
          }
          if (((l = Qf + Ih + uo), pn(d, l))) {
            if (((d = k(l, d)[0]), (l = Ih + hh), pn(d, l) && (N[Sh] = t(k(l, d)[0])), (l = Ih + Eh), pn(d, l))) {
              for (d = k(l, d), c = 0; c < d[rs]; c++) g(t(d[c])) && N[mh + Th][ds](t(d[c]));
              d = d[0][Po];
            }
            d = d[Po];
          }
          if (((l = Fw), pn(u, l) && ((d = k(l, u)[0]), pn(d, Ya))))
            for (d = k(Ya, d), c = 0; c < d[rs]; c++)
              if (((p = d[c]), (h = {}), pn(p, Nc))) {
                if (
                  ((h[Lc] = k(Nc, p)[0]),
                  (h[wo] = x(h[Lc], iw)),
                  (h[jc] = t(h[Lc])),
                  (h[Vd] = _c),
                  (h[Cp] = +x(p, Cp)),
                  (h[Bp] = +x(p, Bp)),
                  (l = Ya + Ih + hh),
                  pn(p, l) && (h[Sh] = t(k(l, p)[0])),
                  (l = Ya + Ih + Eh),
                  pn(p, l))
                ) {
                  for (h[mh + Th] = [], p = k(l, p), a = 0; a < p[rs]; a++) h[mh + Th][ds](t(p[a]));
                  p = d[c];
                }
                if (((l = Eh), pn(p, l)))
                  for (p = k(l, p), h[Zh + Th] = [], a = 0; a < p[rs]; a++)
                    x(p[a], Us) === Zh && h[Zh + Th][ds](t(p[a]));
                N[Ja][Nw](h);
              }
          if (((l = Rg), pn(u, l)))
            for (d = k(l, u)[0], l = Sg, pn(d, l) && (d = k(l, d)), c = 0; c < d[rs]; c++)
              if ((p = x(d[c], wo)))
                if (p === du) {
                  for (h = {}, p = d[c][hw], a = 0; a < p[rs]; a++) 3 !== p[a][Eo] && (h[p[a][So]] = t(p[a]));
                  e(h[Yv]) || (sf = h[Yv]), e(h[$v]) || (df = h[$v]);
                } else if ('as-ad-ext' === p) (p = d[c]), (N[Bg][ou] = cn(t(p)));
                else if ('as-cs-ext' === p) {
                  if (!zf) return nr(N, !1, 405, 'Advert violates site preferences (snippets)'), void E();
                  N[Bg][ll] = t(d[c]);
                }
          e(T)
            ? ((N[Bd + hv] = S), y())
            : (N[ru]++,
              N[ru] > 5
                ? (nr(N, !1, Tb, 'Wrapper fetch limit hit'), E())
                : z
                ? ((z = B), (N[tu + kh] = T), w(T), A())
                : (nr(N, !1, Ib, 'Unable to fetch wrapped tag due to VAST 3.0 directive'), E()));
        }
        function w(n) {
          (R = new XMLHttpRequest()),
            (R[my] = function() {
              if (4 === R[bd])
                if (R[qd] === kb)
                  if ((dn(P), e(R[Nd]) || '{' !== R[Nd][Rs](0, 1))) p(e(R[Fd]) || r(R[Fd]) ? K[Ts](R[Od], hd) : R[Fd]);
                  else {
                    var n,
                      i,
                      t = cn(R[Nd]);
                    if (e(t[No]))
                      return nr(N, !1, N[ru] > 0 ? Eb : Vb, 'Unable to fetch adId from JSON data'), void E();
                    if (((N[_v] = t[_v]), (N[$w] = t[No]), e(t[xh]) || (N[xh] = t[xh]), e(t[rw]))) p(K[Ts](t[gd], hd));
                    else {
                      if (((n = t[fw + Ks + Cp]), (i = t[fw + Ks + Bp]), c === cc)) {
                        if (n > Sb || i > Cb)
                          return (
                            nr(N, !1, 203, 'Unsupported size recieved for FPT snippet. w: ' + n + ' h: ' + i), void E()
                          );
                      } else {
                        if (c !== yc)
                          return nr(N, !1, 200, 'Recieved snippet advert for unsupported ad type'), void E();
                        if (n <= Eb && i <= _b && i > gb) N[Ao] = Rc;
                        else if (n >= Eb && n <= Sb) N[Ao] = i > bb ? Sc : _c;
                        else {
                          if (!(i <= bb))
                            return (
                              nr(N, !1, 203, 'Unsupported size recieved for Banner snippet. w: ' + n + ' h: ' + i),
                              void E()
                            );
                          N[Ao] = _c;
                        }
                      }
                      (N[Bg][ll] = t[rw]), y();
                    }
                  }
                else
                  0 !== R[qd] &&
                    (nr(
                      N,
                      !1,
                      N[ru] > 0 ? Eb : Vb,
                      'Aborted fetching advert due to non-200 status (' +
                        b(R[qd]) +
                        (r(R[Od]) ? '' : ' - ' + h(R[Od])) +
                        ')'
                    ),
                    E());
            }),
            (R[gy] = function() {
              nr(
                N,
                !1,
                N[ru] > 0 ? Eb : Vb,
                'Tag fetching failed due to error (CORS/Bad status)' + (r(R[Od]) ? '' : ' - ' + h(R[Od]))
              ),
                E();
            }),
            T || (T = Pn()),
            R[_l]('GET', ui(n, Wc, bf, bf, bf, T), !0),
            R[ys]();
        }
        function y() {
          function n() {
            if (!e(p)) {
              var n = [Za, nu, iu];
              for (m > 240 && !V() ? n[Nw](iu) : m >= Ab && !V() && n[Nw](nu), F = 0; F < n[rs]; F++)
                if (!e(p[n[F]])) return p[n[F]];
            }
          }
          function t(n, t) {
            var r, f;
            if (((v = N[Ja]), !e(v)))
              for (F = 0; F < v[rs]; F++)
                if (
                  ((r = v[F][Cp]),
                  (f = v[F][Bp]),
                  (u = wo),
                  0 !== r &&
                    0 !== f &&
                    I(v[F][jc]) &&
                    v[F][Vd] === _c &&
                    !e(v[F][u]) &&
                    v[F][u][Ps](new RegExp(Ys + _d + $s + xd + $s + kd + $s + Ad + Js), 'gi') &&
                    ((r / f >= 3 && n === yc) || (n === Pw && r / f < 3)))
                ) {
                  a = [Zh + Th, mh + Th];
                  for (var o, c = 0, a = [Zh, mh]; c < a[rs]; c++)
                    (o = i(a[c])),
                      (h[t + o + $h] = !1),
                      (u = a[c] + Th),
                      (o += Th),
                      e(v[F][u]) || (d(h[t + o]) ? (h[t + o] = h[t + o][wl](v[F][u])) : (h[t + i(u)] = v[F][u]));
                  return (
                    (u = Sh),
                    e(v[F][u]) || (h[t + i(u)] = v[F][u]),
                    (h[t + i(Cp)] = r),
                    (h[t + i(Bp)] = f),
                    e(t) || (u = t),
                    v[F][jc]
                  );
                }
          }
          var f,
            o,
            u,
            v,
            l,
            p,
            m = Hu[Vp],
            h = {},
            w = N[Bg],
            y = ou,
            A = cu;
          if (
            (e(w[y])
              ? '' !== N[Ao]
                ? c === pc
                  ? (mf = N[Ao])
                  : c === yc && (f = N[Ao])
                : c === pc
                ? (mf = hc)
                : c === yc && (f = Cc)
              : ((l = w[y]),
                e(l[A]) || (p = l[A]),
                c === pc
                  ? ((u = mc), (mf = e(l[u]) ? ('' !== N[Ao] ? N[Ao] : hc) : l[u]))
                  : c === yc && ((u = Ac), (f = e(l[u]) ? ('' !== N[Ao] ? N[Ao] : Cc) : l[u]))),
            f === Bc && (f = Sc),
            (o = (function() {
              var n,
                t,
                e = N[od];
              if (0 !== e[rs] && '' !== e[0][us]) {
                for (
                  e = e[ps](function(n, i) {
                    function t(n, i, e) {
                      return n[e] > i[e] ? 1 : i[e] > n[e] ? -1 : e === Cp ? t(n, i, ss) : 0;
                    }
                    return t(n, i, Cp);
                  }),
                    F = 0;
                  F < e[rs];
                  F++
                )
                  I(e[F][us]) || (e[ls](F, 1), F--);
                for (
                  c === pc
                    ? (n = m)
                    : c === cc || (c === yc && f === Tc)
                    ? (n = Sb)
                    : c === yc && (n = f === _c ? m : f === Ec ? 136 : Eb),
                    t = e[0],
                    S(t[us]) && (n = +B(t[us], Cp)),
                    F = 0;
                  F < e[rs];
                  F++
                )
                  136 === e[F][Cp] && (h[Ec + i(Dc)] = e[F][us]),
                    (c === cc || (c === yc && f === Tc)) && !S(t[us]) && S(e[F][us])
                      ? ((t = e[F]), (n = +B(t[us], Cp)))
                      : e[F][Cp] >= n &&
                        (e[F][Cp] < t[Cp] || t[Cp] < n) &&
                        (e[F][Cp] === t[Cp] || (c === cc && !S(e[F][us]) && S(t[us])) || (t = e[F]));
                return t[us];
              }
            })()),
            o && (e(N[cs]) ? (h[cs] = 30.1234) : (h[cs] = N[cs])),
            (function() {
              if (!e(l)) {
                for (
                  u = [
                    [xa],
                    [Sa],
                    [$p],
                    [Ba],
                    [uc + Ug + Th],
                    [uc + Fg + Th],
                    [Ra, 1],
                    [Jh, 1],
                    [Xw, 1],
                    [Ua],
                    [ja, 1],
                    [Kw, 1],
                    [mu, 1],
                    [ib, 1],
                    [gu, 1],
                    [Ig],
                  ],
                    F = 0;
                  F < u[rs];
                  F++
                )
                  e(l[u[F][0]]) ||
                    (g(u[F][1])
                      ? (h[u[F][0]] = g(s(b(l[u[F][0]])) ? b(l[u[F][0]]) : l[u[F][0]]))
                      : (h[u[F][0]] = l[u[F][0]]));
                if (
                  (h[mu] && (h[wu] = T),
                  e(h[Ba]) || h[Ba][vs](-1) === qs || (h[Ba] += qs),
                  e(h[$p]) || h[$p][vs](-1) === qs || (h[$p] += qs),
                  (v = null),
                  c !== cc || e(l[cc])
                    ? c === yc && f === Tc
                      ? ((u = Tc), (v = l[u]))
                      : e(l[Oc]) || ((u = Oc), (v = l[u]))
                    : ((u = cc), (v = l[u])),
                  !r(v) && !e(v))
                )
                  for (F = 0; F < v[rs]; F++)
                    !e(v[F][no]) &&
                      I(v[F][no]) &&
                      S(v[F][no]) &&
                      ((h[u + mo + F] = v[F][no]),
                      ii(h, u + mo + F, u),
                      e(v[F][Sh]) || (h[u + Bh + F] = v[F][Sh]),
                      e(v[F][Ch]) || (h[u + Ph + F] = v[F][Ch]));
                if (!e(p))
                  for (u = [Kc, ga, ka, ba, ma, ha, wa, Mc, ry], F = 0; F < u[rs]; F++)
                    e(p[u[F]]) || (h[u[F]] = p[u[F]]),
                      e(p[u[F] + Bh]) || (h[u[F] + Bh] = p[u[F] + Bh]),
                      e(p[u[F] + Uh]) || (h[u[F] + Uh] = p[u[F] + Uh]);
              }
              for (
                u = [
                  [Vg + Th],
                  [Og + Th],
                  [Hg + Th, qg + Th],
                  [Zg + Th, Qg + Th],
                  [th + Th, ih + Th],
                  [fh + Th, rh + Th],
                  [sh + Th],
                  [Gh + Th],
                  [Yh + Th],
                  [mh + Th],
                  [Zh + Th],
                  [cs],
                  [Sh],
                  [Gd + Th],
                  [dw + Th],
                  [Wd + Th],
                  [Jd + Th],
                  [Ca + Th],
                  [Yw],
                  [bh + Th],
                  [wg],
                  [Zo + kh],
                  [uc + iv],
                  [_v],
                  [Bd + hv],
                  [ml],
                  [xh],
                ],
                  F = 0;
                F < u[rs];
                F++
              )
                e(N[u[F][0]]) || (h[e(u[F][1]) ? u[F][0] : u[F][1]] = N[u[F][0]]);
            })(),
            (h[Cv + Do] = N[$w]),
            !e(h[Ig]) && !af)
          )
            return nr(N, !1, 200, 'Advert violates site preferences (extensions)'), E(), !1;
          if ((e(N[Bg][ll]) || (h[ll] = N[Bg][ll]), (h[Pu] = jf), c === pc)) {
            if (
              ((u = gc),
              e(l) || e(l[u]) ? (h[u] = N[$w]) : (h[u] = l[u]),
              (h[mc] = mf),
              ((mf === wc && !j()) || (mf === hc && !Vr)) && (o = n()),
              !o)
            )
              return nr(N, !1, 405, 'Unable to find video for MAL advert'), void E();
            (h[Cw] = o),
              (h[Dc] = o),
              (u = Kc),
              e(h[u]) && (h[u] = t(Pw, u)),
              (u = ga),
              e(h[u]) && (h[u] = t(yc, u)),
              (ff = h),
              nr(N, !0),
              yi();
          } else if (c === yc) {
            if (
              ((u = kc),
              e(l) || e(l[u]) ? (h[u] = N[$w]) : (h[u] = l[u]),
              (h[Ac] = f),
              ((f === _c && !j()) || (f === Cc && (L() || V() || U()))) && (o = n()),
              o && (h[Dc] = o),
              (u = Kc),
              e(h[u]) && (h[u] = t(Pw, u)),
              (u = ba),
              e(h[u]) && (h[u] = t(yc, u)),
              (u = ma),
              e(h[u]) && (h[u] = t(yc, u)),
              (f === Ec && !Lr) ||
                (f === Sc && !Nr) ||
                (f === Rc && !Dr) ||
                (f === _c && e(h[ba]) && e(h[ma]) && e(h[ll])))
            )
              return nr(N, !1, kb, 'Advert violates site preferences (allow flags)'), void E();
            if (uf && -1 !== Gf[ab](Kr) && (!e(N[Zo + kh]) || o)) return void E();
            if (!N[Zo + kh] || h[ib]) {
              if (
                vf &&
                (250 / Hu[jp]) * 100 > 27 &&
                (h[ib] || (h[ll] && N[Ao] === Rc)) &&
                (0 === Df[rs] || jf.bs === $c)
              )
                return nr(N, !1, kb, 'Unable to display cover/snippet due to BAS size restrictions'), void E();
              N[Zo + kh] || nr(N, !0);
            }
            if (((h[$w] = N[$w]), (h[Qw] = N[Qw]), (h[Jw] = N[Jw]), (h[ru] = N[ru]), Kf[ds](h), Kf[rs] < Df[rs] && !a))
              return void E();
            Et(a);
          } else if (c === cc) {
            if (
              (e(l) || e(l[ac]) ? (h[ac] = N[$w]) : (h[ac] = l[ac]),
              e(h[Ua]) && (h[Ua] = 'vcpm'),
              (!1 === o && e(h[Mc]) && !N[Zo + kh]) || (N[Zo + kh] && !Vr))
            )
              return nr(N, !1, kb, 'Unable to display advert for FPT type'), void E();
            if (
              (N[Zo + kh] ||
                (Vr || (o && S(o) && (u = o[bs](Gs)[1]), (o = n()), (o = o && S(u) ? H(o, u) : o)),
                o && (h[Dc] = o),
                (u = cc + mo + 0),
                e(h[u]) && (h[u] = t(yc, u))),
              uf && -1 !== Gf[ab](Kr) && (!e(N[Zo + kh]) || o))
            )
              return nr(N, !1, kb, 'CDS filter hit, cannot display advert'), void E();
            N[Zo + kh] ? ((h[$w] = N[$w]), (h[Qw] = N[Qw]), (h[Jw] = N[Jw]), (h[ru] = N[ru])) : nr(N, !0),
              (of = h),
              Yi();
          }
        }
        function A() {
          P = un(function() {
            R.abort(), nr(N, !1, Vb, 'Aborted fetching tag as timeout (' + O + ') was exceeded'), E();
          }, O);
        }
        function _(n) {
          var i, t;
          return e(rf)
            ? qf
              ? void un(function() {
                  _(n);
                }, kb)
              : ((qf = !0),
                void (1 === n
                  ? ((i = function() {
                      4 === this[bd] &&
                        (200 === this[qd]
                          ? ((rf = cn(this[Nd])),
                            !e(rf[uu]) && rf[uu] && (Ff = !0),
                            Ff ? E(!0) : (nr(N, !1, Vb, 'Aborted fetching advert as device failed verification'), E()))
                          : 0 !== this[qd] &&
                            ((qf = !1),
                            nr(N, !1, Vb, 'Aborted fetching advert as unable to verify device due to bad response'),
                            E()));
                    }),
                    (t = function() {
                      (qf = !1),
                        nr(N, !1, Vb, 'Aborted fetching advert as there was an error when verifying the device'),
                        E();
                    }),
                    Nn(
                      ui(xf + '/verify?' + $([Au, Kr, ku, Mr, gv, n, Iu, 'display', yh, h(is), Eu, N[$w], bu, Ur])),
                      i,
                      t
                    ))
                  : (nr(N, !1, Vb, 'Aborted fetching advert as unable to verify device (unknown verification mode)'),
                    E())))
            : void E(Ff);
        }
        function E(i) {
          if ((dn(P), f[rs] || i)) {
            if (!i) {
              if (
                (u(),
                (N[$w] = f[ms]()),
                (N[Jw] = n[N[$w]]),
                (N[Qw] = c),
                (N[Ao] = t[N[$w]]),
                (N[ml] = !o || e(o[N[$w]]) ? 0 : o[N[$w]]),
                uf && -1 !== Gf[ab](Kr) && 'rtb' === N[$w])
              )
                return void E();
              if (Uf && l(N[Jw], 'ani' + sw)) return void E();
              if (M(Yf, b(N[$w])) && (pf[0] > 0 || pf[1] > 1 || pf[2] > 3))
                return (
                  nr(
                    N,
                    !1,
                    Vb,
                    'Aborted advert due to failed violation check (' + pf[0] + $s + pf[1] + $s + pf[2] + ')'
                  ),
                  void E()
                );
              if (!Jf)
                return (
                  nr(
                    N,
                    !1,
                    Vb,
                    'Aborted advert due to failed site validty check (' +
                      Jf +
                      $s +
                      ur() +
                      ')' +
                      (e(xr) || e(xr[yh]) ? '' : ' - hn:' + Hu[Qu][Lw] + ' db:' + xr[yh])
                  ),
                  void E()
                );
              if (2026 == N[$w] && !e(Yr) && !e(Yr[2024]))
                return nr(N, !1, Vb, 'Aborted advert due to multiple player restrictions'), void E();
              if (+N[ml] && !Ff) {
                if (e(rf)) return void _(N[ml]);
                if (!Ff) return nr(N, !1, Vb, 'Aborted fetching advert as device failed verification'), void E();
              }
            }
            w(N[Jw]), A();
          } else c === yc ? (Kf[rs] > 0 ? Et() : Bt(Df)) : Ze(9, c);
        }
        var T,
          R,
          P,
          N,
          O = qb,
          F = 0,
          q = f[rs],
          K = new DOMParser(),
          z = !0;
        if (0 === q) return void (c === yc && Bt(e(a) ? Df : Df[a]));
        E();
      }
      function tr() {
        if (Sr && Tn(fu + Lc)) {
          Qe() && ((xr = []), (xr[Ng] = []), (xr[Ng][Ry] = uf), ar(200, 0));
        } else ar(400, 99);
      }
      function er(n) {
        Ir || ((Ar = cn(n)), fr());
      }
      function rr(n) {
        Ir ||
          ((xr = cn(n)),
          (Ur = e(xr[Ng]) || e(xr[Ng][Lu + Do]) ? ld : xr[Ng][Lu + Do]),
          e(xr[qd]) || xr[qd] != kb ? ar(e(xr[qd]) ? ld : xr[qd], 99) : 0 != xr[Vg] ? ar(xr[qd], xr[Vg]) : fr());
      }
      function fr() {
        if (!e(xr) && !e(Ar) && 0 === xr[Vg]) {
          for (
            var n, i, t, r, f, c, a, u, s = xr[Ng], v = s[du][xy], l = s[vu + Do], p = [Sl, xu, cc], b = 0;
            b < p[rs];
            b++
          )
            if (((t = Ar[p[b]]), (i = []), e(t[Vg])))
              if ((p[b] !== xu || or()) && (p[b] !== cc || (cr() && Or))) {
                for (r = t[Xa], f = t[pu], c = t[lu], o(r) && !d(r) && (r = d(r[v]) ? r[v] : []), n = 0; n < r[rs]; n++)
                  (a = r[n]), M(c[a], l[Is]()) && (M(f[a], v) || M(f[a], 'ALL')) && i[ds](a);
                i[rs] ? ((Ar[p[b]][Xa] = i), fn(Ar[p[b]], [lu, pu])) : (Ar[p[b]] = { error: 3 });
              } else Ar[p[b]] = { error: 2 };
            else Ze(t[Vg], p[b]);
          (u = gn(xr, Ar)), ar(xr[qd], 0), Qe(an(u));
        }
      }
      function or() {
        return e(hr) && (hr = Df[rs] > 0 || (!e(xr) && !e(xr[xu + Vu]) && Wu[bv]() < xr[xu + Vu])), hr;
      }
      function cr() {
        return e(wr) && (wr = Of[rs] > 0 || (!e(xr) && !e(xr[cc + Vu]) && Wu[bv]() < xr[cc + Vu])), wr;
      }
      function ar(n, i) {
        var t = ur(),
          r = sr(),
          f = 200 != n || 0 != i ? 0 : 1,
          o = Nf[rs] > 0 || zr ? 1 : 0,
          c = Df[rs] > 0 ? Df[rs] : or() ? 1 : 0,
          a = Of[rs] > 0 ? Of[rs] : cr() ? 1 : 0;
        (0 === o && 0 === c && 0 === a && 0 !== f) ||
          _r ||
          ((_r = !0),
          si(
            kf +
              '/getinfo?' +
              $([
                Au,
                Kr,
                ku,
                Mr,
                _u,
                e(Ur) ? ld : Ur,
                Bu,
                f,
                Sl,
                o,
                xu,
                c,
                cc,
                a,
                'mat',
                t,
                'cds',
                !C() || isNaN(xn()) || xn() < 56 ? 'n/a' : e(xr) || e(xr[Ng]) || e(xr[Ng][Ry]) ? ld : g(xr[Ng][Ry]),
                yh,
                h(is),
                Pu,
                h(qu.referrer),
                't1v',
                r[0],
                't2v',
                r[1],
                't3v',
                r[2],
              ])
          ));
      }
      function ur() {
        if (e(xr) || e(xr[yh]) || !xr[yh]) return ld;
        var n = xr[yh],
          i = on(n),
          t = i[Ps](/^.*(?=(\.))/)[0],
          r = Hu[Qu][Lw][Cs]('www.', '');
        return r === n
          ? ((Jf = !0), fw)
          : on(r) === i
          ? ((Jf = !0), 'tld')
          : l(r, t)
          ? ((Jf = !0), Mv)
          : ((Jf = !1), Xh + fw);
      }
      function sr() {
        if (e(pf)) {
          for (var n, i, t, f, o, a, u, s, d = k(oo), v = 0, l = is + Zs; v < d[rs]; v++)
            (f = d[v]),
              (o = x(f, gs)),
              c(o) &&
                (('keywords' !== (o = o[Bs]()) && 'description' !== o && 'news_keywords' !== o && o !== Aa) ||
                  (l += x(f, ws) + Zs));
          for (
            l += Dn(k('h1')[0]) + Zs, l += Dn(k('h2')[0]) + Zs, a = k(fo), u = k('p', k('article')[0]), v = 0;
            v < a[rs];
            v++
          )
            (s = Dn(a[v])) > 20 && (l += s + Zs);
          for (v = 0; v < u[rs]; v++) (s = Dn(u[v])) > 64 && s < 1e3 && (l += s + Zs);
          (n = l[Ps](
            /\banal\b|\bcunt\b|a2m|ballbag|ballsack|bangbros|bareback|beastiality|blowjob|bokep|cock|clit|coon|\bcum\b|cunilingus|dogging|fag|\bbj\b|fuck|fisting|fisted|gangbang|hentai|incest|\bJAV\b|jizz|nigg|orgy|porn|pussy|\brape\b|rimm|sadism|bdsm|\bsex\b|shemale|slope|slut|spunk|twat|wank|whore|xxx|sexualidade|sexuality|bersetubuh|perkosa|gigolo|prostitut|prostitusi|paraphilia|jual.diri|seks|menghamili|alat.bantu.syahwat|\bneng.dara\b|human.trafficking/gi
          )),
            (i = l[Ps](
              /\barse\b|\bass\b|amateur|\banus\b|autoerotic|bellend|boner|dick|dildo|chink|fanny|hardcore|hitler|muff|orgasm|piss|queer|shag|sodomy|tits|bugil|telanjang|bercinta|vibrator|orgasme|penis|vagina|ejakulasi|masturbasi|keperjakaan|kemaluan|kamasutra|pelecehan|kondom|masturbat|perawan|mesum|virgin|ereksi|erotis|waria|hajar.jahanam|berhubungan.intim|ejaculation|threesome|kontrasepsi|mr.p|foreplay|malam.pertama|klitoris|viagra|alat.vital|datang.bulan|clitoris|bokong/gi
            )),
            (t = l[Ps](
              /shit|bitch|boobs|balls|bastard|blow|bollocks|breasts|bugger|\bbum\b|butt|\bgay\b|knob|nazi|lesbian|selingkuh|sperm|menstruasi|haid|nipple|kontrasepsi|hymen|nightlife|rambut.kemaluan|payudara|pembangkit.gairah|18\+|condom|maut|libido|kencing|cewek|assault|attack|shocking|serem/gi
            )),
            (n = r(n) ? 0 : n[rs]),
            (i = r(i) ? 0 : i[rs]),
            (t = r(t) ? 0 : t[rs]),
            (pf = [n, i, t]);
        }
        return pf;
      }
      function dr(n) {
        if (e(Ur) || e(cf))
          return void un(function() {
            dr(n);
          }, _b);
        if (!cf)
          for (var i, t, r = cn(n), f = 0, o = qr[xy]; f < r[rs]; f++)
            (i = r[f]),
              e(i[gv]) ||
                (!M(i[du], 'ALL') && !M(i[du], o)) ||
                (i[gv] === no
                  ? si(ui(i[yh]))
                  : i[gv] === to && ((t = R(to)), Y(t, sb), _(t, [us], ui(i[yh])), zu[ho](t)));
      }
      function vr(n) {
        Qe(n);
      }
      function lr(n) {
        Un(n);
      }
      function pr(n) {
        return wi(n);
      }
      function br(n) {
        er(n);
      }
      function mr(n) {
        rr(n);
      }
      function gr(n) {
        dr(n);
      }
      var hr,
        wr,
        yr,
        Ar,
        kr,
        xr,
        _r,
        Er,
        Tr,
        Ir,
        Sr,
        Br,
        Rr,
        Cr,
        Pr,
        Ur,
        jr,
        Vr,
        Lr,
        Nr,
        Dr,
        Or,
        Fr,
        qr,
        Kr,
        Mr,
        zr,
        Hr,
        Gr,
        Wr,
        Xr,
        Yr,
        Jr,
        $r,
        Qr,
        Zr,
        nf,
        tf,
        ef,
        rf,
        ff,
        of,
        cf,
        af,
        uf,
        sf,
        df,
        vf,
        lf,
        pf,
        bf,
        mf,
        gf,
        hf,
        wf,
        yf,
        Af = '//sdk.adspruce.com',
        kf = '//track.adspruce.com',
        xf = '//info.adspruce.com',
        _f = '//queue.adspruce.com/%%pid%%/%%sid%%/list.js',
        Ef = '//assets.adspruce.com/adk/2/',
        Tf = xf + '/info?pid=%%pid%%&sid=%%sid%%',
        If =
          '//sdk.adsongo.com/stl-txn?pid=%%pid%%&sid=%%sid%%&aid=%%advertId%%&uuid=%%uuid&&&ast=%%spot%%&atp=%%type%%&ts=%%timestamp%%&',
        Sf = !0,
        Bf = 'v3.12.2b',
        Rf = 0,
        Cf = n(),
        Pf = [],
        Uf = 0,
        jf = {},
        Vf = [],
        Lf = !1,
        Nf = [],
        Df = [],
        Of = [],
        Ff = !1,
        qf = !1,
        Kf = [],
        Mf = !1,
        zf = !1,
        Hf = !1,
        Gf = [3088, 3778, 3239],
        Wf = '2.0',
        Xf = [],
        Yf = [1510, 1534, 2024, 2026, 2028, 2030, 2032],
        Jf = !1,
        $f = 'video',
        Qf = i($f),
        Zf = 'script',
        no = 'image',
        io = i('frame'),
        to = 'iframe',
        eo = 'div',
        ro = 'img',
        fo = 'a',
        oo = 'meta',
        co = 'head',
        ao = 'element',
        uo = 's',
        so = 'set',
        vo = 'get',
        lo = ao + uo,
        po = i(ao),
        bo = i(lo),
        mo = i(no),
        go = i('child'),
        ho = 'append' + go,
        wo = 'type',
        yo = i(wo),
        Ao = 'suggested' + yo,
        ko = 'className',
        xo = 'node',
        _o = i(xo),
        Eo = xo + yo,
        To = i('value'),
        Io = xo + To,
        So = xo + 'Name',
        Bo = 'first' + go,
        Ro = 'remove',
        Co = Ro + go,
        Po = 'parent' + _o,
        Uo = 'isSame' + _o,
        jo = 'before',
        Vo = i(jo),
        Lo = 'insert' + Vo,
        No = 'id',
        Do = i(No),
        Oo = vo + po + 'By' + Do,
        Fo = vo + bo + 'By' + i('class') + 'Name',
        qo = 'tag',
        Ko = i(qo),
        Mo = vo + bo + 'By' + Ko + 'Name',
        zo = so + 'Attribute',
        Ho = vo + 'Attribute',
        Go = Ro + 'Attribute',
        Wo = 'create',
        Xo = Wo + po,
        Yo = i('count'),
        Jo = 'child' + po + Yo,
        $o = 0x45ddbf4d757da,
        Qo = '9134075993162501',
        Zo = 'vpaid',
        nc = i(Zo),
        ic = 'adk',
        tc = 'apiFramework',
        ec = 'adspruce',
        rc = ec + '.js',
        fc = ec + qo + '.js',
        oc = oc + '.js',
        cc = 'fpt',
        ac = cc + Do,
        uc = 'ad',
        sc = 'spot',
        dc = sc + uo,
        vc = uc + sc,
        lc = 'processor',
        pc = 'preroll',
        bc = uc + 'vert',
        mc = bc + yo,
        gc = bc + Do,
        hc = 'vastlive',
        wc = 'vastio',
        yc = 'banner',
        Ac = yc + yo,
        kc = yc + Do,
        xc = 'bAdvert',
        _c = 'static',
        Ec = 'minipop',
        Tc = 'initiator',
        Ic = i(Tc),
        Sc = 'videobanner',
        Bc = 'svb',
        Rc = 'lvb',
        Cc = 'all',
        Pc = 8,
        Uc = 'ima',
        jc = 'source',
        Vc = i(jc),
        Lc = 're' + jc,
        Nc = i(_c) + i(Lc),
        Dc = 'clip' + Vc,
        Oc = 'endcard',
        Fc = i(Oc),
        qc = Oc + 'Mp',
        Kc = Oc + 'Bg',
        Mc = cc + 'Bg',
        zc = 'comp',
        Hc = i(zc),
        Gc = 'post',
        Wc = 'request',
        Xc = i(Wc),
        Yc = i(lc),
        Jc = 'WaitingForAction',
        $c = 'sticky_',
        Qc = 'time',
        Zc = i(Qc),
        na = Zc + 'r',
        ia = Qc + 'update',
        ta = i(ia),
        ea = io + $u,
        ra = 'ios' + ea,
        fa = 'ld',
        oa = 'rd',
        ca = 'vid',
        aa = fa + ca,
        ua = fa + 'overlay',
        sa = 'dec',
        da = 'hs',
        va = 'tab',
        la = 'expand',
        pa = 'sync' + Zc,
        ba = yc + Hc,
        ma = _c + Hc,
        ga = pc + Hc,
        ha = Bc + mo,
        wa = Ec + i(Oc),
        ya = 'v' + Hc,
        Aa = 'title',
        ka = Aa + yc,
        xa = 'estimatedCpm',
        _a = 'background',
        Ea = 'color',
        Ta = i(Ea),
        Ia = i('modal'),
        Sa = 'modal' + i(_a),
        Ba = 'modalBg' + Ta,
        Ra = 'isRepeatable',
        Ca = 'skip',
        Pa = i(Ca),
        Ua = 'pm',
        ja = 'expandable',
        Va = 'lastAnimType',
        La = 'partial',
        Na = 'full',
        Da = i(Na),
        Oa = 'hide',
        Fa = 'scroll',
        qa = 'load',
        Ka = qa + 'ing',
        Ma = 'on',
        za = Ma + 'touch',
        Ha = Ma + qa,
        Ga = 'style=cover',
        Wa = 'Opera Mini',
        Xa = 'order',
        Ya = i('companion'),
        Ja = 'companion' + uo,
        $a = 'swapped',
        Qa = i('link'),
        Za = 'qcif' + Qa,
        nu = 'qvga' + Qa,
        iu = 'tablet' + Qa,
        tu = 'wrapper',
        eu = i(tu),
        ru = tu + Yo,
        fu = 'as_',
        ou = 'asExt',
        cu = 'assets',
        au = 'vendor',
        uu = 'valid',
        su = uu + '_ip',
        du = 'geo',
        vu = 'device',
        lu = vu + uo,
        pu = 'countries',
        bu = 'uuid',
        mu = 'roll_to_vod',
        gu = 'click_to_play',
        hu = i('chrome'),
        wu = 'vod',
        yu = 'log',
        Au = 'pid',
        ku = 'sid',
        xu = 'ban',
        _u = 'uid',
        Eu = 'aid',
        Tu = 'typ',
        Iu = 'req',
        Su = 'cnt',
        Bu = 'suc',
        Ru = 'evt',
        Cu = 'med',
        Pu = 'ref',
        Uu = 'ver',
        ju = 'cb',
        Vu = 'Freq',
        Lu = 'unique',
        Nu = 'et_opt',
        Du = 'et_' + gv,
        Ou = 'int',
        Fu = 'ext',
        qu = document,
        Ku = 'body',
        Mu = 'document',
        zu = qu[Ku],
        Hu = window,
        Gu = 'null',
        Wu = Math,
        Xu = 'Window',
        Yu = 'write',
        Ju = 'can',
        $u = 'r',
        Qu = 'location',
        Zu = 'href',
        ns = 'true',
        is = Hu[Qu][Zu],
        ts = navigator,
        es = ts.userAgent,
        rs = 'length',
        fs = 'innerHTML',
        os = 'current' + Zc,
        cs = 'duration',
        as = i(cs),
        us = 'src',
        ss = 'bitrate',
        ds = 'push',
        vs = 'slice',
        ls = 'splice',
        ps = 'sort',
        bs = 'split',
        ms = 'shift',
        gs = 'name',
        hs = 'parse',
        ws = 'content',
        ys = uo + 'end',
        As = i(ws),
        ks = i('point'),
        xs = ao + 'From' + ks,
        _s = 'string',
        Es = i(_s),
        Ts = hs + 'From' + Es,
        Is = 'to' + Es,
        Ss = 'toUpperCase',
        Bs = 'toLowerCase',
        Rs = 'sub' + _s,
        Cs = 'replace',
        Ps = 'match',
        Us = 'event',
        js = i(Us),
        Vs = 'stop',
        Ls = Vs + 'Propagation',
        Ns = 'default',
        Ds = 'prevent' + i(Ns),
        Os = 'px',
        Fs = ':',
        qs = ';',
        Ks = '_',
        Ms = '-',
        zs = '=',
        Hs = '.',
        Gs = '?',
        Ws = '&',
        Xs = '/',
        Ys = '(',
        Js = ')',
        $s = '|',
        Qs = '&nbsp;',
        Zs = ' ',
        nd = '%',
        id = '#',
        td = 'resize',
        ed = i(td),
        rd = 'focus',
        fd = 'blur',
        od = 'media',
        cd = i(od),
        ad = 'file',
        ud = i(ad),
        sd = 'Listener' + uo,
        dd = 'add' + js + 'Listener',
        vd = Ro + js + 'Listener',
        ld = 'unknown',
        pd = 'round',
        bd = 'readyState',
        md = i('text'),
        gd = 'xml',
        hd = 'text' + Xs + gd,
        wd = $f + Xs + 'mp4',
        yd = $f + Xs + 'webm',
        Ad = no + Xs + 'jpg',
        kd = no + Xs + 'jpeg',
        xd = no + Xs + 'png',
        _d = no + Xs + 'gif',
        Ed = 'application/x-shockwave-flash',
        Td = 'application/javascript',
        Id = 'application/x-javascript',
        Sd = 'javascript:void(0)',
        Bd = 'linear',
        Rd = i(Bd),
        Cd = 'non' + Rd,
        Pd = 'InLine',
        Ud = 'version',
        jd = i(Ud),
        Vd = 'format',
        Ld = 'model',
        Nd = 'response',
        Dd = i(Nd),
        Od = Nd + md,
        Fd = Nd + 'XML',
        qd = 'status',
        Kd = 'screen',
        Md = i(Kd),
        zd = i('accept'),
        Hd = 'Invitation',
        Gd = 'accept' + Hd + Rd,
        Wd = Na + Kd,
        Xd = i(Wd),
        Yd = 'exit',
        Jd = Yd + Xd,
        $d = i(Jd),
        Qd = 'Enter',
        Zd = Wc + Xd,
        nv = i(Zd),
        iv = 'Parameters',
        tv = 'handshake',
        ev = 'resume',
        rv = 'subscribe',
        fv = 'slot',
        ov = i(fv),
        cv = 'normal',
        av = i('change'),
        uv = 'State',
        sv = 'Remaining',
        dv = 'Interaction',
        vv = 'User',
        lv = 'Minimize',
        pv = 'previous',
        bv = 'random',
        mv = 'apply',
        gv = 'mode',
        hv = i(gv),
        wv = 'test' + gv,
        yv = 'layer',
        Av = i(yv),
        kv = Av + uo,
        xv = 'go',
        _v = 'price',
        Ev = 'allow',
        Tv = 'yume',
        Iv = 'lkqd',
        Sv = 'aol',
        Bv = 'innovid',
        Rv = 'blank',
        Cv = 'connect',
        Pv = 'takeover',
        Uv = 'mal',
        jv = 'video-pub-9134075993162501',
        Vv = 'code',
        Lv = i(Vv),
        Nv = 'message',
        Dv = i(Nv),
        Ov = 'async',
        Fv = 'dispatch',
        qv = 'performance',
        Kv = 'timing',
        Mv = 'domain',
        zv = 'Lookup',
        Hv = 'dom',
        Gv = i(Hv),
        Wv = 'interactive',
        Xv = 'not fired',
        Yv = Yo + 'ry',
        Jv = 'bandwidth',
        $v = i(Jv) + 'Kbps',
        Qv = '___ASSETURI___',
        Zv = 'localStorage',
        nl = 'Item',
        il = 'failed',
        tl = i(il),
        el = 'Serve',
        rl = 'Success',
        fl = 'google',
        ol = 'light',
        cl = 'stack',
        al = 'no',
        ul = 'col',
        sl = 'xx',
        dl = 'logo',
        vl = 'Cancel',
        ll = 'snippet',
        pl = i(ll) + uo,
        bl = 'origin',
        ml = 'verify',
        gl = 'display',
        hl = 'trim',
        wl = 'concat',
        yl = 'web',
        Al = yl + 'kit',
        kl = 'moz',
        xl = 'ms',
        _l = 'open',
        El = 'close',
        Tl = i(El),
        Il = 'scoped',
        Sl = 'pre',
        Bl = Sl + qa,
        Rl = 'view',
        Cl = i(Rl),
        Pl = Rl + 'port',
        Ul = 'auto',
        jl = i(Ul),
        Vl = Fa + 'To',
        Ll = Vl + 'p',
        Nl = Fa + 'Y',
        Dl = 'index',
        Ol = i(Dl),
        Fl = 'z' + Ol,
        ql = 'float',
        Kl = 'top',
        Ml = i(Kl),
        zl = 'bottom',
        Hl = 'left',
        Gl = i(Hl),
        Wl = 'right',
        Xl = 'center',
        Yl = 'offset',
        Jl = i(Yl),
        $l = Yl + Gl,
        Ql = Yl + Ml,
        Zl = Yl + i('parent'),
        np = i('page'),
        ip = 'pageX',
        tp = 'pageY',
        ep = ip + Jl,
        rp = tp + Jl,
        fp = 'opacity',
        op = i('size'),
        cp = 'font' + op,
        ap = 'text' + i('align'),
        up = 'style',
        sp = vo + 'Computed' + i(up),
        dp = 'cssText',
        vp = 'position',
        lp = i(vp),
        pp = 'relative',
        bp = 'absolute',
        mp = 'fixed',
        gp = 'visibility',
        hp = 'hidden',
        wp = 'visible',
        yp = 'collapse',
        Ap = 'overflow',
        kp = 'display',
        xp = 'block',
        _p = 'none',
        Ep = 'init',
        Tp = 'line',
        Ip = 'in' + Tp,
        Sp = i(Ip),
        Bp = 'height',
        Rp = i(Bp),
        Cp = 'width',
        Pp = i(Cp),
        Up = 'client',
        jp = 'inner' + Rp,
        Vp = 'inner' + Pp,
        Lp = Up + Rp,
        Np = Up + Pp,
        Dp = 'natural' + Rp,
        Op = 'natural' + Pp,
        Fp = 'max',
        qp = Fp + Pp,
        Kp = Tp + Rp,
        Mp = 'border',
        zp = 'padding',
        Hp = zp + Ml,
        Gp = 'margin',
        Wp = Gp + Gl,
        Xp = Gp + Ml,
        Yp = _a + mo,
        Jp = _a + i(vp),
        $p = _a + Ta,
        Qp = _a + op,
        Zp = _a + i('repeat'),
        nb = 'no-repeat',
        ib = 'cover',
        tb = 'contain',
        eb = tb + uo,
        rb = i(tb) + 'er',
        fb =
          $f +
          Fs +
          Fs +
          '-webkit-' +
          od +
          '-controls{' +
          kp +
          Fs +
          _p +
          '!important;' +
          gp +
          Fs +
          hp +
          qs +
          fp +
          Fs +
          '0;}',
        ob = '-ms-touch-action:' + _p + qs,
        cb = 'transparent',
        ab = Dl + 'Of',
        ub = 'zoom',
        sb = gp + Fs + hp + qs + Bp + ':0;' + Cp + ':0;' + Mp + ':0;',
        db = 0.02,
        vb = 0.05,
        lb = 0.033,
        pb = 24,
        bb = 50,
        mb = 60.5,
        gb = 100,
        hb = 152,
        wb = 168,
        yb = 169,
        Ab = 180,
        kb = 200,
        xb = 201,
        _b = 250,
        Eb = 300,
        Tb = 302,
        Ib = 303,
        Sb = 320,
        Bb = 400,
        Rb = 403,
        Cb = 480,
        Pb = 500,
        Ub = 600,
        jb = 750,
        Vb = 900,
        Lb = 901,
        Nb = 1e3,
        Db = 1500,
        Ob = 2e3,
        Fb = 4999,
        qb = 5e3,
        Kb = 6e3,
        Mb = 1e4,
        zb = 1999999,
        Hb = 2999999,
        Gb = 6e6,
        Wb = 65e5,
        Xb = Wb + Pb,
        Yb = Xb + 10,
        Jb = 216e5,
        $b = 2147483647,
        Qb = '#000000',
        Zb = '#FFFFFF',
        nm = '#03A9F4;',
        im = '-168px',
        tm = '0 auto',
        em = '1px',
        rm = '1.04%',
        fm = '1.56%',
        om = 2,
        cm = 3,
        am = '5px',
        um = '6.25%',
        sm = '9.375%',
        dm = '8px',
        vm = '10px',
        lm = '12px',
        pm = '12.5%',
        bm = '18px',
        mm = 18.75,
        gm = '20px',
        hm = 20.8,
        wm = '22px',
        ym = '25px',
        Am = 28.125,
        km = '30px',
        xm = '31px',
        _m = 31.25,
        Em = '32px',
        Tm = 35.2,
        Im = '37.5',
        Sm = 45.9,
        Bm = '48px',
        Rm = bb + nd,
        Cm = '55%',
        Pm = bb + Os,
        Um = '64px',
        jm = '76px',
        Vm = '85px',
        Lm = '90%',
        Nm = 93.75,
        Dm = '95%',
        Om = '100%',
        Fm = gb + Os,
        qm = '120px',
        Km = '135px',
        Mm = '142px',
        zm = '167px',
        Hm = yb + Os,
        Gm = '178px',
        Wm = kb + Os,
        Xm = _b + Os,
        Ym = Eb + Os,
        Jm = Sb + Os,
        $m = Cb + Os,
        Qm = 'text' + Ms + 'align',
        Zm = 'text-decoration',
        ng = 'text-shadow',
        ig = _a + Ms + Ea,
        tg = _a + Ms + no,
        eg = _a + Ms + vp,
        rg = _a + Ms + 'size',
        fg = _a + Ms + 'repeat',
        og = Gp + Ms + Hl,
        cg = Gp + Ms + Wl,
        ag = 'z-' + Dl,
        ug = Fp + Ms + Bp,
        sg = ' !important',
        dg = 'font' + Ms + 'family',
        vg = 'font' + Ms + 'size',
        lg = 'font' + Ms + 'weight',
        pg = zp + Ms + Hl,
        bg = zp + Ms + Kl,
        mg = zp + Ms + zl,
        gg =
          'rgb(0,0,0);' +
          _a +
          ':' +
          cb +
          '9;' +
          _a +
          ':rgba(0,0,0,0.7);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#b2000000,endColorstr=#b2000000)',
        hg = Tp + Ms + Bp,
        wg = 'icon' + uo,
        yg = i('icon'),
        Ag = i(wg),
        kg = 'program',
        xg = 'x' + lp,
        _g = 'y' + lp,
        Eg = 'sequence',
        Tg = 'followAdditional' + eu + uo,
        Ig = 'extensionURL',
        Sg = i('extension'),
        Bg = 'extension' + uo,
        Rg = i(Bg),
        Cg = qa + 'ed',
        Pg = i(qa),
        Ug = Pg + 'ed',
        jg = Pg + 'er',
        Vg = 'error',
        Lg = i(Vg),
        Ng = 'data',
        Dg = i(Ng),
        Og = 'impression',
        Fg = i(Og),
        qg = 'play',
        Kg = i(qg),
        Mg = qg + 'ing',
        zg = i(Mg),
        Hg = 'start',
        Gg = i(Hg),
        Wg = Gg + 'ed',
        Xg = 'pause',
        Yg = 'd',
        Jg = Xg + Yg,
        $g = i(Jg),
        Qg = 'q1',
        Zg = 'firstQuartile',
        nh = i(Zg),
        ih = 'mid',
        th = 'midpoint',
        eh = i(th),
        rh = 'q3',
        fh = 'thirdQuartile',
        oh = i(fh),
        ch = 'ninety',
        ah = 'ended',
        uh = i(ah),
        sh = 'complete',
        dh = i(sh),
        vh = Pa + 'ped',
        lh = Pa + 'pable',
        ph = i(Vs) + 'ped',
        bh = 'progress',
        mh = 'click',
        gh = 'through',
        hh = i(gh),
        wh = 'Thru',
        yh = 'url',
        Ah = yh + uo,
        kh = i(yh),
        xh = 'track',
        _h = i(xh),
        Eh = _h + 'ing',
        Th = _h + 'ers',
        Ih = i(mh),
        Sh = mh + kh,
        Bh = i(Sh),
        Rh = mh + Th,
        Ch = Rh[vs](0, -1),
        Ph = i(Ch),
        Uh = i(Rh),
        jh = 'touch' + Hg,
        Vh = 'touchend',
        Lh = 'touchmove',
        Nh = 'MSPointer' + i('move'),
        Dh = 'MSPointerDown',
        Oh = 'MSPointerUp',
        Fh = i(Ju),
        qh = Ju + qg,
        Kh = Ma + qh,
        Mh = Kh + gh,
        zh = 'volume',
        Hh = i(zh),
        Gh = 'mute',
        Wh = i(Gh),
        Xh = 'un',
        Yh = Xh + Gh,
        Jh = Gh + Yg,
        $h = 'Pinged',
        Qh = i(uc),
        Zh = 'creative' + Cl,
        nw = i(Zh),
        iw = 'creative' + yo,
        tw = 'url("',
        ew = '")',
        rw = 'markup',
        fw = 'matched',
        ow = 'uScore',
        cw = 'psgScore',
        aw = 'text' + As,
        uw = Ma + Yd,
        sw = Hs + ec + Hs + 'com',
        dw = El + Rd,
        vw = Wc + 'AnimationFrame',
        lw = Xc + 'AnimationFrame',
        pw = Ip + Ks,
        bw = Ju + Kg + Sp,
        mw = xo + uo,
        gw = i(mw),
        hw = 'child' + gw,
        ww = i(la),
        yw = la + 'ed',
        Aw = i(yw),
        kw = 'has' + Aw,
        xw = 'sync' + gw,
        _w = Ec + Aw,
        Ew = Ma + mh,
        Tw = ec + Ms + 'cpi',
        Iw = la + 'er',
        Sw = Iw + As,
        Bw = qg + uo + Ip,
        Rw = Al + Ms + Bw,
        Cw = uc + Vc,
        Pw = Gc + 'er',
        Uw = ec + Ms + yc + sc,
        jw = ec + Ms + 'streamlink',
        Vw = ec + Ms + Na + 'page',
        Lw = 'host' + gs,
        Nw = Xh + ms,
        Dw = 'first' + po + go,
        Ow = 'next' + po + 'Sibling',
        Fw = Ya + Qh + uo,
        qw = Al + 'end' + Wd,
        Kw = mh + 'To' + Xd,
        Mw = yg + Ih + uo,
        zw = yg + Ih + hh,
        Hw = yg + Ih + Eh,
        Gw = yg + Cl + Eh,
        Ww = Rl + Th,
        Xw = Ju + Pa,
        Yw = Ca + Yl,
        Jw = Wc + kh,
        $w = Jw + Do,
        Qw = Wc + yo,
        Zw = Zo[Ss](),
        ny = vo + Zw + Qh,
        iy = Xh + rv,
        ty = 'os',
        ey = ty + jd,
        ry = Tc + 'Bg',
        fy = Tc + Tl,
        oy = fy + Ia,
        cy = Tc + ed + na,
        ay = Tc + kv,
        uy = Tc + ea,
        sy = Tc + Qf + rb,
        dy = Tc + Wh + 'Switch',
        vy = Tc + eu,
        ly = Tc + rb,
        py = yc + ww + $h,
        by = vo + Qh,
        my = Ma + bd[Bs]() + 'change',
        gy = Ma + Vg,
        hy = fu + Lc + Ks + Qc,
        wy = ec + Yd + 'linkexclude',
        yy = 'publisher_id',
        Ay = 'site_id',
        ky = Kl + '_level_' + Mv,
        xy = 'country_' + Vv,
        _y = Qc + '_since_',
        Ey = _y + ic + Ks + qa,
        Ty = _y + 'page' + Ks + Hg,
        Iy = 'App' + js + uo,
        Sy = ec + Ms + cc + Ms + tu,
        By = 'change' + Yg + i('touch') + 'es',
        Ry = 'chrome' + Dg + 'Saver',
        Cy = _b,
        Py = Kb;
      Cr = {
        mute: Ef + 'btn-mute.png',
        unmute: Ef + 'btn-unmute.png',
        expand: Ef + 'btn-expand.png',
        collapse: Ef + 'btn-close.png',
        close: Ef + 'btn-close.png',
        cont: Ef + 'b-continue-1456x180.png',
        lm: Ef + 'b-learn-more-1456x180.png',
        lm6_1: Ef + 'b-learn-more-600x100.png',
        endcard: Ef + 'b-end-card-1200x678.png',
        endcardMp: Ef + 'b-end-card-270x152.png',
        titlebanner: Ef + 'b-title-banner-600x62.png',
        accompany: Ef + 'b-accompany-284x200.png',
        loading: Ef + 'loader-128x128.gif',
        poster: Ef + 'b-poster-600x338.png',
        logo: Ef + 'ads-by-adspruce-300x40.png',
        blank: Ef + 'blank.png',
        exitclose: Ef + 'exit-close.png',
        video: '//video.adspruce.com/white-30s.mp4',
      };
      var Uy = function(n) {
          return (
            0 === n[ab]('//') && (n = Hu[Qu].protocol + n),
            n[Bs]()
              [Cs](/([a-z])?:\/\//, '$1')
              [bs](Xs)[0]
          );
        },
        jy = function(n) {
          return (n[ab](Fs) > -1 || n[ab]('//') > -1) && Uy(Hu[Qu][Zu]) !== Uy(n);
        };
      (gf = J([Kl, 0, Hl, 0, Wl, 0, zl, 0])),
        (hf = J([vp, bp], gf)),
        (wf = J([fg, nb, eg, Rm])),
        (yf = J([rg, tb], wf)),
        (jf.lt = 0),
        (jf.tt = null);
      var Vy,
        Ly = 0,
        Ny = 0;
      (jf.bfc = !0), (jf.aup = !0), Hu[dd](Nv, Zn, !1);
      var Dy,
        Oy,
        Fy,
        qy,
        Ky,
        My,
        zy,
        Hy,
        Gy = {
          a: B,
          b: pi,
          c: it,
          d: tt,
          e: si,
          f: ti,
          g: j,
          h: Yn,
          i: Jn,
          j: wn,
          k: b,
          l: un,
          m: sn,
          n: dn,
          o: n,
          p: l,
          q: R,
          r: o,
          s: _,
          t: $n,
          u: Rn,
          v: v,
          w: J,
          x: i,
          y: oi,
          z: bn,
          _: di,
          0: fi,
          1: De,
          2: f,
          3: m,
          4: mn,
          5: fn,
          6: ki,
          7: Cn,
          8: Mt,
          9: xt,
          A: _t,
          B: Ln,
          C: function() {
            return xr;
          },
          D: hi,
          E: ui,
        };
      return (
        (l(is, 'as_canary=1') || Wu[bv]() < 0) && !0,
        !(function() {
          switch (qu.readyState) {
            case sh:
            case Wv:
              return 1;
            default:
              return;
          }
        })()
          ? (qu[dd]('DOM' + As + Ug, Je), Hu[dd](qa, Je))
          : Je(),
        {
          ld: vr,
          ge: function() {
            return Pf;
          },
          vp: lr,
          fb: pr,
          gi: br,
          gd: mr,
          cs: gr,
        }
      );
    })();
//# sourceMappingURL=http://sdk-v2.test:9080/minification/live-source-map.js.map
