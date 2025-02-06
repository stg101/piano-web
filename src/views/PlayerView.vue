<script setup lang="ts">
import { ExpressionPlayer } from "@/services/expression-player";
import { useBlocksStore } from "@/stores/blocks";

const blocksStore = useBlocksStore();

async function play(text: string) {
  await new ExpressionPlayer(text).play();
}
</script>

<template>
  <div class="about">
    <h1>player</h1>
    <p>player</p>
    <div v-for="block in blocksStore.blocks">
      <div v-for="node in block.nodes">
        <div>{{ node.text }}</div>
        <button @click="play(node.text)">play</button>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
