class TodoItem {
    constructor(obj, owner = {}) {
        this.date = this.parseDate(obj.due_date);
        this.id = this.generateId(obj.id);
        this.title = this.generateTitleElement(obj.title);
        this.description = this.generateDescElement(obj.description);
        this.status = obj.status;
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
        return element
    };
    generateDescElement(desc) {
        // console.log(this);
        let element = `<p>${desc}</p>`
        element += `<p>Due date: ${this.date}</p>`
        return element
    };
    generateStatusCheckBox(status) {
        let element = `<input type="checkbox" ${status === 'completed' ? 'checked' : ''}>${this.title}`
        // console.log(element);
        return element
    };
    deleteButton() {
        return `<button class="button is-danger is-rounded todo-delete-btn" id="${this.id}">Delete</button>`
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