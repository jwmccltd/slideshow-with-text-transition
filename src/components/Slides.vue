<template>
    <div class="jwm-slides_outer">
        <!-- Text Section -->
        <div class="jwm-slides_text-holder">
            <div v-for="(item, index) in displayText" :key="`${pos}-${index}`">
                <div
                    v-if="item.active"
                    class="jwm-slides_text-animate active"
                >
                    <h1 class="jwm-slides_text">{{ item.text }}</h1>
                </div>
            </div>

            <a
                v-if="btnText.length > 0"
                :href="btnAction?.link || '#'"
                :target="btnAction?.target ?? '_self'"
                class="jwm-slides_btn_anchor"
            >
                <button
                    class="jwm-slides_button"
                    :id="`jwm-slide_button_id_${pos}`"
                    :class="{ toggle: toggleActionBtn, show: showBtn }"
                    type="button"
                >
                    {{ btnText }}
                </button>
            </a>
        </div>

        <!-- Image Section -->
        <div class="jwm-slides_image-holder">
            <img
                v-if="slideFile"
                class="jwm-slides_zoom"
                :class="{ active }"
                :src="slideFile"
                alt=""
            >
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    // JSON-encoded array containing slide, text, button and action data.
    displayData: {
        type: String,
        required: true,
    },
    // Duration of each slide in seconds.
    duration: {
        type: Number,
        default: 10,
    },
    // Height of the container.
    imageHolderHeight: {
        type: String,
        default: '550px',
    },
    // Delay between text lines in milliseconds.
    switchTextLine: {
        type: Number,
        default: 5000,
    },
    typingSpeed: {
        type: String,
        default: 'medium',
    },
    zoomScale: {
        type: String,
        default: 'scale(2.5)',
    },
});

const slides = computed(() => {
    try {
        const parsedData = JSON.parse(props.displayData);
        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        console.error('Unable to parse displayData as JSON:', error);
        return [];
    }
});

const slideFile = ref('');
const displayText = ref([]);
const pos = ref(0);
const active = ref(false);
const textAnimation = ref('jwm-slides_typing 3s steps(30, end)');
const textColour = ref('white');
const buttonBorder = ref('2px solid white');
const buttonHoverTextColour = ref('white');
const toggleActionBtn = ref(false);
const showBtn = ref(false);
const btnText = ref('');
const btnAction = ref(null);

const zoomDuration = computed(() => `transform ${props.duration}s`);

let slideIntervalId;
let initialTimeoutId;
let textLineTimeoutId;
let textIntervalId;
let buttonTimeoutId;
let buttonFadeTimeoutId;

const clearTextTimers = () => {
    clearTimeout(textLineTimeoutId);
    clearInterval(textIntervalId);
    clearTimeout(buttonTimeoutId);
    clearTimeout(buttonFadeTimeoutId);
};

const setTypingStyle = (value) => {
    const speedOptions = {
        fast: [2, 1, 0.5],
        medium: [3, 2, 1],
        slow: [4, 3, 2],
    };
    const speeds = speedOptions[props.typingSpeed] ?? speedOptions.medium;

    let durationSeconds = speeds[0];
    let steps = 30;

    if (value.length < 30) {
        durationSeconds = speeds[1];
        steps = 20;
    }

    if (value.length < 10) {
        durationSeconds = speeds[2];
        steps = 10;
    }

    textAnimation.value =
        `jwm-slides_typing ${durationSeconds}s steps(${steps}, end)`;
};

const loadSlide = (index) => {
    const slide = slides.value[index];

    if (!slide) {
        slideFile.value = '';
        btnText.value = '';
        btnAction.value = null;
        displayText.value = [];
        return;
    }

    pos.value = index;
    slideFile.value = slide.slide ?? '';
    btnText.value = slide.btn_text ?? '';
    btnAction.value = slide.btn_action ?? null;

    const colours = slide.colours;
    textColour.value = colours?.text_colour ?? 'white';
    buttonBorder.value = `2px solid ${textColour.value}`;
    buttonHoverTextColour.value = colours?.hover_text_colour ?? 'black';

    showBtn.value = false;
    toggleActionBtn.value = false;

    displayText.value = (Array.isArray(slide.text) ? slide.text : []).map(
        (text) => ({ text: String(text), active: false }),
    );
};

