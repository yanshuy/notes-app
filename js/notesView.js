export default class notesView {
  constructor(
    root,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNotedelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNotedelete = onNotedelete;
    this.root.innerHTML = `<div class="notes__sidebar">
        <button class="notes__add" type="button">Add Note</button>
        <div class="notes__list"></div>
      </div>
      <div class="notes__preview">
        <input
          id="notes__title"
          class="notes__title"
          type="text"
          placeholder="Add Title..."
        />
        <textarea class="notes__body" placeholder="Hint: click anywhere after typing to save."></textarea>
      </div>
      `;

    const buttonAddNote = this.root.querySelector(".notes__add");
    const noteTitle = this.root.querySelector(".notes__title");
    const noteBody = this.root.querySelector(".notes__body");

    buttonAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [noteTitle, noteBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = noteTitle.value.trim();
        const updatedBody = noteBody.value.trim();
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id, title, body, updated) {
    const Max_Body_Lenght = 60;
    return `<div class="notes__list-item" data-note-id="${id}">
  <div class="notes__small-title">${title}</div>
  <div class="notes__small-body">
  ${body.substring(0, 60)}
  ${body.length > Max_Body_Lenght ? "..." : ""}
  </div>
  <div class="notes__small-updated">
  ${updated.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  })}
  </div>
  </div>`;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list");

    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );
      notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    notesListContainer
      .querySelectorAll(".notes__list-item")
      .forEach((listItem) => {
        listItem.addEventListener("click", () => {
          this.onNoteSelect(listItem.dataset.noteId);
        });
        listItem.addEventListener("dblclick", () => {
          if (confirm("are you sure u want to delete this note?")) {
            this.onNotedelete(listItem.dataset.noteId);
          }
        });
      });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListitem) => {
      noteListitem.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
