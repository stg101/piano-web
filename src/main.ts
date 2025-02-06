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

// const composition = new AudioComposition("(<c d4>2 c'x20 c'')");
// // const visitor = new PrinterVisitor();
// const visitor = new SerializerVisitor();

// composition.visit(visitor);

// console.log(visitor.buffer);
// await AudioPlayer.getInstance().playSequence(visitor.buffer);
// while (await AudioPlayer.getInstance().consume());
// const interpreter = new Interpreter();
// const parsed = interpreter.interpret("(<c d4>2 c'x20 c'')");
// console.log(parsed);
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
