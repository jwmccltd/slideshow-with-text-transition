import { openBlock as i, createElementBlock as n, createElementVNode as l, Fragment as _, renderList as g, normalizeClass as r, toDisplayString as p, createCommentVNode as h, useCssVars as x } from "vue";
const y = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [c, s] of e)
    o[c] = s;
  return o;
}, d = {
  props: {
    /* JSON encoded array containing paths for slides, text, btns and action */
    displayData: {
      type: String,
      required: !0
    },
    /* Duration of slide transition */
    duration: {
      type: Number,
      required: !1,
      default: 10
    },
    /* Height of container */
    imageHolderHeight: {
      type: String,
      required: !1,
      default: "550px"
    },
    switchTextLine: {
      type: Number,
      required: !1,
      default: 5e3
    },
    typingSpeed: {
      type: String,
      required: !1,
      default: "medium"
    },
    zoomScale: {
      type: String,
      required: !1,
      default: "scale(2.5)"
    }
  },
  created() {
    for (let t of JSON.parse(this.displayData))
      this.images.push(t.slide);
    for (let t of JSON.parse(this.displayData))
      this.texts.push(t.text);
    for (let t of JSON.parse(this.displayData))
      this.btnLabels.push(t.btn_text);
    for (let t of JSON.parse(this.displayData))
      this.btnActions.push(t.btn_action);
  },
  mounted() {
    this.zoomDuration = "transform " + this.duration + "s";
    let t = this.duration * 1e3;
    this.loadFile(), setTimeout(() => {
      this.animate(), this.loadText(), this.pos++, setInterval(() => {
        this.showBtn = !1, this.toggleActionBtn = !1, this.loadFile(), this.animate(), this.loadText(), this.pos++, typeof this.images[this.pos] > "u" && (this.pos = 0);
      }, t);
    }, 100);
  },
  data() {
    return {
      slideFile: "",
      //Holds current set slide
      text: [],
      //Array to hold text, set for each slide transition
      pos: 0,
      //Increment for slide switching
      active: !1,
      //Initialis to false, switch to true to start slide animation
      zoomDuration: "",
      //Used to store duration prop multiplied by 1000 for milliseconds
      images: [],
      //Array for image paths
      texts: [],
      //Array for text
      btnLabels: [],
      //Array for button label
      btnActions: [],
      //Array for button actions
      typeSteps: 0,
      // Initialise the number of steps for typing animation,
      textAnimation: "jwm-slides_typing 3s steps(30, end)",
      //Default for typing animation
      toggleActionBtn: !1,
      //Set to false. Set to true to fade in action button
      showBtn: !1,
      //Additional control to show/hide button, used to hide glitchy behaviour of transition when hiding button,
      btnText: "",
      //Button text. Set on transition
      btnAction: ""
      //Btn action. Set on transition
    };
  },
  methods: {
    /**
     * Toggle slide animation. Setting to !this.active will toggle the image to zoom in and out respectively
     */
    animate() {
      this.active = !this.active;
    },
    /**
     * Load file. Set the slide file to the next image in array based on pos
     */
    loadFile() {
      this.slideFile = this.images[this.pos], this.btnText = this.btnLabels[this.pos], this.btnAction = this.btnActions[this.pos];
    },
    /**
     * Based on text length set typing animation in css 
     * 
     * @param string text
     */
    setTypingStyle(t) {
      let e = [3, 2, 1];
      this.typingSpeed == "fast" && (e = [2, 1, 0.5]), this.typingSpeed == "slow" && (e = [4, 3, 2]), this.textAnimation = "jwm-slides_typing " + e[0] + "s steps(30, end)", t.length < 30 && (this.textAnimation = "jwm-slides_typing " + e[1] + "s steps(20, end)"), t.length < 10 && (this.textAnimation = "jwm-slides_typing " + e[2] + "s steps(10, end)");
    },
    /**
     * Load the text
     */
    loadText() {
      this.text = [];
      for (let o of this.texts[this.pos])
        this.text.push({ text: o, active: !1 });
      let t = 0;
      setTimeout(() => {
        this.text[t].active = !0, this.setTypingStyle(this.text[t].text), t++;
      }, 50);
      let e = setInterval(() => {
        typeof this.text[t] < "u" && (this.text[t].active = !0, this.setTypingStyle(this.text[t].text)), typeof this.text[t + 1] > "u" && (setTimeout(() => {
          this.showBtn = !0, setTimeout(() => {
            this.toggleActionBtn = !0;
          }, 50);
        }, 500), clearInterval(e)), t++;
      }, this.switchTextLine);
    }
  }
}, u = () => {
  x((t) => ({
    "5ce2b28d": t.zoomDuration,
    fc8b221e: t.zoomScale,
    "60ecdaa8": t.imageHolderHeight,
    "2e39ccde": t.textAnimation
  }));
}, m = d.setup;
d.setup = m ? (t, e) => (u(), m(t, e)) : u;
const b = { class: "jwm-slides_outer" }, v = { class: "jwm-slides_text-holder" }, w = { class: "jwm-slides_text" }, S = ["href", "target"], A = ["id"], T = { class: "jwm-slides_image-holder" }, j = { key: 0 }, B = ["src"];
function D(t, e, o, c, s, F) {
  return i(), n("div", b, [
    l("div", v, [
      (i(!0), n(_, null, g(s.text, (a, f) => (i(), n("div", { key: f }, [
        a.active == !0 ? (i(), n("div", {
          key: 0,
          class: r(["jwm-slides_text-animate", { active: a.active == !0 }])
        }, [
          l("h1", w, p(a.text), 1)
        ], 2)) : h("", !0)
      ]))), 128)),
      s.btnText.length > 0 ? (i(), n("a", {
        key: 0,
        href: s.btnAction.link,
        target: s.btnAction.target ?? "_self",
        class: "jwm-slides_btn_anchor"
      }, [
        l("button", {
          class: r(["jwm-slides_button", { toggle: s.toggleActionBtn == !0, show: s.showBtn == !0 }]),
          ref: "jwm-slide_button",
          id: "jwm-slide_button_id_" + s.pos
        }, p(s.btnText), 11, A)
      ], 8, S)) : h("", !0)
    ]),
    l("div", T, [
      s.slideFile != "" ? (i(), n("div", j, [
        l("img", {
          class: r(["jwm-slides_zoom", { active: s.active == !0 }]),
          src: s.slideFile
        }, null, 10, B)
      ])) : h("", !0)
    ])
  ]);
}
const k = /* @__PURE__ */ y(d, [["render", D]]), z = {
  install: (t, e) => {
    t.component("Slides", k);
  }
};
export {
  z as default
};
