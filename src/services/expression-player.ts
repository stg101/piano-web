import { AudioPlayer, type Options } from "@/domain/audio-player";
import { AudioComposition } from "@/domain/code_compositor/audio-composition";
import { SerializerVisitor } from "@/domain/code_compositor/components";
import { timeout } from "@/domain/utils";

export class ExpressionPlayer {
  serializerVisitor = new SerializerVisitor();
  compositon: AudioComposition;
  constructor(text: string) {
    this.compositon = new AudioComposition(text);
    this.compositon.visit(this.serializerVisitor);
  }

  async play(options: Options) {
    const ap = new AudioPlayer(options);
    await timeout(10);
    ap.playSequence(this.serializerVisitor.buffer);
  }
}
