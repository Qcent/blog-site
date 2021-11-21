async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim() || '';
    const email = document.querySelector('#email-signup').value.trim() || '';
    const password = document.querySelector('#password-signup').value.trim() || '';
    const passwordConfirm = document.querySelector('#password-signup2').value.trim() || '';

    if (username && email && password && password === passwordConfirm) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        // check the response status
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            response.json()
                .then(res => alert(res.message));
        }
    } else {
        alert("Please Fill out all fields and ensure Passwords match.")
    }

}

async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            response.json()
                .then(res => alert(res.message));
        }
    }
}

if (document.querySelector('.login-form')) {
    document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
}
if (document.querySelector('.signup-form')) {
    document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
}