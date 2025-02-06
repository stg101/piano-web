import { AudioPlayer, type Note, type Playable } from "../audio-player";

export interface AudioComponent {
  visit: (visitor: AudioComponentVisitor) => any;
}

export interface AudioComponentVisitor {
  visitNoteComponent: (component: NoteComponent) => any;
  visitChordComponent: (component: ChordComponent) => any;
  visitSequenceComponent: (component: SequenceComponent) => any;
  visitRepeatComponent: (component: RepeatComponent) => any;
}

export class SerializerVisitor implements AudioComponentVisitor {
  buffer: Playable[] = [];

  visitNoteComponent(comp: NoteComponent) {
    this.buffer.push({ type: "NOTE", value: comp.note });
  }
  visitChordComponent(comp: ChordComponent) {
    this.buffer.push({ type: "CHORD", value: comp.notes });
  }
  visitSequenceComponent(comp: SequenceComponent) {
    for (const child of comp.children) {
      child.visit(this);
    }
  }
  visitRepeatComponent(comp: RepeatComponent) {
    let n = comp.count;
    while (n--) {
      comp.child.visit(this);
    }
  }
}

export class PrinterVisitor implements AudioComponentVisitor {
  visitNoteComponent(comp: NoteComponent) {
    console.log(comp.note);
  }
  visitChordComponent(comp: ChordComponent) {
    console.log(comp.notes);
  }
  visitSequenceComponent(comp: SequenceComponent) {
    for (const child of comp.children) {
      child.visit(this);
    }
  }
  visitRepeatComponent(comp: RepeatComponent) {
    let n = comp.count;
    while (n--) {
      comp.child.visit(this);
    }
  }
}

export class NoteComponent implements AudioComponent {
  note: Note;
  constructor(note: Note) {
    this.note = note;
  }
  visit(visitor: AudioComponentVisitor) {
    visitor.visitNoteComponent(this);
  }
}

export class SequenceComponent implements AudioComponent {
  children: AudioComponent[];
  constructor(children: AudioComponent[]) {
    this.children = children;
  }
  visit(visitor: AudioComponentVisitor) {
    visitor.visitSequenceComponent(this);
  }
}

export class RepeatComponent implements AudioComponent {
  child: AudioComponent;
  count: number;
  constructor(child: AudioComponent, count: number) {
    this.count = count;
    this.child = child;
  }
  visit(visitor: AudioComponentVisitor) {
    visitor.visitRepeatComponent(this);
  }
}

export class ChordComponent implements AudioComponent {
  children: NoteComponent[];
  constructor(notes: NoteComponent[]) {
    this.children = notes;
  }

  get notes() {
    return this.children.map((child) => {
      return child.note;
    });
  }

  visit(visitor: AudioComponentVisitor) {
    visitor.visitChordComponent(this);
  }
}
