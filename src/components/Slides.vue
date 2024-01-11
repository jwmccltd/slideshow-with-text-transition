<template>
    <div class="jwm-slides_outer">

        <!-- Text Section -->
        <div class="jwm-slides_text-holder">
            <div v-for="(t, i) of text" :key="i">
                <div class="jwm-slides_text-animate" v-if="t.active == true" :class="{ 'active' : t.active == true }">
                    <h1 class="jwm-slides_text">{{ t.text }}</h1>
                </div>
            </div>
            <a :href="btnAction.link" :target="btnAction.target ?? '_self' " v-if="btnText.length > 0" class="jwm-slides_btn_anchor">
                <button  class="jwm-slides_button" ref="jwm-slide_button" :id="'jwm-slide_button_id_'+pos" :class="{ 'toggle': toggleActionBtn == true, 'show': showBtn == true }">{{ btnText }}</button> 
            </a>       
        </div>

        <!-- Image Section -->
        <div class="jwm-slides_image-holder">
            <div v-if="slideFile != ''">
                <img class="jwm-slides_zoom" :class="{ 'active' : active == true }" :src="slideFile">
            </div>
        </div>
    </div>
</template>

<script>

export default {

    props: {
        /* JSON encoded array containing paths for slides, text, btns and action */
        displayData: {
            type: String,
            required: true
        },
        /* Duration of slide transition */
        duration: {
            type: Number,
            required: false,
            default: 10
        },
        /* Height of container */
        imageHolderHeight: {
            type: String,
            required: false,
            default: '550px'
        },
        switchTextLine: {
            type: Number,
            required: false,
            default: 5000
        },
        typingSpeed: {
            type: String,
            required: false,
            default: 'medium'
        },
        zoomScale: {
            type: String,
            required: false,
            default: 'scale(2.5)'
        }
    },

    created() {

        //Load images from json data
        for (let f of JSON.parse(this.displayData)) {
            this.images.push(f.slide);
        }

        //Load text from json data
        for (let t of JSON.parse(this.displayData)) {
            this.texts.push(t.text);
        }

        //Load btn labels
        for (let t of JSON.parse(this.displayData)) {
            this.btnLabels.push(t.btn_text);
        }

        //Load btn actions
        for (let a of JSON.parse(this.displayData)) {
            this.btnActions.push(a.btn_action);
        }
    },

    mounted() {

        this.zoomDuration = 'transform '+this.duration+'s';

        //Convert seconds to milliseconds
        let mil = this.duration * 1000;

        this.loadFile();
        //Initial render to trigger animation. Small time out so that DOM change is picked up and animation starts
        setTimeout(() => {
            this.animate();
            this.loadText();

            this.pos++;

            //Continue animation until stop, or infinite
            setInterval(() => {
                this.showBtn = false;
                this.toggleActionBtn = false;

                this.loadFile();
                this.animate();

                this.loadText();

                this.pos++;
                if (typeof this.images[this.pos] == 'undefined') {
                    this.pos = 0;
                }
            }, mil);

        }, 100);

        

    },

    data() {
        return {
            slideFile: '', //Holds current set slide
            text: [], //Array to hold text, set for each slide transition
            pos: 0, //Increment for slide switching

            active: false, //Initialis to false, switch to true to start slide animation
 
            zoomDuration: '', //Used to store duration prop multiplied by 1000 for milliseconds
            images: [], //Array for image paths
            texts: [], //Array for text
            btnLabels: [], //Array for button label
            btnActions: [], //Array for button actions

            typeSteps: 0, // Initialise the number of steps for typing animation,
            textAnimation: 'jwm-slides_typing 3s steps(30, end)', //Default for typing animation

            toggleActionBtn: false, //Set to false. Set to true to fade in action button
            showBtn: false, //Additional control to show/hide button, used to hide glitchy behaviour of transition when hiding button,

            btnText: '', //Button text. Set on transition
            btnAction: '', //Btn action. Set on transition
        }
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
            this.slideFile = this.images[this.pos];
            this.btnText = this.btnLabels[this.pos];
            this.btnAction = this.btnActions[this.pos];
        },

        /**
         * Based on text length set typing animation in css 
         * 
         * @param string text
         */
        setTypingStyle(text) {

            let speeds = [3, 2, 1];

            if (this.typingSpeed == 'fast') {
                speeds = [2, 1, 0.5];
            }

            if (this.typingSpeed == 'slow') {
                speeds = [4, 3, 2];
            }

            this.textAnimation = 'jwm-slides_typing '+speeds[0]+'s steps(30, end)';

            if (text.length < 30) {
                this.textAnimation = 'jwm-slides_typing '+speeds[1]+'s steps(20, end)';
            }
            if (text.length < 10) {
                this.textAnimation = 'jwm-slides_typing '+speeds[2]+'s steps(10, end)';
            }
        },

        /**
         * Load the text
         */
        loadText() {

            this.text = [];

            //Loop the n number of text in the array. Each item will show as a typing animation on a new line
            for (let t of this.texts[this.pos]) {
                this.text.push({ text: t, active: false })
            }

            let i = 0; //Initialise this to the first array text item

            setTimeout(() => {
                 this.text[i].active = true;
                 this.setTypingStyle(this.text[i].text);
                 i++;
            }, 50);    

            //Repeat the pattern for showing text until there is no more text for the given slide
            let inter = setInterval(() => {

                if (typeof this.text[i] != 'undefined')
                {
                    this.text[i].active = true;
                    this.setTypingStyle(this.text[i].text);
                }
    
                //If not defined, show the action button and clear the interval
                if (typeof this.text[i+1] == 'undefined') {
                  
                    setTimeout(() => {
                        this.showBtn = true;

                        setTimeout(() => {
                            this.toggleActionBtn = true;
                        }, 50);    
            
                    }, 500);   
                    
                    clearInterval(inter);

                }

                i++;
            }, this.switchTextLine); 

        }

    }
    
}    

