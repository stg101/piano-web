<script setup lang="ts">
import type { Note, Playable } from "@/domain/audio-player";

const props = defineProps<{ playable: Playable; isRunning: boolean }>();

function noteColor() {
  if (props.isRunning) {
    return "bg-green-600";
  }
  return "bg-green-600/40";
}

function chordColor() {
  if (props.isRunning) {
    return "bg-blue-600";
  }
  return "bg-blue-600/49";
}
const commonClasses = ["card", "flex", "items-center", "justify-center"];
function noteClass() {
  return [...commonClasses, noteColor()].join(" ");
}
function chordClass() {
  return [...commonClasses, chordColor()].join(" ");
}

function noteToString(note: Note) {
  return `${note.pitch.toString()}`;
}

function chordToString(chord: Note[]) {
  return chord.map((note) => noteToString(note)).join(" ");
}
</script>

<template>
  <div class="mb-2 w-[100px]">
    <div v-if="props.playable.type == 'NOTE'">
      <div :class="noteClass()">
        {{ noteToString(props.playable.value) }}
      </div>
    </div>
    <div v-else-if="props.playable.type == 'CHORD'">
      <div :class="chordClass()">
        {{ chordToString(props.playable.value) }}
      </div>
    </div>
    <div v-else></div>
  </div>
</template>
