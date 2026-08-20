(function () {
    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // ---- Presentacion / institucional (nosotros_bloques) ----
    (function () {
        var body = document.getElementById('nosBloq-body');
        if (!body) return;

        var modal = document.getElementById('nosBloqModal');
        var form = document.getElementById('nosBloqModalForm');
        var fileInput = document.getElementById('nosBloqField_imagenFile');
        var preview = document.getElementById('nosBloqField_imagenPreview');
        var urlInput = document.getElementById('nosBloqField_imagen');
        var errorEl = document.getElementById('nosBloqField_imagenError');
        var items = [];

        function closeModal() { modal.classList.remove('is-open'); }
        function openModal(item) {
            form.reset();
            errorEl.style.display = 'none';
            document.getElementById('nosBloqModalTitle').textContent = 'Editar: ' + item.titulo;
            document.getElementById('nosBloqField_titulo').value = item.titulo || '';
            document.getElementById('nosBloqField_contenido').value = item.contenido || '';
            var quill = window.__quillFields && window.__quillFields['nosBloqField_contenido'];
            if (quill) quill.root.innerHTML = item.contenido || '';
            urlInput.value = item.imagen || '';
            preview.src = item.imagen || 'https://placehold.co/170x120/f1f5f9/94a3b8?text=Imagen';
            form.setAttribute('data-editing-clave', item.clave);
            modal.classList.add('is-open');
        }

        document.getElementById('nosBloqModalClose').addEventListener('click', closeModal);
        document.getElementById('nosBloqModalCancel').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

        function renderRows() {
            body.innerHTML = items.map(function (b) {
                return '<tr>'
                    + '<td><img class="thumb-admin" src="' + escapeHtml(b.imagen) + '" alt="' + escapeHtml(b.titulo) + '"></td>'
                    + '<td><strong>' + escapeHtml(b.titulo) + '</strong></td>'
                    + '<td class="text-right"><button type="button" class="btn btn-sm btn-outline-secondary" data-nosbloq-edit="' + b.clave + '"><i class="fas fa-pencil-alt"></i> Editar</button></td>'
                    + '</tr>';
            }).join('');
        }

        body.addEventListener('click', function (ev) {
            var btn = ev.target.closest('[data-nosbloq-edit]');
            if (!btn) return;
            var clave = btn.getAttribute('data-nosbloq-edit');
            var item = items.find(function (b) { return b.clave === clave; });
            if (item) openModal(item);
        });

        fileInput.addEventListener('change', function () {
            errorEl.style.display = 'none';
            var file = fileInput.files && fileInput.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                errorEl.textContent = 'El archivo supera el limite de 10MB.';
                errorEl.style.display = 'block';
                fileInput.value = '';
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) { preview.src = e.target.result; };
            reader.readAsDataURL(file);
        });

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var clave = form.getAttribute('data-editing-clave');
            var file = fileInput.files && fileInput.files[0];

            var uploadPromise = Promise.resolve();
            if (file) {
                var fd = new FormData();
                fd.append('file', file);
                fd.append('tabla', 'nosotros_bloques');
                fd.append('anterior', urlInput.value || '');
                uploadPromise = authFetch(window.API_BASE + '/api/upload', { method: 'POST', body: fd })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) {
                            errorEl.textContent = result.message || 'No se pudo subir la imagen.';
                            errorEl.style.display = 'block';
                            return Promise.reject(new Error('upload-failed'));
                        }
                        urlInput.value = result.url;
                    });
            }

            uploadPromise.then(function () {
                var contenidoField = document.getElementById('nosBloqField_contenido');
                var quill = window.__quillFields && window.__quillFields['nosBloqField_contenido'];
                if (quill) contenidoField.value = quill.getText().trim() === '' ? '' : quill.root.innerHTML;

                var payload = {
                    titulo: document.getElementById('nosBloqField_titulo').value.trim(),
                    contenido: contenidoField.value,
                    imagen: urlInput.value
                };
                return authFetch(window.API_BASE + '/api/nosotros_bloques?clave=' + encodeURIComponent(clave), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) return;
                        var idx = items.findIndex(function (b) { return b.clave === clave; });
                        if (idx !== -1) items[idx] = result.bloque;
                        renderRows();
                        closeModal();
                    });
            }).catch(function () {});
        });

        fetch(window.API_BASE + '/api/nosotros_bloques')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                items = data;
                renderRows();
            })
            .catch(function () {});
    })();

    // ---- Trayectoria (nosotros_trayectoria) ----
    (function () {
        var body = document.getElementById('nosTray-body');
        if (!body) return;

        var modal = document.getElementById('nosTrayModal');
        var form = document.getElementById('nosTrayModalForm');
        var items = [];

        function closeModal() { modal.classList.remove('is-open'); }
        function openModal(item) {
            form.reset();
            document.getElementById('nosTrayField_numero').value = item.numero || '';
            document.getElementById('nosTrayField_sufijo').value = item.sufijo || '';
            document.getElementById('nosTrayField_etiqueta').value = item.etiqueta || '';
            document.getElementById('nosTrayField_enlace_texto').value = item.enlace_texto || '';
            document.getElementById('nosTrayField_enlace_url').value = item.enlace_url || '';
            form.setAttribute('data-editing-id', item.id);
            modal.classList.add('is-open');
        }

        document.getElementById('nosTrayModalClose').addEventListener('click', closeModal);
        document.getElementById('nosTrayModalCancel').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

        function renderRows() {
            body.innerHTML = items.map(function (t) {
                return '<tr>'
                    + '<td><strong>+' + escapeHtml(t.numero) + (t.sufijo ? ' ' + escapeHtml(t.sufijo) : '') + '</strong></td>'
                    + '<td>' + escapeHtml(t.etiqueta) + '</td>'
                    + '<td class="text-right"><button type="button" class="btn btn-sm btn-outline-secondary" data-nostray-edit="' + t.id + '"><i class="fas fa-pencil-alt"></i> Editar</button></td>'
                    + '</tr>';
            }).join('');
        }

        body.addEventListener('click', function (ev) {
            var btn = ev.target.closest('[data-nostray-edit]');
            if (!btn) return;
            var id = btn.getAttribute('data-nostray-edit');
            var item = items.find(function (t) { return String(t.id) === id; });
            if (item) openModal(item);
        });

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var editingId = form.getAttribute('data-editing-id');
            var payload = {
                numero: document.getElementById('nosTrayField_numero').value.trim(),
                sufijo: document.getElementById('nosTrayField_sufijo').value.trim(),
                etiqueta: document.getElementById('nosTrayField_etiqueta').value.trim(),
                enlace_texto: document.getElementById('nosTrayField_enlace_texto').value.trim(),
                enlace_url: document.getElementById('nosTrayField_enlace_url').value.trim()
            };
            if (!payload.numero || !payload.etiqueta) return;

            authFetch(window.API_BASE + '/api/nosotros_trayectoria?id=' + encodeURIComponent(editingId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) return;
                    var idx = items.findIndex(function (t) { return String(t.id) === editingId; });
                    if (idx !== -1) items[idx] = result.trayectoria;
                    renderRows();
                    closeModal();
                })
                .catch(function () {});
        });

        fetch(window.API_BASE + '/api/nosotros_trayectoria')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                items = data;
                renderRows();
            })
            .catch(function () {});
    })();

    // ---- Valores institucionales (nosotros_valores) ----
    (function () {
        var body = document.getElementById('nosVal-body');
        if (!body) return;

        var MAX_VALORES = 6;
        var counter = document.getElementById('nosVal-counter');
        var addBtn = document.getElementById('nosVal-add-btn');
        var modal = document.getElementById('nosValModal');
        var form = document.getElementById('nosValModalForm');
        var iconoSelect = document.getElementById('nosValField_icono');
        var iconoPreview = document.getElementById('nosValField_iconoPreview');
        var items = [];

        function closeModal() { modal.classList.remove('is-open'); }
        function openModal(item) {
            form.reset();
            document.getElementById('nosValModalTitle').textContent = item ? 'Editar valor' : 'Nuevo valor';
            document.getElementById('nosValField_nombre').value = item ? item.nombre : '';
            iconoSelect.value = item ? item.icono_fa : iconoSelect.options[0].value;
            iconoPreview.className = iconoSelect.value;
            form.setAttribute('data-editing-id', item ? item.id : '');
            modal.classList.add('is-open');
        }

        iconoSelect.addEventListener('change', function () {
            iconoPreview.className = iconoSelect.value;
        });

        addBtn.addEventListener('click', function () {
            if (items.length >= MAX_VALORES) {
                window.alert('Ya alcanzaste el limite de ' + MAX_VALORES + ' valores. Elimina alguno antes de agregar otro.');
                return;
            }
            openModal(null);
        });
        document.getElementById('nosValModalClose').addEventListener('click', closeModal);
        document.getElementById('nosValModalCancel').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

        function updateCounter() {
            counter.textContent = items.length + '/' + MAX_VALORES;
        }

        function renderRows() {
            body.innerHTML = items.map(function (v) {
                return '<tr>'
                    + '<td><i class="' + escapeHtml(v.icono_fa) + '" style="font-size:20px; color: var(--gtqc-blue-deep, #45629C);"></i></td>'
                    + '<td><strong>' + escapeHtml(v.nombre) + '</strong></td>'
                    + '<td class="text-right">'
                    + '<button type="button" class="btn btn-sm btn-outline-secondary" data-nosval-edit="' + v.id + '"><i class="fas fa-pencil-alt"></i></button> '
                    + '<button type="button" class="btn btn-sm btn-outline-danger" data-nosval-delete="' + v.id + '"><i class="fas fa-trash-alt"></i></button>'
                    + '</td></tr>';
            }).join('');
            updateCounter();
        }

        body.addEventListener('click', function (ev) {
            var editBtn = ev.target.closest('[data-nosval-edit]');
            if (editBtn) {
                var id = editBtn.getAttribute('data-nosval-edit');
                var item = items.find(function (v) { return String(v.id) === id; });
                if (item) openModal(item);
                return;
            }
            var delBtn = ev.target.closest('[data-nosval-delete]');
            if (delBtn) {
                var delId = delBtn.getAttribute('data-nosval-delete');
                if (!window.confirm('¿Eliminar este valor? Esta accion no se puede deshacer.')) return;
                authFetch(window.API_BASE + '/api/nosotros_valores?id=' + encodeURIComponent(delId), { method: 'DELETE' })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) return;
                        items = items.filter(function (v) { return String(v.id) !== delId; });
                        renderRows();
                    })
                    .catch(function () {});
            }
        });

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var editingId = form.getAttribute('data-editing-id');
            var payload = {
                nombre: document.getElementById('nosValField_nombre').value.trim(),
                icono_fa: iconoSelect.value
            };
            if (!payload.nombre) return;

            var request = editingId
                ? authFetch(window.API_BASE + '/api/nosotros_valores?id=' + encodeURIComponent(editingId), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                : authFetch(window.API_BASE + '/api/nosotros_valores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

            request.then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) {
                        window.alert(result.message || 'No se pudo guardar el valor.');
                        return;
                    }
                    if (editingId) {
                        var idx = items.findIndex(function (v) { return String(v.id) === editingId; });
                        if (idx !== -1) items[idx] = result.valor;
                    } else {
                        items.push(result.valor);
                    }
                    renderRows();
                    closeModal();
                })
                .catch(function () {});
        });

        fetch(window.API_BASE + '/api/nosotros_valores')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                items = data;
                renderRows();
            })
            .catch(function () {});
    })();

    // ---- Staff tecnico (nosotros_staff) ----
    (function () {
        var body = document.getElementById('nosStaff-body');
        if (!body) return;

        var empty = document.getElementById('nosStaff-empty');
        var table = document.getElementById('nosStaff-table');
        var addBtn = document.getElementById('nosStaff-add-btn');
        var modal = document.getElementById('nosStaffModal');
        var form = document.getElementById('nosStaffModalForm');
        var fileInput = document.getElementById('nosStaffField_imagenFile');
        var preview = document.getElementById('nosStaffField_imagenPreview');
        var urlInput = document.getElementById('nosStaffField_imagen');
        var errorEl = document.getElementById('nosStaffField_imagenError');
        var items = [];

        function closeModal() { modal.classList.remove('is-open'); }
        function openModal(item) {
            form.reset();
            errorEl.style.display = 'none';
            document.getElementById('nosStaffModalTitle').textContent = item ? 'Editar integrante' : 'Nuevo integrante';
            document.getElementById('nosStaffField_nombre').value = item ? item.nombre : '';
            document.getElementById('nosStaffField_cargo').value = item ? item.cargo : '';
            document.getElementById('nosStaffField_descripcion').value = item ? item.descripcion : '';
            urlInput.value = item ? item.imagen : '';
            preview.src = (item && item.imagen) ? item.imagen : 'https://placehold.co/120x120/f1f5f9/94a3b8?text=Foto';
            form.setAttribute('data-editing-id', item ? item.id : '');
            modal.classList.add('is-open');
        }

        addBtn.addEventListener('click', function () { openModal(null); });
        document.getElementById('nosStaffModalClose').addEventListener('click', closeModal);
        document.getElementById('nosStaffModalCancel').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

        function renderRows() {
            if (!items.length) {
                empty.style.display = 'block';
                table.style.display = 'none';
            } else {
                empty.style.display = 'none';
                table.style.display = '';
            }
            body.innerHTML = items.map(function (p) {
                return '<tr>'
                    + '<td><img class="thumb-admin" src="' + escapeHtml(p.imagen) + '" alt="' + escapeHtml(p.nombre) + '" style="border-radius:50%;"></td>'
                    + '<td><strong>' + escapeHtml(p.nombre) + '</strong></td>'
                    + '<td>' + escapeHtml(p.cargo) + '</td>'
                    + '<td class="text-right">'
                    + '<button type="button" class="btn btn-sm btn-outline-secondary" data-nosstaff-edit="' + p.id + '"><i class="fas fa-pencil-alt"></i></button> '
                    + '<button type="button" class="btn btn-sm btn-outline-danger" data-nosstaff-delete="' + p.id + '"><i class="fas fa-trash-alt"></i></button>'
                    + '</td></tr>';
            }).join('');
        }

        body.addEventListener('click', function (ev) {
            var editBtn = ev.target.closest('[data-nosstaff-edit]');
            if (editBtn) {
                var id = editBtn.getAttribute('data-nosstaff-edit');
                var item = items.find(function (p) { return String(p.id) === id; });
                if (item) openModal(item);
                return;
            }
            var delBtn = ev.target.closest('[data-nosstaff-delete]');
            if (delBtn) {
                var delId = delBtn.getAttribute('data-nosstaff-delete');
                if (!window.confirm('¿Eliminar este integrante? Esta accion no se puede deshacer.')) return;
                authFetch(window.API_BASE + '/api/nosotros_staff?id=' + encodeURIComponent(delId), { method: 'DELETE' })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) return;
                        items = items.filter(function (p) { return String(p.id) !== delId; });
                        renderRows();
                    })
                    .catch(function () {});
            }
        });

        fileInput.addEventListener('change', function () {
            errorEl.style.display = 'none';
            var file = fileInput.files && fileInput.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                errorEl.textContent = 'El archivo supera el limite de 10MB.';
                errorEl.style.display = 'block';
                fileInput.value = '';
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) { preview.src = e.target.result; };
            reader.readAsDataURL(file);
        });

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var editingId = form.getAttribute('data-editing-id');
            var file = fileInput.files && fileInput.files[0];

            var uploadPromise = Promise.resolve();
            if (file) {
                var fd = new FormData();
                fd.append('file', file);
                fd.append('tabla', 'nosotros_staff');
                fd.append('anterior', urlInput.value || '');
                uploadPromise = authFetch(window.API_BASE + '/api/upload', { method: 'POST', body: fd })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) {
                            errorEl.textContent = result.message || 'No se pudo subir la foto.';
                            errorEl.style.display = 'block';
                            return Promise.reject(new Error('upload-failed'));
                        }
                        urlInput.value = result.url;
                    });
            }

            uploadPromise.then(function () {
                var payload = {
                    nombre: document.getElementById('nosStaffField_nombre').value.trim(),
                    cargo: document.getElementById('nosStaffField_cargo').value.trim(),
                    descripcion: document.getElementById('nosStaffField_descripcion').value.trim(),
                    imagen: urlInput.value
                };
                if (!payload.nombre || !payload.cargo) return;

                var request = editingId
                    ? authFetch(window.API_BASE + '/api/nosotros_staff?id=' + encodeURIComponent(editingId), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                    : authFetch(window.API_BASE + '/api/nosotros_staff', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                return request.then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) {
                            errorEl.textContent = result.message || 'No se pudo guardar el integrante.';
                            errorEl.style.display = 'block';
                            return;
                        }
                        if (editingId) {
                            var idx = items.findIndex(function (p) { return String(p.id) === editingId; });
                            if (idx !== -1) items[idx] = result.staff;
                        } else {
                            items.push(result.staff);
                        }
                        renderRows();
                        closeModal();
                    });
            }).catch(function () {});
        });

        fetch(window.API_BASE + '/api/nosotros_staff')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                items = data;
                renderRows();
            })
            .catch(function () {
                empty.style.display = 'block';
                table.style.display = 'none';
            });
    })();
})();
