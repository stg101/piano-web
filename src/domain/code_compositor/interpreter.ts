import { Duration, Pitch } from "../audio-player";
import {
  ChordComponent,
  NoteComponent,
  RepeatComponent,
  SequenceComponent,
  type AudioComponent,
} from "./components";
import {
  CloseAngleBracketToken,
  CloseParenthesisToken,
  CrossToken,
  NumberToken,
  OpenAngleBracketToken,
  OpenParenthesisToken,
  PitchToken,
  QuoteGroupToken,
  Tokenizer,
  type Token,
} from "./tokenizer";

abstract class Expr {
  abstract build(): AudioComponent;
}

class PitchExpr extends Expr {
  pitch: Pitch;

  constructor(pitch: Pitch) {
    super();
    this.pitch = pitch;
  }

  incrOctave(value = 1) {
    const newPitch = new Pitch(this.pitch.tone, this.pitch.octave + value);
    return new PitchExpr(newPitch);
  }

  build(defaultDuration = new Duration()) {
    return new NoteComponent({ pitch: this.pitch, duration: defaultDuration });
  }
}

class NoteExpr extends Expr {
  pitch: Pitch;
  duration?: Duration;

  constructor(pitch: Pitch, duration?: Duration) {
    super();
    this.pitch = pitch;
    this.duration = duration;
  }

  build(defaultDuration = new Duration()) {
    return new NoteComponent({
      pitch: this.pitch,
      duration: this.duration || defaultDuration || new Duration(),
    });
  }
}

class ChordExpr extends Expr {
  children: (NoteExpr | PitchExpr)[];
  duration?: Duration;

  constructor(children: (NoteExpr | PitchExpr)[], duration?: Duration) {
    super();
    this.children = children;
    this.duration = duration;
  }

  build() {
    const notes = this.children.map((note_expr) =>
      note_expr.build(this.duration)
    );
    return new ChordComponent(notes);
  }
}

class SequenceExpr extends Expr {
  children: Expr[];
  constructor(children: Expr[]) {
    super();
    this.children = children;
  }

  build() {
    return new SequenceComponent(this.children.map((child) => child.build()));
  }
}

class RepeatExpr extends Expr {
  child: Expr;
  count: string;
  constructor(child: Expr, count: string) {
    super();
    this.child = child;
    this.count = count;
  }

  build() {
    return new RepeatComponent(this.child.build(), parseInt(this.count));
  }
}

class InterpreterError extends Error {}
class SyntaxError extends InterpreterError {
  constructor(msg: string) {
    super(msg);
    this.name = "SyntaxError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class Interpreter {
  tokenizer: Tokenizer;
  constructor() {
    this.tokenizer = new Tokenizer();
  }

  interpret(text: string) {
    const stack: (Expr | Token)[] = [];
    const tokens = this.tokenizer.tokenize(text);
    for (const token of tokens) {
      if (
        token instanceof OpenAngleBracketToken ||
        token instanceof CrossToken ||
        token instanceof OpenParenthesisToken
      ) {
        stack.push(token);
      } else if (token instanceof PitchToken) {
        const pitch = new Pitch(token.value);
        stack.push(new PitchExpr(pitch));
      } else if (token instanceof QuoteGroupToken) {
        const lastToken = stack[stack.length - 1];
        if (lastToken instanceof PitchExpr) {
          stack.pop();
          stack.push(lastToken.incrOctave(token.toInt()));
        } else {
          throw new SyntaxError(
            `QuoteGroupToken can only be found after a PitchExpr`
          );
        }
      } else if (token instanceof CloseParenthesisToken) {
        const args: Expr[] = [];
        while (true) {
          const arg = stack.pop();
          if (arg instanceof OpenParenthesisToken) {
            stack.push(new SequenceExpr(args.reverse()));
            break;
          } else if (arg instanceof Expr) {
            args.push(arg);
          } else {
            throw new SyntaxError("Sequence can only contain expressions");
          }
        }
      } else if (token instanceof CloseAngleBracketToken) {
        const args: NoteExpr[] = [];
        while (true) {
          const arg = stack.pop();
          if (arg instanceof OpenAngleBracketToken) {
            stack.push(new ChordExpr(args.reverse()));
            break;
          } else if (arg instanceof NoteExpr || arg instanceof PitchExpr) {
            args.push(arg);
          } else {
            throw new SyntaxError(
              "Chord can only contain Note or Pitch expressions"
            );
          }
        }
      } else if (token instanceof NumberToken) {
        const lastExpr = stack[stack.length - 1];
        if (lastExpr instanceof PitchExpr) {
          stack.pop();
          const newDuration = new Duration(token.toInt());
          stack.push(new NoteExpr(lastExpr.pitch, newDuration));
        } else if (lastExpr instanceof ChordExpr) {
          lastExpr.duration = new Duration(token.toInt());
        } else if (
          lastExpr instanceof CrossToken &&
          stack[stack.length - 2] instanceof Expr
        ) {
          if (stack.length < 2)
            throw new SyntaxError("Not enough arguments for repetition");

          stack.pop();
          const toRepeat = stack.pop();
          if (!(toRepeat instanceof Expr))
            throw new SyntaxError("Repetition only allowed for expressions");

          stack.push(new RepeatExpr(toRepeat, token.value));
        }
      }
    }
    const result = stack.pop();
    if (!(result instanceof Expr)) throw InterpreterError;
    return result;
  }
}
