class TodoItem {
    constructor(obj, owner = {}) {
        this.status = obj.status;
        this.date = this.parseDate(obj.due_date);
        this.id = this.generateId(obj.id);
        this.title = this.generateTitleElement(obj.title);
        this.description = this.generateDescElement(obj.description);
    }
    parseDate(date) {
        return date.split('T')[0]
    }
    generateId(idNum) {
        let element = `${idNum}`
        return element
    };
    generateTitleElement(title) {
        let element = `<h2>${title}</h2>`
        element += `<p class="help">${this.status}</p>`
        return element
    };
    generateDescElement(desc) {
        let element = `<p>${desc}</p>`
        element += `<p>Due date: ${this.date}</p>`
        return element
    };
    generateStatusCheckBox(status) {
        let element = `<input type="checkbox" ${status === 'completed' ? 'checked' : ''}>${this.title}`
        return element
    };
    deleteButton() {
        let button = '';
        if (this.status === 'completed') {
            button = `<button class="button is-danger is-rounded todo-delete-btn" id="${this.id}">Delete</button>`
        }
        return button
    }
    editButton() {
        return `<button class="button is-primary is-rounded todo-edit-btn" id="${this.id}">Edit</button>`
    }
    detailsButton() {
        return `<button class="button is-link is-rounded todo-details-btn" id="${this.id}">See Details</button>`
    }
    get itemContent() {
        return `<div class="box content ${this.status === 'todo' ? 'has-background-warning' : 'has-background-success'}" id="item-${this.id}">${this.title + this.description + this.editButton() + this.detailsButton() + this.deleteButton()}
        </div>`
    }
    static create(obj) {
        return new TodoItem(obj);
    }
}