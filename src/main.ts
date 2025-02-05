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

const app = createApp(App);

app.use(createPinia());
app.use(router);

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
