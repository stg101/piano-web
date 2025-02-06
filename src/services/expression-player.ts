import { AudioPlayer } from "@/domain/audio-player";
import { AudioComposition } from "@/domain/code_compositor/audio-composition";
import { SerializerVisitor } from "@/domain/code_compositor/components";

export class ExpressionPlayer {
  serializerVisitor = new SerializerVisitor();
  compositon: AudioComposition;
  constructor(text: string) {
    this.compositon = new AudioComposition(text);
    this.compositon.visit(this.serializerVisitor);
  }

  async play() {
    AudioPlayer.getInstance().playSequence(this.serializerVisitor.buffer);
  }
}
