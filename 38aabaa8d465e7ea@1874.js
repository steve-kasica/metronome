// https://observablehq.com/@stvkas/async-metronome@1874
import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./8d271c22db968ab0@160.js";

function _1(md){return(
md`
# Asynchronous Metronome

An asynchronous metronome.
`
)}

function _playback(html)
{
  const f = html`<form class="playback">
    <input name="play" type="button" value="Stop">
    <input name="fullscreen" type="button" value="Fullscreen">
    <input name="sound" type="button" value="Sound on">
  </form>`;

  f.value = { play: true, sound: false };

  f.play.onclick = event => {
    event.preventDefault(); // Prevent form submission
    f.value.play = !f.value.play;
    f.play.value = f.value.play ? 'Stop' : 'Start';
    f.dispatchEvent(new CustomEvent('input'));
  };

  f.sound.onclick = event => {
    event.preventDefault(); // Prevent form submission
    f.value.sound = !f.value.sound;
    f.sound.value = f.value.sound ? "Sound off" : "Sound on";
    f.dispatchEvent(new CustomEvent('input'));
  };

  f.fullscreen.onclick = event => {
    event.preventDefault(); // Prevent form submission
    const metronome = document.getElementById('metronome');
    const container = metronome.parentElement;

    container.parentElement.setAttribute('style', 'background-color:#ffffff');
    container.parentElement.requestFullscreen();
    // metronome.setAttribute('height', '100%');
    // container.setAttribute('height', '100%');
  };

  f.addEventListener('submit', event => event.preventDefault());

  return f;
}


async function* _vis(main_controls,inner_radius,notebook_height,width,stroke_width,d3,boundary_color,circle_color,font_family,font_weight,font_color,font_size,font_opacity,letter_spacing,expand_text,ease_style,playback,contract_audio,expand_audio,transition_delay,contract_text)
{
  if (main_controls.pulse > main_controls.period)
    throw Error('Pulse value cannot be greater than period value');
  if (isNaN(main_controls.pulse)) 
    throw Error('Pulse value is unset');
  if (isNaN(main_controls.period)) 
    throw Error('Period value is unset');

  // Define settings
  const r = inner_radius;
  const height = notebook_height || 600;
  const extent = Math.min(width, height);  
  const margin = 10;
  const max_radius = Math.min(width / 2, height / 2) - stroke_width - margin;
  const expand_duration = main_controls.pulse;
  const contract_duration = main_controls.period - main_controls.pulse;

  // Construct SVG components
  const container = d3
    .select(document.createElement('DIV'))
    .attr('id', 'container');

  const svg = container
    .append('svg')
    .attr('width', "100%")
    .attr('viewBox', `0 0 ${extent} ${extent}`)
    .attr('id', 'metronome');

  const outer_circle = svg
    .append("circle")
    .attr("r", max_radius)
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr('opacity', 1)
    .attr('fill', '#ffffff')
    .attr("stroke", boundary_color)
    .attr("stroke-width", 2)
    .attr('stroke-dasharray', 5);

  const circle = svg
    .append("circle")
    .attr("r", r)
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("fill", circle_color);

  const inner_circle = svg
    .append("circle")
    .attr("r", inner_radius)
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr('fill', circle_color)
    .attr('opacity', 1)
    .attr("stroke", boundary_color)
    .attr("stroke-width", 2)
    .attr('stroke-dasharray', 5);

  const text = container
    .append('p')
    .attr('class', 'label')
    .style('font-family', font_family)
    .style('font-weight', font_weight)
    .style('color', font_color)
    .style('font-size', `${font_size}px`)
    .style('opacity', font_opacity)
    .style('letter-spacing', `${letter_spacing}em`)
    .html(expand_text);

  const ease = d3[ease_style];

  yield container.node();

  while (true) {
    yield container.node();

    if (playback.play) {
      contract_audio.pause();
      contract_audio.currentTime = 0;
      expand_audio.play();

      await circle
        .transition()
        .delay(transition_delay * 1000)
        .ease(ease)
        .duration(expand_duration * 1000)
        .attr('r', max_radius)
        .end();

      expand_audio.pause();
      expand_audio.currentTime = 0;
      contract_audio.play();

      text.text(contract_text);

      await circle
        .transition()
        .ease(ease)
        .delay(transition_delay * 1000)
        .duration(contract_duration * 1000)
        .attr('r', r)
        .end();

      text.text(expand_text);
    }
  }
}


