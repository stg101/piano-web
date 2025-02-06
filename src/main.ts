import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import {
  ChordComponent,
  NoteComponent,
  PrinterVisitor,
  SerializerVisitor,
} from "./domain/code_compositor/components";
import { AudioPlayer, Duration, Pitch } from "./domain/audio-player";
import { Tokenizer } from "./domain/code_compositor/tokenizer";
import { Interpreter } from "./domain/code_compositor/interpreter";
import { AudioComposition } from "./domain/code_compositor/audio-composition";

const app = createApp(App);

app.use(createPinia());
app.use(router);


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
