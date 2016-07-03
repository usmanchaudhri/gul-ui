! function(t) {
    "use strict";
    t.module("imageCropper", [])
}(angular),
function(t) {
    "use strict";
    t.module("imageCropper").constant("defaultConfig", {
        width: 400,
        height: 300,
        zoomStep: .1,
        init: null,
        showControls: !0,
        fitOnInit: !1
    })
}(angular),
function(t) {
    "use strict";

    function e(t) {
        function e(t) {
            return r.test(t.type)
        }

        function n(t) {
            return e(t) ? 1 === t.originalEvent.changedTouches.length : 1 === t.which
        }

        function i(t) {
            return e(t) && (t = t.originalEvent.touches[0]), {
                x: t.pageX,
                y: t.pageY
            }
        }

        function o() {
            if (null !== a) return a;
            var t, e, n, i, o, r, u, l, s;
            for (n = ["webkit", "Moz", "O", "ms", "Khtml"], r = {
                    transform: "transform"
                }, l = 0, s = n.length; s > l; l++) e = n[l], r[e + "Transform"] = "-" + e.toLowerCase() + "-transform";
            t = document.createElement("img"), document.body.insertBefore(t, null);
            for (o in r)
                if (i = r[o], void 0 !== t.style[o] && (t.style[o] = "rotate(90deg)", u = window.getComputedStyle(t).getPropertyValue(i), null !== u && u.length && "none" !== u)) {
                    a = !0;
                    break
                }
            return document.body.removeChild(t), a
        }
        var r = /touch/i,
            a = null,
            u = {
                canTransform: o,
                getPointerPosition: i,
                isTouch: e,
                validEvent: n
            };
        return u
    }
    t.module("imageCropper").factory("Helper", e), e.$inject = ["defaultConfig"]
}(angular),
function(t) {
    "use strict";

    function e(t, e) {
        function n(t, n, o, s) {
            return r = document.createElement("canvas"), r.width = o, r.height = s, a = r.getContext("2d"), l = n, c = e.defer(), u = new Image, u.src = t.src, u.onload = i, c.promise
        }

        function i() {
            return a.save(), a.scale(l.scale, l.scale), a.rotate(l.angle * Math.PI / 180), 90 === l.angle ? (a.translate(0, -u.height), a.translate(-l.y / l.scale, l.x / l.scale)) : 180 === l.angle ? (a.translate(-u.width, -u.height), a.translate(l.x / l.scale, l.y / l.scale)) : 270 === l.angle ? (a.translate(-u.width, 0), a.translate(l.y / l.scale, -l.x / l.scale)) : a.translate(-l.x / l.scale, -l.y / l.scale), a.drawImage(u, 0, 0), a.restore(), s = r.toDataURL("image/png"), c.resolve(s)
        }

        function o() {
            return s
        }
        var r, a, u, l, s, c, g = {
            crop: n,
            get: o
        };
        return g
    }
    t.module("imageCropper").factory("Cropper", e), e.$inject = ["Helper", "$q"]
}(angular),
function(t) {
    "use strict";

    function e(e, n, i) {
        function o(o, r, a) {
            var u = !1,
                l = t.element("body"),
                s = r.find("img"),
                c = r.find(".imgCropper-canvas"),
                g = r.find(".imgCropper-window"),
                d = {};
            d.width = Number(o.destWidth) || n.width, d.height = Number(o.destHeight) || n.height, d.zoomStep = Number(o.zoomStep) || n.zoomStep, d.init = o.init || n.init, d.fitOnInit = o.fitOnInit || n.fitOnInit;
            var h, f, m, p, v, y = 1 + d.zoomStep,
                w = 1 / y,
                b = d.height / d.width;
            h = f = m = p = v = 0;
            var C, x = {
                    scale: 1,
                    angle: 0,
                    x: 0,
                    y: 0,
                    w: d.width,
                    h: d.height
                },
                I = {
                    start: "touchstart mousedown",
                    move: "touchmove mousemove",
                    stop: "touchend mouseup"
                },
                k = function() {
                    h = s[0].naturalWidth / d.width, f = s[0].naturalHeight / d.height, c.css({
                        width: 100 * h + "%",
                        height: 100 * f + "%",
                        top: 0,
                        left: 0
                    }), g.css({
                        width: "100%",
                        height: "auto",
                        "padding-top": d.height / d.width * 100 + "%"
                    }), u = !0
                },
                z = function(t) {
                    return u && i.validEvent(t) ? (t.preventDefault(), t.stopImmediatePropagation(), C = i.getPointerPosition(t), P()) : void 0
                },
                P = function() {
                    return l.addClass("imgCropper-dragging"), c.on(I.move, E), c.on(I.stop, O)
                },
                O = function(t) {
                    l.removeClass("imgCropper-dragging"), c.off(I.move, E), c.off(I.stop, O)
                },
                H = function(t, e) {
                    return (t || 0 === t) && (0 > t && (t = 0), t > h - 1 && (t = h - 1), c[0].style.left = (100 * -t).toFixed(2) + "%", m = t, x.x = Math.round(t * d.width)), (e || 0 === e) && (0 > e && (e = 0), e > f - 1 && (e = f - 1), c[0].style.top = (100 * -e).toFixed(2) + "%", p = e, x.y = Math.round(e * d.height)), T()
                },
                E = function(t) {
                    var e, n, o, r, a;
                    return t.preventDefault(), t.stopImmediatePropagation(), r = i.getPointerPosition(t), e = r.x - C.x, n = r.y - C.y, C = r, o = 0 === e ? null : m - e / g[0].clientWidth, a = 0 === n ? null : p - n / g[0].clientHeight, H(o, a)
                },
                F = function(t) {
                    var e, n, i, o;
                    if (!(0 >= t || 1 === t)) return o = h, e = f, o * t > 1 && e * t > 1 ? (h *= t, f *= t, c[0].style.width = (100 * h).toFixed(2) + "%", c[0].style.height = (100 * f).toFixed(2) + "%", x.scale *= t) : (S(), t = h / o), n = (m + .5) * t - .5, i = (p + .5) * t - .5, H(n, i)
                },
                S = function() {
                    var t, e;
                    return t = h, e = f / h, e > 1 ? (h = 1, f = e) : (h = 1 / e, f = 1), c[0].style.width = (100 * h).toFixed(2) + "%", c[0].style.height = (100 * f).toFixed(2) + "%", x.scale *= h / t, T()
                },
                j = function() {
                    return H((h - 1) / 2, (f - 1) / 2)
                },
                R = function(t) {
                    var e, n, o, r, a, u;
                    if (i.canTransform() && 0 !== t && t % 90 === 0) return v = (v + t) % 360, 0 > v && (v = 360 + v), t % 180 !== 0 && (r = [f * b, h / b], h = r[0], f = r[1], h >= 1 && f >= 1 ? (c[0].style.width = 100 * h + "%", c[0].style.height = 100 * f + "%") : S()), a = [1, 1], o = a[0], n = a[1], v % 180 !== 0 && (e = f / h * b, u = [e, 1 / e], o = u[0], n = u[1]), s[0].style.width = 100 * o + "%", s[0].style.height = 100 * n + "%", s[0].style.left = (1 - o) / 2 * 100 + "%", s[0].style.top = (1 - n) / 2 * 100 + "%", s.css({
                        transform: "rotate(" + v + "deg)"
                    }), j(), x.angle = v, T()
                };
            o.rotateLeft = function() {
                R(-90)
            }, o.rotateRight = function() {
                R(90)
            }, o.center = function() {
                j()
            }, o.fit = function() {
                S(), j()
            }, o.zoomIn = function() {
                F(y)
            }, o.zoomOut = function() {
                F(w), T()
            };
            var T = function() {
                e.crop(s[0], x, d.width, d.height).then(function(t) {
                    o.croppedImage = t
                })
            };
            s[0].onload = function() {
                var t = this;
                k(), W(s), (t.naturalWidth < d.width || t.naturalHeight < d.height || d.fitOnInit) && S(), j(), r.find("img").on(I.start, z), T()
            };
            var W = function(e) {
                return t.element(e).css({
                    "-webkit-perspective": 1e3,
                    perspective: 1e3,
                    "-webkit-backface-visibility": "hidden",
                    "backface-visibility": "hidden"
                })
            }
        }
        return {
            restrict: "E",
            scope: {
                image: "@",
                destWidth: "@",
                destHeight: "@",
                zoomStep: "@",
                init: "@",
                croppedImage: "=",
                showControls: "=",
                fitOnInit: "="
            },
            template: ['<div class="frame">', '<div class="col-sm-12 text-center imgCropper-window">', '<div class="imgCropper-canvas">', '<img ng-src="{{image}}">', "</div></div></div>", '<div id="controls" ng-if="showControls">', '<button class="btn btn-default" ng-click="rotateLeft()" type="button" title="Rotate left"> &lt; </button>', '<button class="btn btn-default" ng-click="zoomOut()" type="button" title="Zoom out"> - </button>', '<button class="btn btn-default" ng-click="fit()" type="button" title="Fit image"> [ ] </button>', '<button class="btn btn-default" ng-click="zoomIn()" type="button" title="Zoom in"> + </button>', '<button class="btn btn-default" ng-click="rotateRight()" type="button" title="Rotate right"> &gt; </button>', "</div>"].join(""),
            link: o
        }
    }
    t.module("imageCropper").directive("imageCropper", e), e.$inject = ["Cropper", "defaultConfig", "Helper"]
}(angular);