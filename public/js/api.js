/* DEFAULT CONNECTION */

const URL = 'https://todo-server-juleshwa.herokuapp.com/'

const register = (payload) => {
    return $.ajax({
        type: 'POST',
        data: {
            email: payload.email,
            password: payload.password
        },
        url: `${URL}/register`,
    })
}

const login = (payload) => {
    return $.ajax({
        type: 'POST',
        data: {
            email: payload.email,
            password: payload.password
        },
        url: `${URL}/login`
    })
}

const fetchTodos = () => {
    const token = localStorage.getItem('token');
    return $.ajax({
        type: 'GET',
        headers: {
            token
        },
        url: `${URL}/todos`
    })
}

const createTodo = (payload) => {
    return $.ajax({
        type: 'POST',
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: payload.title,
            description: payload.description,
            due_date: payload.due_date
        },
        url: `${URL}/todos`
    })
}

const fetchOne = (id) => {
    return $.ajax({
        type: 'GET',
        url: `${URL}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
}

const updateOneTodo = (id, payload) => {
    return $.ajax({
        type: 'PUT',
        url: `${URL}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            id: payload.id,
            title: payload.title,
            description: payload.title,
            status: payload.status,
            due_date: payload.due_date
        }
    })

}

const deleteTodo = (id) => {
    return $.ajax({
        type: 'DELETE',
        url: `${URL}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
}

const googleSign = (id_token) => {
    return $.ajax({
        url: `${URL}/googleSign`,
        type: 'GET',
        headers: {
            id_token
        }
    })
}


