function showPage (pageName) {
	$('#alert-error').remove();
	let pages = ['todo-list-page', 'signIn-page', 'signUp-page', 'todo-form-page'];

	(pageName === 'signIn-page' || pageName === 'signUp-page') ? $('body').css('background', 'linear-gradient(to right, #0062E6, #33AEFF)') : $('body').css('background', 'white');

	pages.forEach(el => {
		el === pageName ? $(`#${el}`).show() : $(`#${el}`).hide();
		if (el === 'todo-list-page') getAllTodo();
	})
}

function cancelToDoForm() {
	showPage('todo-list-page');
}
function showSignUp(event) {
	event.preventDefault();
	$('#signup-name').val('');
	$('#signup-email').val('');
	$('#signup-password').val('');
	showPage('signUp-page');
}
function showSignIn(event) {
	event.preventDefault();
	showPage('signIn-page');
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
			$('#user-name').remove();
			let name = localStorage.getItem('name');
			$('#todo-list-page').prepend(`<h1 id="user-name">Hi, ${ name }</h1>`)
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
					${ (!el.status) ? `<td><button type="button" class="btn btn-success" onClick="toggleStatus(${ el.id }, ${ el.status })">Mark as Done</button></td>` : `<td><button type="button" class="btn btn-primary" onClick="toggleStatus(${ el.id }, ${ el.status })">Mark as In Progress</button></td>`}
					<td><button type="button" class="btn btn-primary" onClick="showUpdate(${el.id})">Update</button></td>
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
	$('#todo-title').val('');
	$('#todo-description').val('');
	$('#todo-due_date').val('');
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
		$.ajax({
			method: 'PUT',
			url: `http://localhost:3000/todos/${id}`,
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
				showPage('todo-list-page');
			})
			.fail((err) => {
				// let msg = JSON.parse(err.responseText)
				console.log(err);
			});
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
				showPage('todo-list-page');
			})
			.fail((err) => {
				// let msg = JSON.parse(err.responseText)
				console.log(err);
			});
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

function toggleStatus (id, status) {
	$.ajax({
		method: 'PUT',
		url: `http://localhost:3000/todos/${id}`,
		headers: {
			token: localStorage.getItem('token')
		},
		data: {
			status: !status
		}
	})
		.done((response) => {
			showPage('todo-list-page');
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
			.fail((err) => {
				let msg = JSON.parse(err.responseText)
				console.log(msg);
			})
	}
}

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	
	var id_token = googleUser.getAuthResponse().id_token;

	$.ajax({
		method: 'POST',
		url: 'http://localhost:3000/user/googlesignin',
		headers: {
			token: id_token
		}
	})
		.done((response) => {
			localStorage.setItem('token', response.token);
			localStorage.setItem('name', response.name);
			showPage('todo-list-page');
		})
		.fail((err) => {
			console.log(err);
		})
}

$(document).ready(function () {
	const token = localStorage.getItem('token');

	if (token) {
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
				localStorage.setItem('token', response.token);
				localStorage.setItem('name', response.name);

				showPage('todo-list-page');
			})
			.fail((err) => {
				let errors = JSON.parse(err.responseText);
				errors = errors.msg.map(el => el = `<p>${el}</p>`);
				let alertBlock = `
				<div class="alert alert-danger" role="alert" id="alert-error">
				<h4 class="alert-heading">Validation Error!</h4>
				`;

				alertBlock += errors.join('<hr>');

				alertBlock += `
				</div>`;
				$('#signIn-page').prepend(alertBlock);
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
				showPage('todo-list-page');
			})
			.fail((err) => {
				let msg = JSON.parse(err.responseText);
			});
	});

	$("#form-signOut").on('submit', function(e) {
		e.preventDefault();

		localStorage.removeItem('token');
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});


		showPage('signIn-page');
	})
});