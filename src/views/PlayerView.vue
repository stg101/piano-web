<script setup lang="ts">
import { ExpressionPlayer } from "@/services/expression-player";
import AceEditor from "./AceEditor.vue";
import { nextTick, ref, TrackOpTypes, watch, watchEffect } from "vue";
import {
  AudioPlayer,
  type Note,
  type Options,
  type Playable as PlayableType,
} from "@/domain/audio-player";
import Playable from "@/components/Playable.vue";
import { timeout } from "@/domain/utils";
import { init } from "ace-builds/src-noconflict/ext-keybinding_menu";

const preloadedCompositions = [
  {
    text: "(<c d4>2 c'x20 c'')",
  },
  {
    text: `(
  ex2 e2
  ex2 e2

  e g c d e2
  fx5 ex4 dx2 e d2 g2
)`,
  },
  {
    text: "(c1x3)",
  },
];
const options = ref({
  bpm: 120,
  timeSignature: {
    beatsPerMeassure: 4,
    noteValuePerBeat: 4,
  },
});
const vimMode = ref(true);
const editorText = ref("");
const initialEditorText = ref("");
const runningPlayableIndex = ref<number | null>(null);
const buffer = ref<PlayableType[]>([]);

watchEffect(() => {
  runningPlayableIndex.value = null;
  if (editorText.value == "") return;
  try {
    buffer.value = new ExpressionPlayer(editorText.value).buffer;
  } catch (e) {
    buffer.value = [];
  }
});

async function playBuffer() {
  await new AudioPlayer({
    ...options.value,
    beforePlayStep: (_, index) => {
      console.log(_);
      runningPlayableIndex.value = index;
    },
  }).playSequence(buffer.value);
}

async function playText(text: string) {
  initialEditorText.value = text;
  editorText.value = text;
  await nextTick();
  await playBuffer();
}
</script>

<template>
  <div class="container mx-auto max-w-4xl">
    <h1 class="text-3xl my-4">Player</h1>
    <div class="flex gap-4 h-12">
      <label class="fieldset-label flex">
        <input
          type="range"
          min="1"
          max="480"
          v-model="options.bpm"
          class="range"
        />
        <span>{{ options.bpm }}</span> BPM
      </label>
      <label class="fieldset-label">
        <input type="checkbox" v-model="vimMode" class="toggle" />
        Vim mode
      </label>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <AceEditor
          :vim-mode="vimMode"
          @update:text="editorText = $event"
          :text="initialEditorText"
        />
        <button class="btn w-full" @click="playBuffer()">play</button>
      </div>
      <div class="">
        <div class="card mb-2" v-for="comp in preloadedCompositions">
          <div class="card relative bg-black p-4">
            <code class="">
              <pre>{{ comp.text }}</pre>
            </code>
            <button
              class="btn btn-sm absolute top-2 right-2"
              @click="playText(comp.text)"
            >
              play
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="mt-2" v-for="(step, index) in buffer">
        <Playable
          :options="options"
          :playable="step"
          :is-running="runningPlayableIndex == index"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
