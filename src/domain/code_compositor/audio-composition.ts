import type { AudioComponent, AudioComponentVisitor } from "./components";
import { Interpreter } from "./interpreter";

export class AudioComposition {
  root: AudioComponent;
  constructor(text: string) {
    const rootExpr = new Interpreter().interpret(text);
    this.root = rootExpr.build();
  }

  visit(visitor: AudioComponentVisitor) {
    this.root.visit(visitor);
  }
}