</script>

<style>

/* Text colour for slide text */
.jwm-slides_text {
    color: white;
}

/* Transition for zooming image in and out, with bound duration */
.jwm-slides_zoom {
    transition: v-bind('zoomDuration');
    width: 100%;
}

/* Toggele slide animation */
.jwm-slides_zoom.active {
    transform: v-bind('zoomScale');
}    

/* Holders for images and outer holder */
.jwm-slides_image-holder, .jwm-slides_outer {
    height: v-bind('imageHolderHeight');	
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center; 
}

/* Div to hold text */
.jwm-slides_text-holder {
    position: absolute; 
    z-index: 1
}

/* Prevent text from overspilling and breaking display */
.jwm-slides_text-animate h1 {
  overflow: hidden; 
}

/* Activate the typing effect */
.jwm-slides_text-animate.active {
  animation: v-bind('textAnimation');
  overflow: hidden; 
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em;
  text-align: center;
}

/* Typing effect */
@keyframes jwm-slides_typing {
  from { width: 0 }
  to { width: 100% }
}

/* Anchor wrpper for btn */
a.jwm-slides_btn_anchor {
    text-decoration: none; 
    cursor: pointer; 
}

/* Styling for action button */
.jwm-slides_button {
  background-color: transparent;
  color: white;
  border: 2px solid #e7e7e7;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 0 auto;
  transition-duration: 0.4s;
  cursor: pointer;
  display: none;
  margin-top: .5em;
  opacity: 0;
}

/* Make button visible in DOM */
.jwm-slides_button.show {
    display: block;
}

/* Toggle button fade in */
.jwm-slides_button.toggle {
    opacity: 1;
    transition: all 1s;
}

/* Transition on button hover */
.jwm-slides_button:hover {
    background-color: white;
    color: black;
}

</style>
