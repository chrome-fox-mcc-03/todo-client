//#region non page related function
const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	onOpen: (toast) => {
	toast.addEventListener('mouseenter', Swal.stopTimer)
	toast.addEventListener('mouseleave', Swal.resumeTimer)
	}
});

function addDataTable (pageName) {
	let title = '';
	pageName = 'todo-list-page';
	if (pageName === 'todo-list-page') title = 'Your To Do';
	else if (pageName === 'due-list-page') title = 'Passed Due Date';

	let skeleton = `
	<div class="d-flex justify-content-between mb-3">
	<h3>${title}</h3>`;

	if (pageName === 'todo-list-page') skeleton += `<button class="btn btn-primary my-2 my-sm-0" type="submit" onclick="showForm()">Add New To Do</button>`;
	
	skeleton += `</div>
	<table class="table">
		<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Title</th>
			<th scope="col">Status</th>
			<th scope="col">Due Date</th>
			<th scope="col" colspan="3" style="text-align: center;">Action</th>
		</tr>
		</thead>
		<tbody id="todo-body">
			
		</tbody>
	</table>
	`;

	$('#todo-list-page').append(skeleton);
}

function getAllTodo () {
	if (localStorage.getItem('token')) {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:3000/todos',
			headers: {
				token: localStorage.getItem('token')
			}
		})
			.done((response) => {
				if (response.data.length > 0) {
					addDataTable();
					//#region fill list table with data
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
					});
					//#endregion
				} else {
					$('#todo-list-page').append(`
					<div class="jumbotron">
						<h1 class="display-4">Oops!</h1>
						<p class="lead">You don't have any To Do yet!</p>
						<hr class="my-4">
						<p>Click here to add a new To Do.</p>
						<p class="lead">
						<a class="btn btn-primary btn-lg" role="button" style="color:white;" onclick="showForm()">New To Do</a>
						</p>
					</div>
					`);
				}
			})
			.fail((err) => {
				let msg = JSON.parse(err.responseText);
			})
	}
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
				Toast.fire({
					icon: 'success',
					title: 'To do successfully updated!'
				});

				showList();
			})
			.fail((err) => {
				showError(err);
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
				Toast.fire({
					icon: 'success',
					title: 'To do successfully created!'
				});

				showList();
			})
			.fail((err) => {
				showError(err.responseJSON);
			});
	}
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
			Toast.fire({
				icon: 'success',
				title: `To do "${response.data.title}" status successfully updated!`
			});

			showList();
		})
		.fail((err) => {
			showError(err)
		});
}

function deleteTodo (id) {
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	})
		.then((result) => {
			if (result.value) {
				$.ajax({
					method: 'DELETE',
					url: `http://localhost:3000/todos/${id}`,
					headers: {
						token: localStorage.getItem('token')
					}
				})
					.done((response => {
						Toast.fire({
							icon: 'success',
							title: 'To do successfully deleted!'
						});
		
						showList();
					}))
					.fail((err) => {
						let msg = JSON.parse(err.responseText);
						showError(msg);
					})
			}
		})
}

function getGreetingTime (m) {
	var g = null; //return g
	
	if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
	
	var split_afternoon = 12 //24hr time to split the afternoon
	var split_evening = 17 //24hr time to split the evening
	var currentHour = parseFloat(m.format("HH"));
	
	if(currentHour >= split_afternoon && currentHour <= split_evening) {
		g = "afternoon";
	} else if(currentHour >= split_evening) {
		g = "evening";
	} else {
		g = "morning";
	}
	
	return g;
}

	//#region custom google sign in

	function googleOnSuccess(googleUser) {
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
				
				Toast.fire({
					icon: 'success',
					title: 'Signed in successfully'
				});

				showList();
			})
			.fail((err) => {
				showError(err)
			})
	}

	function googleOnFailure(error) {
		showError(error)
	}

	function renderButton() {
		gapi.signin2.render('custom-google-signin2', {
			'scope': 'profile email',
			'width': 240,
			'height': 50,
			'longtitle': true,
			'theme': 'dark',
			'onsuccess': googleOnSuccess,
			'onfailure': googleOnFailure
		});
	}

	//#endregion

