<script setup lang="ts">
import { ExpressionPlayer } from "@/services/expression-player";
import { useBlocksStore } from "@/stores/blocks";

const blocksStore = useBlocksStore();

async function play(text: string) {
  await new ExpressionPlayer(text).play();
}
</script>

<template>
  <div class="container mx-auto max-w-4xl">
    <h1 class="text-3xl my-4">Player</h1>

    <div class="" v-for="block in blocksStore.blocks">
      <div class="card" v-for="node in block.nodes">
        <div class="mockup-code">
          <code class="pl-5">
            {{ node.text }}
          </code>
        </div>
        <button class="btn" @click="play(node.text)">play</button>
      </div>
    </div>
  </div>
</template>

<style></style>
