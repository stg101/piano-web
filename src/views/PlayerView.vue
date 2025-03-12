<script setup lang="ts">
import { ExpressionPlayer } from "@/services/expression-player";
import { useBlocksStore } from "@/stores/blocks";
import AceEditor from "./AceEditor.vue";

const blocksStore = useBlocksStore();
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

async function play(text: string) {
  await new ExpressionPlayer(text).play();
}
</script>

<template>
  <div class="container mx-auto max-w-4xl">
    <h1 class="text-3xl my-4">Player</h1>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <AceEditor />
      </div>
      <div class="pt-6">
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
  </div>
</template>

<style></style>
