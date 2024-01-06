const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {  
      entry: path.resolve(__dirname, "src/index.js"),
      name: "slideshow-zoom-with-text-animation",
      fileName: (format) => `${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: { 
        globals: {
          vue: "Vue",
	},	
      },	      
    }	     
  },	  

  plugins: [vue()],
})
