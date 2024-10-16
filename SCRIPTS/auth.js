document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify({ username }));
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }


                window.location.href = '../HTMLS/index.html';
            } else {
                alert('Nombre de usuario o contraseña incorrectos');
            }
        });

        // Cargar usuario recordado si existe
        if (localStorage.getItem('rememberedUser')) {
            const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
            document.getElementById('loginUsername').value = rememberedUser.username;
            document.getElementById('loginPassword').value = rememberedUser.password;
            document.getElementById('rememberMe').checked = true;
        }
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username)) {
                alert('Este nombre de usuario ya está en uso');
                return;
            }

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro exitoso. Redirigiendo a inicio de sesión.');
            window.location.href = 'login.html';
        });
    }
});

//Usuarios
function getUsers() {
    let users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Mostrar la lista de usuarios
function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    const users = getUsers();

    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${user.username}`;
        userList.appendChild(li);
    });
}
// Mostrar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', displayUsers);
