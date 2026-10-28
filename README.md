# slideshow-with-text-transition

A Vue 3 component that displays a slideshow and animated text.

# Install

npm install @jwmccltd/slideshow-with-text-transition

# Import and use

In your Vue app, import the component and its stylesheet:

```js
import { Slides } from '@jwmccltd/slideshow-with-text-transition';
import '@jwmccltd/slideshow-with-text-transition/dist/style.css';
```

Register it locally in a component and pass `display-data` as a JSON string:

```vue
<script setup>
import { Slides } from '@jwmccltd/slideshow-with-text-transition';
import '@jwmccltd/slideshow-with-text-transition/dist/style.css';

const slides = [
  {
    slide: '/images/slide-1.jpg',
    text: ['Line 1', 'Line 2'],
  },
];
</script>

<template>
  <Slides :display-data="JSON.stringify(slides)" />
</template>
```

# Usage

Pass json of options to component, containing accessible path to image e.g<br><br>
Add text to add animated typing overlay on image<br>
Add btn text for action button<br>
Add link for button and target<br>
define text colour and hover text colour<br><br>

`[
  {
    "slide": "images/slide-folder/slides/slide-1.jpg",
    "text": [
      "Line 1",
      "Line 2"
    ],
    "btn_text": "My Button",
    "btn_action": {
      "link": "https://www.google.co.uk",
      "target": "_blank"
    },
    "colours": {
      "text_colour": "black",
      "hover_text_colour": "white"
    }
  }
]`

<br>

Add as many additional items for the number of slides/text wanted

`<slides :display-data="'{{ json_encode($displayData) }}'"></slides>`

| Param       | Type        | Default | Description | 
| ----------- | ----------- | ------- | ----------- |
| display-data (required) | String (json)       |         | json encoded array of data for display |  
| duration   | Number        | 10         | Duration of slide transition in seconds            |
| imageHolderHeight | String | 550px | String for css with height of container for image slides |
| switchTextLine | Number | 5000 | Duration of text transition in milliseconds |
| typingSpeed | String | medium | slow, medium or fast for typing animation |
| zoomScale | String | scale(2.5) | String for css scale to zoom in/out image
