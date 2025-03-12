<script setup lang="ts">
import { effect, onMounted, ref, watch, watchEffect } from "vue";
import ace from "ace-builds";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/keybinding-vim";
import "@/utils/mode-music";
const editorRef = ref(null);

const checked = ref(false);
let editor: ace.Editor | null = null;

function toggleCheck() {
  if (editor == null) return;
  if (checked.value) {
    editor.setKeyboardHandler("ace/keyboard/vim");
  } else {
    editor.setKeyboardHandler("");
  }
}

onMounted(() => {
  editor = ace.edit(editorRef.value);

  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/music");
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    fontSize: "14px",
    showPrintMargin: false,
  });
});
</script>

<template>
  <div>
    <label class="fieldset-label">
      <input
        type="checkbox"
        v-model="checked"
        class="toggle"
        @change="toggleCheck"
      />
      Vim mode
    </label>
  </div>
  <div ref="editorRef" style="height: 500px; width: 100%"></div>
</template>

<style scoped></style>
