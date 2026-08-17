(function () {
    var loginForm = document.querySelector('.login-card form[action="/admin/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function (ev) {
            ev.preventDefault();

            var formData = new FormData(loginForm);
            var submitBtn = loginForm.querySelector('button[type="submit"]');
            var errorBox = loginForm.querySelector('.login-error');

            if (submitBtn) {
                submitBtn.disabled = true;
            }
            if (errorBox) {
                errorBox.textContent = '';
                errorBox.classList.add('d-none');
            }

            fetch('login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            })
                .then(function (res) {
                    return res.json().then(function (data) {
                        return { status: res.status, data: data };
                    });
                })
                .then(function (result) {
                    if (result.data && result.data.ok) {
                        window.location.href = result.data.redirect || 'admin.html';
                        return;
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                    if (errorBox) {
                        errorBox.textContent = (result.data && result.data.message) || 'Usuario o contrasena incorrectos.';
                        errorBox.classList.remove('d-none');
                    }
                })
                .catch(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                    if (errorBox) {
                        errorBox.textContent = 'No se pudo conectar con el servidor.';
                        errorBox.classList.remove('d-none');
                    }
                });
        });
    }

    document.querySelectorAll('form[action="/admin/logout"]').forEach(function (form) {
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            window.location.href = 'index.html';
        });
    });
})();
