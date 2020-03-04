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
