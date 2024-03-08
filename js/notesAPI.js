export default class notesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    return notes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }
  static saveNotes(noteToSave) {
    const notes = notesAPI.getAllNotes();
    const existing = notes.find((note) => note.id == noteToSave.id);

    if (existing) {
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toString();
    } else {
      noteToSave.id = Math.floor(Math.random() * 10000);
      noteToSave.updated = new Date().toString();
      notes.push(noteToSave);
    }
    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }
  static deleteNotes(id) {
    const notes = notesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);
    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
