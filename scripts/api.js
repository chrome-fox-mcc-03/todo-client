const BASE_URL = 'http://localhost:3000';

const register = (payload) => {
  return $.ajax({
    url: `${BASE_URL}/register`,
    type: 'POST',
    data: {
      email: payload.email,
      password: payload.password,
    },
  });
}

const login = (payload) => {
  return $.ajax({
    url: `${BASE_URL}/login`,
    type: 'POST',
    data:{
      email: payload.email,
      password: payload.password,
    },
  });
}

const fetchAllTodo = () => {
  return $.ajax({
    url: `${BASE_URL}/todo`,
    type: 'GET',
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('access_token');
  });
}

const addTodo = (payload) => {
  return $.ajax({
    url: `${BASE_URL}/todo`,
    type:'POST',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
    },
  });
}

const updateStatus = (payload) => {
  const id = payload.id;
  const status = payload.status;
  return $.ajax({
    url: `${BASE_URL}/todo/${id}/status`,
    method: 'PATCH',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      status
    }
  });
}

const editTodo = (payload) => {
  const id = payload.id;
  const title = payload.title;
  const description = payload.description;
  const due_date = payload.due_date;
  return $.ajax({
    url: `${BASE_URL}/todo/${id}`,
    method: 'PUT',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      title,
      description,
      due_date,
    }
  });
}

const deleteTodo = (id) => {
  return $.ajax({
    url: `${BASE_URL}/todo/${id}`,
    method: 'DELETE',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  });
}