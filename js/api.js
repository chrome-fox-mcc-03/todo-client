/* DEFAULT CONNECTION */

const URL = 'http://localhost:3000'

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

const createTodos = (payload) => {
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

const updateTodos = () => {

}

const deleteTodos = () => {

}