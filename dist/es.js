import { useCssVars as J, computed as C, ref as a, onMounted as M, onUnmounted as U, openBlock as i, createElementBlock as u, createElementVNode as x, Fragment as q, renderList as G, toDisplayString as H, createCommentVNode as I, normalizeClass as L } from "vue";
const K = { class: "jwm-slides_outer" }, P = { class: "jwm-slides_text-holder" }, Q = {
  key: 0,
  class: "jwm-slides_text-animate active"
}, R = { class: "jwm-slides_text" }, W = ["href", "target"], X = ["id"], Y = { class: "jwm-slides_image-holder" }, Z = ["src"], te = {
  __name: "Slides",
  props: {
    // JSON-encoded array containing slide, text, button and action data.
    displayData: {
      type: String,
      required: !0
    },
    // Duration of each slide in seconds.
    duration: {
      type: Number,
      default: 10
    },
    // Height of the container.
    imageHolderHeight: {
      type: String,
      default: "550px"
    },
    // Delay between text lines in milliseconds.
    switchTextLine: {
      type: Number,
      default: 5e3
    },
    typingSpeed: {
      type: String,
      default: "medium"
    },
    zoomScale: {
      type: String,
      default: "scale(2.5)"
    }
  },
  setup(f) {
    J((e) => ({
      "5502f23c": y.value,
      "795b01d0": F.value,
      d0d1c2e4: f.zoomScale,
      debac576: f.imageHolderHeight,
      "5b74b2ae": j.value,
      "7e7eed72": k.value,
      dae1460c: A.value
    }));
    const r = f, c = C(() => {
      try {
        const e = JSON.parse(r.displayData);
        return Array.isArray(e) ? e : [];
      } catch (e) {
        return console.error("Unable to parse displayData as JSON:", e), [];
      }
    }), d = a(""), n = a([]), v = a(0), m = a(!1), j = a("jwm-slides_typing 3s steps(30, end)"), y = a("white"), k = a("2px solid white"), A = a("white"), _ = a(!1), p = a(!1), h = a(""), g = a(null), F = C(() => `transform ${r.duration}s`);
    let $, D, N, T, b, w;
    const S = () => {
      clearTimeout(N), clearInterval(T), clearTimeout(b), clearTimeout(w);
    }, O = (e) => {
      const l = {
        fast: [2, 1, 0.5],
        medium: [3, 2, 1],
        slow: [4, 3, 2]
      }, t = l[r.typingSpeed] ?? l.medium;
      let s = t[0], o = 30;
      e.length < 30 && (s = t[1], o = 20), e.length < 10 && (s = t[2], o = 10), j.value = `jwm-slides_typing ${s}s steps(${o}, end)`;
    }, z = (e) => {
      const l = c.value[e];
      if (!l) {
        d.value = "", h.value = "", g.value = null, n.value = [];
        return;
      }
      v.value = e, d.value = l.slide ?? "", h.value = l.btn_text ?? "", g.value = l.btn_action ?? null;
      const t = l.colours;
      y.value = (t == null ? void 0 : t.text_colour) ?? "white", k.value = `2px solid ${y.value}`, A.value = (t == null ? void 0 : t.hover_text_colour) ?? "black", p.value = !1, _.value = !1, n.value = (Array.isArray(l.text) ? l.text : []).map(
        (s) => ({ text: String(s), active: !1 })
      );
    }, B = () => {
      if (S(), n.value.length === 0) {
        b = setTimeout(() => {
          p.value = !0, w = setTimeout(() => {
            _.value = !0;
          }, 50);
        }, 500);
        return;
      }
      let e = 0;
      const l = () => {
        const t = n.value[e];
        t && (t.active = !0, O(t.text), e += 1, e >= n.value.length && (clearInterval(T), b = setTimeout(() => {
          p.value = !0, w = setTimeout(() => {
            _.value = !0;
          }, 50);
        }, 500)));
      };
      N = setTimeout(() => {
        l(), e < n.value.length && (T = setInterval(l, r.switchTextLine));
      }, 50);
    }, V = () => {
      if (c.value.length === 0)
        return;
      S(), m.value = !m.value;
      const e = (v.value + 1) % c.value.length;
      z(e), B();
    };
    return M(() => {
      c.value.length !== 0 && (z(0), D = setTimeout(() => {
        m.value = !0, B(), $ = setInterval(
          V,
          Math.max(0, r.duration) * 1e3
        );
      }, 100));
    }), U(() => {
      clearTimeout(D), clearInterval($), S();
    }), (e, l) => {
      var t, s;
      return i(), u("div", K, [
        x("div", P, [
          (i(!0), u(q, null, G(n.value, (o, E) => (i(), u("div", {
            key: `${v.value}-${E}`
          }, [
            o.active ? (i(), u("div", Q, [
              x("h1", R, H(o.text), 1)
            ])) : I("", !0)
          ]))), 128)),
          h.value.length > 0 ? (i(), u("a", {
            key: 0,
            href: ((t = g.value) == null ? void 0 : t.link) || "#",
            target: ((s = g.value) == null ? void 0 : s.target) ?? "_self",
            class: "jwm-slides_btn_anchor"
          }, [
            x("button", {
              class: L(["jwm-slides_button", { toggle: _.value, show: p.value }]),
              id: `jwm-slide_button_id_${v.value}`,
              type: "button"
            }, H(h.value), 11, X)
          ], 8, W)) : I("", !0)
        ]),
        x("div", Y, [
          d.value ? (i(), u("img", {
            key: 0,
            class: L(["jwm-slides_zoom", { active: m.value }]),
            src: d.value,
            alt: ""
          }, null, 10, Z)) : I("", !0)
        ])
      ]);
    };
  }
};
export {
  te as Slides
};
