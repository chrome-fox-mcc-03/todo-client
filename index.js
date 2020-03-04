function showPage (pageName) {
	let pages = ['todo-list-page', 'signIn-page', 'signUp-page', 'todo-form-page']

	pages.forEach(el => {
		el === pageName ? $(`#${el}`).show() : $(`#${el}`).hide();
	})
}

function cancelToDoForm() {
	getAllTodo();
	showPage('todo-list-page');
}

function getAllTodo () {
	$.ajax({
		method: 'GET',
		url: 'http://localhost:3000/todos',
		headers: {
			token: localStorage.getItem('token')
		}
	})
		.done((response) => {
			$('#todo-body').empty();
			response.data.forEach((el, i) => {
				let flag = '';
				if (new Date(el.due_date) < new Date()) {
					if (!el.status) flag = 'table-danger'
				}
				$('#todo-body').append(`
				<tr class="${ flag }">
					<td>${ i + 1 }</td>
					<td>${ el.title }</td>
					<td>${ el.status ? 'Done' : 'On Progress'}</td>
					<td>${ moment(el.due_date).format('DD MMM YYYY') }</td>
					<td style="text-align:right"><button type="button" class="btn btn-primary" onClick="showUpdate(${el.id})">Update</button></td>
					<td><button type="button" class="btn btn-danger" onClick="deleteTodo(${el.id})">Delete</button></td>
				</tr>
				`);
			})
		})
		.fail((err) => {
			let msg = JSON.parse(err.responseText);
		})
}

function showForm () {
	$('#todo-form').attr('onsubmit', 'save(event)');
	showPage('todo-form-page');
}

function save (event, id) {
	event.preventDefault();

	id = id || '';
	let title = $('#todo-title').val();
	let description = $('#todo-description').val();
	let due_date = $('#todo-due_date').val();

	if (id !== '') {

	} else {
		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/todos',
			headers: {
				token: localStorage.getItem('token')
			},
			data: {
				title,
				description,
				due_date
			}
		})
			.done((response) => {
				getAllTodo();
				$('#todo-list-page').show();
				$('#signIn-page').hide();
				$('#signUp-page').hide();
				$('#todo-form-page').hide();
			})
			.fail((err) => {
				// let msg = JSON.parse(err.responseText)
				console.log(err);
			})
	}
}

function showUpdate (id) {
	$.ajax({
		method: 'GET',
		url: `http://localhost:3000/todos/${id}`,
		headers: {
			token: localStorage.getItem('token')
		}
	})
		.done((response) => {
			let dueDate = moment(response.data.due_date).format('YYYY-MM-DD');
			$('#todo-title').val(response.data.title);
			$('#todo-description').val(response.data.description);
			$('#todo-due_date').val(dueDate);
			$('#todo-form').attr('onsubmit', `save(event, ${id})`);
			showPage('todo-form-page');
		})
		.fail((err) => {
			// let msg = JSON.parse(err.responseText)
			console.log(err);
		});
}

function deleteTodo (id) {
	if (confirm('Are you sure?')) {
		$.ajax({
			method: 'DELETE',
			url: `http://localhost:3000/todos/${id}`,
			headers: {
				token: localStorage.getItem('token')
			}
		})
			.done((response => {
				getAllTodo();
			}))
	}
}

$(document).ready(function () {
	const token = localStorage.getItem('token');

	if (token) {
		getAllTodo();
		showPage('todo-list-page');
	} else {
		showPage('signIn-page');
	}

	$("#form-signIn").on('submit', function(e) {
		e.preventDefault();

		let email = $('#signin-email').val();
		let password = $('#signin-password').val();

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/user/signin',
			data: {
				email,
				password
			}
		})
			.done((response) => {
				// simpen d local storage
				console.log(`berhasil`);
				localStorage.setItem('token', response.token);

				getAllTodo();
				showPage('todo-list-page');
			})
			.fail((err) => {
				let msg = JSON.parse(err.responseText)
				console.log(msg);
			});
	});

	$("#form-signUp").on('submit', function(e) {
		e.preventDefault();

		let name = $('#signup-name').val();
		let email = $('#signup-email').val();
		let password = $('#signup-password').val();

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/user/signup',
			data: {
				name,
				email,
				password
			}
		})
			.done((response) => {
				localStorage.setItem('token', response.token);
			})
			.fail((err) => {
				let msg = JSON.parse(err.responseText);
			});
	});

	$("#form-signOut").on('submit', function(e) {
		e.preventDefault();

		localStorage.removeItem('token');

		showPage('signIn-page');
	})
});