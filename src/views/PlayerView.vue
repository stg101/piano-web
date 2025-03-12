<script setup lang="ts">
import { ExpressionPlayer } from "@/services/expression-player";
import AceEditor from "./AceEditor.vue";
import { ref, TrackOpTypes, watch, watchEffect } from "vue";
import {
  AudioPlayer,
  type Note,
  type Options,
  type Playable as PlayableType,
} from "@/domain/audio-player";
import Playable from "@/components/Playable.vue";
import { timeout } from "@/domain/utils";

const preloadedCompositions = [
  {
    text: "(<c d4>2 c'x20 c'')",
  },
  {
    text: "(c1x3)",
  },
  {
    text: "(c1x3)",
  },
];
const options = ref({
  bpm: 60,
  timeSignature: {
    beatsPerMeassure: 4,
    noteValuePerBeat: 4,
  },
});

const vimMode = ref(true);
const editorText = ref("");
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

async function play(text: string) {
  await new AudioPlayer({
    ...options.value,
    beforePlayStep: (_, index) => {
      runningPlayableIndex.value = index;
    },
  }).playSequence(buffer.value);
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
        <AceEditor :vim-mode="vimMode" @update:text="editorText = $event" />
        <button class="btn w-full" @click="play(editorText)">play</button>
      </div>
      <div class="">
        <div class="card mb-2" v-for="comp in preloadedCompositions">
          <div class="mockup-code">
            <code class="pl-5">
              {{ comp.text }}
            </code>
          </div>
          <button class="btn" @click="play(comp.text)">play</button>
        </div>
      </div>
    </div>
    <div>
      <div class="mt-2" v-for="(step, index) in buffer">
        <Playable
          :playable="step"
          :is-running="runningPlayableIndex == index"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
