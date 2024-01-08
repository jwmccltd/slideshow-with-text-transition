import Slides from "./components/Slides.vue";

export default {
  install: (app, options) => {
    app.component("Slides", Slides);	
  },
};
