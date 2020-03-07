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