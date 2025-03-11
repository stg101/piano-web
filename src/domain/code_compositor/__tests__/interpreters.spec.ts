import { describe, it, expect } from "vitest";
import { Interpreter } from "../interpreter";
import { PrinterVisitor } from "../components";

describe("interpreter", () => {
  it("interprets correctly", () => {
    const text = `
     (<c d4>2 c'x5 c'')
    `;

    const rootExpr = new Interpreter().interpret(text);
    const root = rootExpr.build();
    const visitor = new PrinterVisitor();
    // console.log(root);
    root.visit(visitor);
  });
});
