const register_api = "https://api.freeapi.app/api/v1/users/register"
const login_api = "https://api.freeapi.app/api/v1/users/login"
const logout_api = "https://api.freeapi.app/api/v1/users/logout"
const curr_user_api = "https://api.freeapi.app/api/v1/users/current-user"


document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const res = await fetch(register_api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        })

        const data = await res.json()
        if (res.ok) {
            document.getElementById('register-form').reset()
            alert('Registration successful! Please log in.')
        } else {
            throw new Error(data.message)
        }
    } catch {
        alert('Registration failed. Please try again.')        
    }
})


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const res = await fetch(login_api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password })
        })

        const data = await res.json()
        if (res.ok) {
            document.getElementById('login-form').reset()
            alert('Login successful')
        } else {
            throw new Error(data.message)
        }
    } catch {
        alert('Login failed. Please try again.')
    }
})

