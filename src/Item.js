class TodoItem {
    constructor(obj, owner = {}) {
        this.id = this.generateId(obj.id);
        this.title = this.generateTitleElement(obj.title);
        this.description = this.generateDescElement(obj.description);
        this.status = obj.status;
    }
    generateId(idNum) {
        let element = `${idNum}`
        return element
    };
    generateTitleElement(title) {
        let element = `<h2>${title}</h2>`
        return element
    };
    generateDescElement(desc) {
        let element = `<p>${desc}</p>`
        return element
    };
    generateStatusCheckBox(status) {
        let element = `<input type="checkbox" ${status === 'completed' ? 'checked' : ''}>${this.title}`
        // console.log(element);
        return element
    };
    editButton() {
        return `<button class="button is-primary is-rounded" id="edit-btn-${this.id}">Edit</button>`
    }
    get itemContent() {
        // console.log(this);
        return `<div class="box content ${this.status === 'todo' ? 'has-background-warning' : 'has-background-success'}" id="${this.id}">${this.title + this.description + this.editButton()}</div>`
    }
    static create(obj) {
        return new TodoItem(obj);
    }
}