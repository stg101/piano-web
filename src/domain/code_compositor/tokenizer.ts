interface Token {
  value: string;
  toString: () => string;
}

class OpenAngleBracketToken implements Token {
  value = "<";
}

class CloseAngleBracketToken implements Token {
  value = ">";
}

class OpenParenthesisToken implements Token {
  value = "(";
}

class CloseParenthesisToken implements Token {
  value = ")";
}

class CrossToken implements Token {
  value = "x";
}

class SpaceToken implements Token {
  value = " ";
}

class NumberToken implements Token {
  value: string;
  constructor(value: string) {
    this.value = value;
  }

  append(char: string) {
    return new NumberToken(`${this.value}${char}`);
  }
}

class PitchToken implements Token {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

class QuoteGroupToken implements Token {
  value: string;
  constructor(value: string) {
    this.value = value;
  }

  incr() {
    return new QuoteGroupToken(`${this.value}'`);
  }
}

class DotGroupToken implements Token {
  value: string;
  constructor(value: string) {
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