function _4(html,notebook_height){return(
html`<style>

#metronome {
  height: ${notebook_height}px;
}

@media (display-mode: fullscreen) {
  #container, #metronome {
    height: 100%;
  }
}

.container {
  display: flex;
}

.container .column {
  width: 250px;
}

.label {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  margin:0;

  /* h/t https://css-tricks.com/quick-css-trick-how-to-center-an-object-exactly-in-the-center/ */
  transform: translate(-50%, -50%);
}
</style>`
)}

function _5(md){return(
md`
## Metronome Controls

These are the basic metronome controls.
`
)}

function _main_controls(html,round,formValue)
{
  const f = html`
    <form id='main-controls'>
    <h3>Timing</h3>
    <div class="container">
      <br>
      <div class="column">
        <label name='pulse'><strong>Pulse</strong></label><br>
        <input name="pulse" type='number' step=0.01 value=2 min=0 style="width:75px">
        <i>seconds</i>
        <br>
        <label name="period"><strong>Period</strong></label><br>
        <input name="period" type='number' step=0.01 value=5 min=0 style="width:75px">
        <i>seconds</i>
      </div>

      <div class="column">
        <label name="cycle"><strong>Duty Cycle</strong></label><br>
        <input name="cycle" type='number' step=1 value=1 min=1 max=100 style="width:50px">
        <i>%</i>
        <br>
        <label name="freq"><strong>Frequency</strong></label><br>
        <input name="freq" type='number' step=0.01 min=0 style="width:75px">
        <i>cycles / minute</i>
      </div>
    </div> <!--/ .container -->
    </form>`;

  // Set default values
  f.freq.value = round(60 / +f.period.value);
  f.cycle.value = round((+f.pulse.value / +f.period.value) * 100);
  f.value = formValue(f);

  // Setup events
  f.addEventListener('submit', event => event.preventDefault());
  f.addEventListener('input', event => {
    // Update form viewof values
    const prevValue = f.value[event.target.name];
    f.value[event.target.name] = +event.target.value;

    // Update other values
    const key = event.target.name;
    switch (key) {
      case 'period':
        // Make total duration the max value of trial duration
        f.pulse.max = f.value.period;
        f.freq.value = f.value.freq = round(60 / f.value.period);
      case 'pulse':
        // Update duty cycle
        f.cycle.value = f.value.cycle = round(
          (f.value.pulse / f.value.period) * 100
        );
        break;
      case 'cycle':
        // Update trial duration
        f.pulse.value = f.value.pulse = round(
          f.value.period * (f.value.cycle / 100)
        );
        break;
      case 'freq':
        f.period.value = f.value.period = round(60 / f.value.freq);
        break;
    }
  });

  return f;
}


function _7(md){return(
md`
## Advanced Settings
These settings control the presentation of the metronome

`
)}

function _8(md){return(
md`
### Circle properties

These settings adjust properties of the circle
`
)}

function _inner_radius(slider){return(
slider({
  min: 1,
  max: 200,
  value: 25,
  step: 1,
  title: 'Minimum circle radius',
  description: "Change the minimum radius of the circle"
})
)}

function _stroke_width(slider){return(
slider({
  min: 1,
  max: 25,
  value: 10,
  step: 1,
  title: 'Circle border width',
  description: "Change the width of the outer line"
})
)}

function _circle_color(color){return(
color({
  value: "#0c2344",
  title: "Circle color",
  description: "Change the color of the expanding-contracting circle"
})
)}

function _boundary_color(color){return(
color({
  value: "#aaaaaa",
  title: "Circle boundary color",
  description:
    "Change the color of dotted line marking the extent of the circle radius during expansion and contraction"
})
)}

function _13(md){return(
md`
### Text properties

These settings adjust the text and text style at the center of the animation
`
)}

function _expand_text(text){return(
text({
  title: 'Expanding text',
  description: 'Change the inner text as the circle grows',
  value: 'Expand'
})
)}

function _contract_text(text){return(
text({
  title: 'Contracting text',
  description: 'Change the inner text as the circle shrinks',
  value: 'Contract'
})
)}

function _font_size(number){return(
number({
  title: 'Font size',
  description: 'Change how large the inner text, in points',
  min: 8,
  max: 1000,
  value: 60,
  step: 1
})
)}

