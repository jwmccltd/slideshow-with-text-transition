import { openBlock as i, createElementBlock as o, createElementVNode as l, Fragment as _, renderList as x, normalizeClass as a, toDisplayString as p, createCommentVNode as h, useCssVars as g } from "vue";
const b = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [u, s] of e)
    n[u] = s;
  return n;
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
    for (let t of JSON.parse(this.displayData)) {
      let e = t.colours;
      typeof t.colours > "u" && (e = null), this.textColours.push(e);
    }
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
      //Array for button actions,
      textColours: [],
      //Array for text colours
      typeSteps: 0,
      // Initialise the number of steps for typing animation,
      textAnimation: "jwm-slides_typing 3s steps(30, end)",
      //Default for typing animation,
      textColour: "white",
      //Text colour
      buttonBorder: "2px solid white",
      //Button border initialise,
      buttonHoverTextColour: "white",
      //Colour to show on hover (button colour will use initial text colour)
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
      this.textColour = this.textColours[this.pos] == null ? "white" : this.textColours[this.pos].text_colour, this.buttonBorder = "2px solid " + this.textColour, this.buttonHoverTextColour = this.textColours[this.pos] == null ? "black" : this.textColours[this.pos].hover_text_colour, this.text = [];
      for (let n of this.texts[this.pos])
        this.text.push({ text: n, active: !1 });
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
}, c = () => {
  g((t) => ({
    "721a3158": t.textColour,
    "418de47c": t.zoomDuration,
    "0abbe7dc": t.zoomScale,
    f06f8eda: t.imageHolderHeight,
    "9d4fb608": t.textAnimation,
    "269e9539": t.buttonBorder,
    "088abd70": t.buttonHoverTextColour
  }));
}, f = d.setup;
d.setup = f ? (t, e) => (c(), f(t, e)) : c;
const y = { class: "jwm-slides_outer" }, v = { class: "jwm-slides_text-holder" }, w = { class: "jwm-slides_text" }, S = ["href", "target"], T = ["id"], C = { class: "jwm-slides_image-holder" }, A = { key: 0 }, j = ["src"];
function B(t, e, n, u, s, D) {
  return i(), o("div", y, [
    l("div", v, [
      (i(!0), o(_, null, x(s.text, (r, m) => (i(), o("div", { key: m }, [
        r.active == !0 ? (i(), o("div", {
          key: 0,
          class: a(["jwm-slides_text-animate", { active: r.active == !0 }])
        }, [
          l("h1", w, p(r.text), 1)
        ], 2)) : h("", !0)
      ]))), 128)),
      s.btnText.length > 0 ? (i(), o("a", {
        key: 0,
        href: s.btnAction.link,
        target: s.btnAction.target ?? "_self",
        class: "jwm-slides_btn_anchor"
      }, [
        l("button", {
          class: a(["jwm-slides_button", { toggle: s.toggleActionBtn == !0, show: s.showBtn == !0 }]),
          ref: "jwm-slide_button",
          id: "jwm-slide_button_id_" + s.pos
        }, p(s.btnText), 11, T)
      ], 8, S)) : h("", !0)
    ]),
    l("div", C, [
      s.slideFile != "" ? (i(), o("div", A, [
        l("img", {
          class: a(["jwm-slides_zoom", { active: s.active == !0 }]),
          src: s.slideFile
        }, null, 10, j)
      ])) : h("", !0)
    ])
  ]);
}
const N = /* @__PURE__ */ b(d, [["render", B]]);
export {
  N as Slides
};
