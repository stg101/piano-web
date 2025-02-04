import { AudioPlayer, type Note } from "../audio-player";

interface AudioComponent {
  visit: (visitor: AudioComponentVisitor) => any;
}

interface AudioComponentVisitor {
  visitNoteComponent: (component: NoteComponent) => any;
  visitChordComponent: (component: ChordComponent) => any;
}

export class AudioPlayerVisitor implements AudioComponentVisitor {
  visitNoteComponent(comp: NoteComponent) {
    AudioPlayer.getInstance().playNote(comp.note);
  }
  visitChordComponent(comp: ChordComponent) {
    AudioPlayer.getInstance().playChord(comp.notes);
  }
}

class NoteComponent implements AudioComponent {
  note: Note;
  constructor(note: Note) {
    this.note = note;
  }
  visit(visitor: AudioComponentVisitor) {
    visitor.visitNoteComponent(this);
  }
}

class ChordComponent implements AudioComponent {
  notes: Note[];
  constructor(notes: Note[]) {
    this.notes = notes;
  }

  visit(visitor: AudioComponentVisitor) {
    visitor.visitChordComponent(this);
  }
}
