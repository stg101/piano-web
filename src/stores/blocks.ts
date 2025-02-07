import { ref, computed } from "vue";
import { defineStore } from "pinia";

type Block = {
  options: {
    bpm: number;
    timeSignature: [number, number];
  };
  nodes: {
    text: string;
  }[];
};

export const useBlocksStore = defineStore("blocks", () => {
  const blocks = ref<Block[]>([
    {
      options: {
        bpm: 60,
        timeSignature: [4, 4],
      },
      nodes: [
        {
          text: "(<c d4>2 c'x20 c'')",
        },
        {
          text: "(c1x3)",
        },
        {
          text: "(c1x3)",
        },
      ],
    },
  ]);

  return { blocks };
});

// we can use the expr to color in real time, and also correct syntax on the fly
// we need a different audio context for each block
// because we need to stop them independently