//#endregion

//#region page related function
function showPage (pageName) {
	$('#alert-error').hide();
	let pages = ['todo-list-page', 'signIn-page', 'signUp-page', 'todo-form-page', 'todo-due-page'];

	if (pageName === 'signIn-page' || pageName === 'signUp-page') {
		$('#navigation').hide();
		$('body').css('background', 'linear-gradient(to right, #0062E6, #33AEFF)');
	} else {
		$('#navigation').show();
		$('body').css('background', 'white');
	}

	pages.forEach(el => {
		el === pageName ? $(`#${el}`).show() : $(`#${el}`).hide();
	})
}

function showForm () {
	if (localStorage.getItem('token')) {
		$('#nav-new-todo').addClass('active');
		$('#nav-home').removeClass('active');

		$('#todo-title').val('');
		$('#todo-description').val('');
		$('#todo-due_date').val('');
		$('#todo-form').attr('onsubmit', 'save(event)');
		showPage('todo-form-page');
	} else {
		showPage('signIn-page');
	}
}

function showList () {
	$('#todo-list-page').empty();
	showPage('todo-list-page');
	if (localStorage.getItem('token')) {
		$('#nav-home').addClass('active');
		$('#nav-new-todo').removeClass('active');

		$('#user-name').remove();
		let user = localStorage.getItem('name');
		var humanizedGreeting = "Good " + getGreetingTime(moment()) + ", " + user;
		$('#todo-list-page').append(`<h2 id="user-name" class="mb-3 mt-3">${ humanizedGreeting }</h2>`);

		getAllTodo();
	} else {
		showPage('signIn-page');
	}
}

function cancelToDoForm() {
	showPage('todo-list-page');
}

function showSignUp () {
	// event.preventDefault();

	if (!localStorage.getItem('token')) {
		$('#signup-name').val('');
		$('#signup-email').val('');
		$('#signup-password').val('');
		showPage('signUp-page');
	} else {
		showPage('todo-list-page')
	}
}

function showSignIn () {
	// event.preventDefault();

	!localStorage.getItem('token') ? showPage('signIn-page') : showPage('todo-list-page');

	$.ajax({
		method: 'GET',
		url: 'http://localhost:3000/quote'
	})
		.done(response => {
			$('#quote-block').append(`<p style="color: white;">"${response.quote}" - ${response.author}</p>`)
		})
		.fail(err => {
			showError(err);
		})
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
			showError(err)
		});
}

function showError (errors) {
	// $('#alert-error').show();
	// errors = errors.msg.map(el => el = `<span>${el}</span>`);

	// let alertBlock = `<h4 class="alert-heading">Validation Error!</h4>`
	
	// alertBlock += errors.join('<hr>');
	// console.log(alertBlock);
	// $('#alert-error').append(alertBlock);

	Swal.fire({
		icon: 'error',
		title: 'Validation Error!',
		html: errors.msg.join(`<br>`)
	})
}

//#endregion

$(document).ready(function () {
	const token = localStorage.getItem('token');

	if (token) {
		showList();
	} else {
		showSignIn();
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

				Toast.fire({
					icon: 'success',
					title: 'Signed in successfully'
				});
				
				showList();
			})
			.fail((err) => {
				let errors = JSON.parse(err.responseText);
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
				localStorage.setItem('name', name);
				showList();
			})
			.fail((err) => {
				let msg = JSON.parse(err.responseText);
				showError(msg)
			});
	});

	$("#form-signOut").on('click', function(e) {
		e.preventDefault();

		localStorage.removeItem('token');
		localStorage.removeItem('name');
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			showPage('signIn-page');
		});
	});
});