function _font_style(select){return(
select({
  title: 'Font style',
  options: ['Normal', 'Italic', 'Oblique'],
  value: 'normal',
  description: 'Change the inner text style, e.g. normal, italic, or oblique'
})
)}

function _font_weight(number){return(
number({
  title: 'Font weight',
  step: 100,
  value: 800,
  max: 1000,
  min: 100,
  description: 'Change the boldness of the text'
})
)}

function _font_family(select){return(
select({
  title: 'Font Family',
  value: 'Georgia',
  options: ['courier', 'helvetica', 'monospace'],
  description: 'TK'
})
)}

function _font_color(color){return(
color({
  title: 'Text color',
  description: 'Change the color of both the expanding and contracting text',
  value: '#aaaaaa'
})
)}

function _font_opacity(slider){return(
slider({
  title: 'Text opacity',
  description: 'Change the opacity of the text',
  min: 0,
  max: 1,
  value: 0.75
})
)}

function _letter_spacing(slider){return(
slider({
  title: 'Letter Spacing',
  value: 0.1,
  max: 0.5,
  min: 0.0,
  step: 0.01,
  description: 'Modify the horizontal spacing behavior between text characters'
})
)}

function _23(md){return(
md`
### Animation properties
These settings adjust properties of the expansion-contraction animation other than speed
`
)}

function _ease_style(select){return(
select({
  title: 'Ease style',
  options: [
    {
      label: 'Linear',
      value: 'easeLinear'
    },
    {
      label: 'Cubic',
      value: 'easeCubicIn'
    },
    {
      label: 'Sinusodial',
      value: 'easeSinIn'
    },
    {
      label: 'Exponential',
      value: 'easeExpIn'
    },
    {
      label: 'Symmetric exponential',
      value: 'easeExpInOut'
    },
    {
      label: 'Circular',
      value: 'easeCircleIn'
    }
  ],
  value: 'Linear',
  description: 'Distort the time to completion in the animation'
})
)}

function _transition_delay(slider){return(
slider({
  min: 0,
  max: 1,
  value: 0,
  title: 'Transition delay',
  format: x => `${x} secs`,
  description: 'Pause between expanding and contracting (in seconds)'
})
)}

function _26(html){return(
html`<hr>`
)}

function _27(md){return(
md`You shouldn't need to change anything below this line`
)}

function _notebook_height(){return(
600
)}

async function _contract_audio(Audio,FileAttachment){return(
new Audio(
  await FileAttachment('250Hz_44100Hz_16bit_05sec.mp3').url()
)
)}

async function _expand_audio(Audio,FileAttachment){return(
new Audio(
  await FileAttachment('440Hz_44100Hz_16bit_05sec.mp3').url()
)
)}

function _audio(playback,expand_audio,contract_audio)
{
  if (!playback.sound || !playback.play) {
    expand_audio.volume = 0.0;
    contract_audio.volume = 0.0;
  } else {
    expand_audio.volume = 1.0;
    contract_audio.volume = 1.0;
  }
}


function _round(){return(
function round(num, places = 2) {
  var x = 10 * places;
  return Math.round((num + Number.EPSILON) * x) / x;
}
)}

