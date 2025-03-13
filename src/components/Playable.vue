<script setup lang="ts">
import type { Note, Options, Playable } from "@/domain/audio-player";

const props = defineProps<{
  playable: Playable;
  isRunning: boolean;
  options: Options;
}>();

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

const heigthFactor = 20;
function chordHeight(chord: Note[]) {
  return Math.max(
    ...chord.map((note) => note.duration.inBeats(props.options) * heigthFactor)
  );
}

function noteHeight(note: Note) {
  return note.duration.inBeats(props.options) * heigthFactor;
}

function getHeight() {
  if (props.playable.type == "NOTE") {
    return noteHeight(props.playable.value as Note) + "px";
  }
  return chordHeight(props.playable.value as Note[]) + "px";
}

const commonClasses = ["card", "flex", "items-center", "justify-center"];
function noteClass() {
  // const height = `h-[${noteHeight(props.playable.value as Note)}px]`;
  return [...commonClasses, noteColor()].join(" ");
}
function chordClass() {
  // const height = `h-[${chordHeight(props.playable.value as Note[])}px]`;
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
  <div
    :style="{
      width: '100px',
      marginBottom: '2px',
    }"
  >
    <div v-if="props.playable.type == 'NOTE'">
      <div :class="noteClass()" :style="{ height: getHeight() }">
        {{ noteToString(props.playable.value) }}
      </div>
    </div>
    <div v-else-if="props.playable.type == 'CHORD'">
      <div :class="chordClass()" :style="{ height: getHeight() }">
        {{ chordToString(props.playable.value) }}
      </div>
    </div>
    <div v-else></div>
  </div>
</template>
