async function editFormHandler(event) {
    event.preventDefault();

    const user_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const username = document.querySelector('#username-edit').value.trim();
    const email = document.querySelector('#email-edit').value.trim();
    const password = document.querySelector('#password-edit').value.trim();
    const confirm = document.querySelector('#password-edit2').value.trim();
    const user_bio = document.querySelector('#bio-edit').value.trim();

    let updates;

    password !== '' ? updates = JSON.stringify({
        username,
        email,
        user_bio,
        password
    }) : updates = JSON.stringify({
        username,
        email,
        user_bio
    })


    if (password === confirm) {
        const response = await fetch('/api/users/' + user_id, {
            method: 'PUT',
            body: updates,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } else {
        alert("Passwords Don't Match!")
    }
}

document.querySelector('.edit-form').addEventListener('submit', editFormHandler);