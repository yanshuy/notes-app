import notesView from "./notesView.js";
import notesAPI from "./notesAPI.js";

export default class app {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new notesView(root, this._handler());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = notesAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handler() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "New Note..",
          body: "",
        };
        notesAPI.saveNotes(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, body) => {
        notesAPI.saveNotes({
          id: this.activeNote.id,
          title: title,
          body: body,
        });
        this._refreshNotes();
      },
      onNotedelete: (noteId) => {
        notesAPI.deleteNotes(noteId);
        this._refreshNotes();
      },
    };
  }
}