const loadText = () => {
    clearTextTimers();

    if (displayText.value.length === 0) {
        buttonTimeoutId = setTimeout(() => {
            showBtn.value = true;
            buttonFadeTimeoutId = setTimeout(() => {
                toggleActionBtn.value = true;
            }, 50);
        }, 500);
        return;
    }

    let textIndex = 0;

    const activateText = () => {
        const item = displayText.value[textIndex];

        if (!item) {
            return;
        }

        item.active = true;
        setTypingStyle(item.text);
        textIndex += 1;

        if (textIndex >= displayText.value.length) {
            clearInterval(textIntervalId);
            buttonTimeoutId = setTimeout(() => {
                showBtn.value = true;
                buttonFadeTimeoutId = setTimeout(() => {
                    toggleActionBtn.value = true;
                }, 50);
            }, 500);
        }
    };

    textLineTimeoutId = setTimeout(() => {
        activateText();

        if (textIndex < displayText.value.length) {
            textIntervalId = setInterval(activateText, props.switchTextLine);
        }
    }, 50);
};

const advanceSlide = () => {
    if (slides.value.length === 0) {
        return;
    }

    clearTextTimers();
    active.value = !active.value;

    const nextIndex = (pos.value + 1) % slides.value.length;
    loadSlide(nextIndex);
    loadText();
};

onMounted(() => {
    if (slides.value.length === 0) {
        return;
    }

    loadSlide(0);

    // Give Vue a moment to render before starting the CSS animations.
    initialTimeoutId = setTimeout(() => {
        active.value = true;
        loadText();

        slideIntervalId = setInterval(
            advanceSlide,
            Math.max(0, props.duration) * 1000,
        );
    }, 100);
});

onUnmounted(() => {
    clearTimeout(initialTimeoutId);
    clearInterval(slideIntervalId);
    clearTextTimers();
});
</script>

<style>
/* Text colour for slide text. */
.jwm-slides_text {
    color: v-bind('textColour');
}

/* Transition for zooming the image. */
.jwm-slides_zoom {
    transition: v-bind('zoomDuration');
    width: 100%;
}

/* Toggle slide animation. */
.jwm-slides_zoom.active {
    transform: v-bind('zoomScale');
}

/* Holders for images and outer holder. */
.jwm-slides_image-holder,
.jwm-slides_outer {
    height: v-bind('imageHolderHeight');
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Container for slide text. */
.jwm-slides_text-holder {
    position: absolute;
    z-index: 1;
}

/* Prevent text from overspilling and breaking display. */
.jwm-slides_text-animate h1 {
    overflow: hidden;
}

/* Activate the typing effect. */
.jwm-slides_text-animate.active {
    animation: v-bind('textAnimation');
    overflow: hidden;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: 0.15em;
    text-align: center;
}

/* Typing effect. */
@keyframes jwm-slides_typing {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}

/* Anchor wrapper for the button. */
a.jwm-slides_btn_anchor {
    text-decoration: none;
    cursor: pointer;
}

/* Styling for the action button. */
.jwm-slides_button {
    background-color: transparent;
    color: v-bind('textColour');
    border: v-bind('buttonBorder');
    padding: 16px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 0 auto;
    transition-duration: 0.4s;
    cursor: pointer;
    display: none;
    margin-top: 0.5em;
    opacity: 0;
}

/* Make button visible in the DOM. */
.jwm-slides_button.show {
    display: block;
}

/* Toggle button fade-in. */
.jwm-slides_button.toggle {
    opacity: 1;
    transition: all 1s;
}

/* Transition on button hover. */
.jwm-slides_button:hover {
    background-color: v-bind('textColour');
    color: v-bind('buttonHoverTextColour');
}
</style>
