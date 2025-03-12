<script setup lang="ts">
import type { Note, Playable } from "@/domain/audio-player";

const props = defineProps<{ playable: Playable }>();

function noteToString(note: Note) {
  return `${note.pitch.toString()}`;
}

function chordToString(chord: Note[]) {
  return chord.map((note) => noteToString(note)).join(" ");
}
</script>

<template>
  <div class="mb-2">
    <div class="" v-if="props.playable.type == 'NOTE'">
      <div
        class="card flex items-center justify-center bg-green-600/40 w-[100px]"
      >
        {{ noteToString(props.playable.value) }}
      </div>
    </div>
    <div v-else-if="props.playable.type == 'CHORD'">
      <div
        class="card flex items-center justify-center bg-blue-600/49 w-[100px]"
      >
        {{ chordToString(props.playable.value) }}
      </div>
    </div>
    <div v-else></div>
  </div>
</template>
