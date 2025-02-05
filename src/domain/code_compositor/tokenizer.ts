export abstract class Token {
  abstract value: string;
}

export class OpenAngleBracketToken extends Token {
  value = "<";
}

export class CloseAngleBracketToken extends Token {
  value = ">";
}

export class OpenParenthesisToken extends Token {
  value = "(";
}

export class CloseParenthesisToken extends Token {
  value = ")";
}

export class CrossToken extends Token {
  value = "x";
}

export class SpaceToken extends Token {
  value = " ";
}

export class NumberToken extends Token {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }

  append(char: string) {
    return new NumberToken(`${this.value}${char}`);
  }

  toInt() {
    return parseInt(this.value);
  }
}

export class PitchToken extends Token {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }
}

export class QuoteGroupToken extends Token {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }

  incr() {
    return new QuoteGroupToken(`${this.value}'`);
  }

  toInt() {
    return this.value.length;
  }
}

export class DotGroupToken extends Token {
  value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }

  incr() {
    return new DotGroupToken(`${this.value}.`);
  }
}

class TokenizerError extends Error {}
class UnexpectedCharacterError extends TokenizerError {
  constructor(message: string) {
    super(message);
    this.name = "TokenizerError";
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}
export class Tokenizer {
  tokenize(text: string) {
    const stack: Token[] = [];

    text.split("").forEach((char) => {
      if (char.match(/[cdefgab]/)) {
        stack.push(new PitchToken(char));
      } else if (char.match(/[0-9]/)) {
        const lastToken = stack[stack.length - 1];
        if (lastToken instanceof NumberToken) {
          stack.pop();
          stack.push(lastToken.append(char));
        } else {
          stack.push(new NumberToken(char));
        }
      } else if (char == "'") {
        const lastToken = stack[stack.length - 1];
        if (lastToken instanceof QuoteGroupToken) {
          stack.pop();
          stack.push(lastToken.incr());
        } else {
          stack.push(new QuoteGroupToken(char));
        }
      } else if (char == ".") {
        const lastToken = stack[stack.length - 1];
        if (lastToken instanceof DotGroupToken) {
          stack.pop();
          stack.push(lastToken.incr());
        } else {
          stack.push(new DotGroupToken(char));
        }
      } else if (char == "x") {
        stack.push(new CrossToken());
      } else if (char == "<") {
        stack.push(new OpenAngleBracketToken());
      } else if (char == ">") {
        stack.push(new CloseAngleBracketToken());
      } else if (char == "(") {
        stack.push(new OpenParenthesisToken());
      } else if (char == ")") {
        stack.push(new CloseParenthesisToken());
      } else if (char.match(/\s/)) {
        stack.push(new SpaceToken());
      } else {
        throw new UnexpectedCharacterError(`Unexpected character: ${char}`);
      }
    });

    return stack;
  }
}
