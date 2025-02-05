import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import {
  AudioPlayerVisitor,
  ChordComponent,
  NoteComponent,
} from "./domain/code_compositor/components";
import { Duration, Pitch } from "./domain/audio-player";
import { Tokenizer } from "./domain/code_compositor/tokenizer";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// const tokenizer = new Tokenizer();
// console.log(tokenizer.tokenize("(<c d>2 c'x20 c'')"));

// const note = new NoteComponent({
//   pitch: new Pitch("C"),
//   duration: new Duration(),
// });

// note.visit(new AudioPlayerVisitor());

// const chord = new ChordComponent([
//   {
//     pitch: new Pitch("C"),
//     duration: new Duration(),
//   },
//   {
//     pitch: new Pitch("F"),
//     duration: new Duration(),
//   },
// ]);

// chord.visit(new AudioPlayerVisitor());

app.mount("#app");