function _d3(require){return(
require('d3')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["440Hz_44100Hz_16bit_05sec.mp3", {url: new URL("./files/c50b2d6db9f467c59aa06be8817ea81cb4df089cfa658aff847128a9ae3a7e568668d4cfaca1c569ddbecbcd46f58bd8ce9e9a17f89fb41519de2df4b28e1bc1.mpga", import.meta.url), mimeType: "audio/mpeg", toString}],
    ["250Hz_44100Hz_16bit_05sec.mp3", {url: new URL("./files/1f75e606830a7b6494adcc6964f3a6edfbdee6cc0688dc68ecd12e5945f1cc8d0d5204af3e6d60243344ace0d0558a29be4c938e66d09f82ab6a8be3bd40a216.mpga", import.meta.url), mimeType: "audio/mpeg", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof playback")).define("viewof playback", ["html"], _playback);
  main.variable(observer("playback")).define("playback", ["Generators", "viewof playback"], (G, _) => G.input(_));
  main.variable(observer("vis")).define("vis", ["main_controls","inner_radius","notebook_height","width","stroke_width","d3","boundary_color","circle_color","font_family","font_weight","font_color","font_size","font_opacity","letter_spacing","expand_text","ease_style","playback","contract_audio","expand_audio","transition_delay","contract_text"], _vis);
  main.variable(observer()).define(["html","notebook_height"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof main_controls")).define("viewof main_controls", ["html","round","formValue"], _main_controls);
  main.variable(observer("main_controls")).define("main_controls", ["Generators", "viewof main_controls"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof inner_radius")).define("viewof inner_radius", ["slider"], _inner_radius);
  main.variable(observer("inner_radius")).define("inner_radius", ["Generators", "viewof inner_radius"], (G, _) => G.input(_));
  main.variable(observer("viewof stroke_width")).define("viewof stroke_width", ["slider"], _stroke_width);
  main.variable(observer("stroke_width")).define("stroke_width", ["Generators", "viewof stroke_width"], (G, _) => G.input(_));
  main.variable(observer("viewof circle_color")).define("viewof circle_color", ["color"], _circle_color);
  main.variable(observer("circle_color")).define("circle_color", ["Generators", "viewof circle_color"], (G, _) => G.input(_));
  main.variable(observer("viewof boundary_color")).define("viewof boundary_color", ["color"], _boundary_color);
  main.variable(observer("boundary_color")).define("boundary_color", ["Generators", "viewof boundary_color"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof expand_text")).define("viewof expand_text", ["text"], _expand_text);
  main.variable(observer("expand_text")).define("expand_text", ["Generators", "viewof expand_text"], (G, _) => G.input(_));
  main.variable(observer("viewof contract_text")).define("viewof contract_text", ["text"], _contract_text);
  main.variable(observer("contract_text")).define("contract_text", ["Generators", "viewof contract_text"], (G, _) => G.input(_));
  main.variable(observer("viewof font_size")).define("viewof font_size", ["number"], _font_size);
  main.variable(observer("font_size")).define("font_size", ["Generators", "viewof font_size"], (G, _) => G.input(_));
  main.variable(observer("viewof font_style")).define("viewof font_style", ["select"], _font_style);
  main.variable(observer("font_style")).define("font_style", ["Generators", "viewof font_style"], (G, _) => G.input(_));
  main.variable(observer("viewof font_weight")).define("viewof font_weight", ["number"], _font_weight);
  main.variable(observer("font_weight")).define("font_weight", ["Generators", "viewof font_weight"], (G, _) => G.input(_));
  main.variable(observer("viewof font_family")).define("viewof font_family", ["select"], _font_family);
  main.variable(observer("font_family")).define("font_family", ["Generators", "viewof font_family"], (G, _) => G.input(_));
  main.variable(observer("viewof font_color")).define("viewof font_color", ["color"], _font_color);
  main.variable(observer("font_color")).define("font_color", ["Generators", "viewof font_color"], (G, _) => G.input(_));
  main.variable(observer("viewof font_opacity")).define("viewof font_opacity", ["slider"], _font_opacity);
  main.variable(observer("font_opacity")).define("font_opacity", ["Generators", "viewof font_opacity"], (G, _) => G.input(_));
  main.variable(observer("viewof letter_spacing")).define("viewof letter_spacing", ["slider"], _letter_spacing);
  main.variable(observer("letter_spacing")).define("letter_spacing", ["Generators", "viewof letter_spacing"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("viewof ease_style")).define("viewof ease_style", ["select"], _ease_style);
  main.variable(observer("ease_style")).define("ease_style", ["Generators", "viewof ease_style"], (G, _) => G.input(_));
  main.variable(observer("viewof transition_delay")).define("viewof transition_delay", ["slider"], _transition_delay);
  main.variable(observer("transition_delay")).define("transition_delay", ["Generators", "viewof transition_delay"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("notebook_height")).define("notebook_height", _notebook_height);
  main.variable(observer("contract_audio")).define("contract_audio", ["Audio","FileAttachment"], _contract_audio);
  main.variable(observer("expand_audio")).define("expand_audio", ["Audio","FileAttachment"], _expand_audio);
  main.variable(observer("audio")).define("audio", ["playback","expand_audio","contract_audio"], _audio);
  main.variable(observer("round")).define("round", _round);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("text", child1);
  main.import("select", child1);
  main.import("number", child1);
  main.import("color", child1);
  main.import("radio", child1);
  const child2 = runtime.module(define2);
  main.import("formValue", child2);
  return main;
}
