(function () {
    var body = document.getElementById('inicio-hero-body');
    var empty = document.getElementById('inicio-hero-empty');
    var table = document.getElementById('inicio-hero-table');
    var MAX_DESTACADOS = 4;

    if (!body) return;

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function countDestacados() {
        return Array.prototype.slice.call(body.querySelectorAll('[data-destacado-toggle]'))
            .filter(function (el) { return el.checked; }).length;
    }

    function toggleDestacado(servicio, checked, rowEl) {
        var payload = {
            titulo: servicio.titulo,
            resumen: servicio.resumen || '',
            imagen: servicio.imagen || '',
            destacado: checked
        };
        fetch('api/servicios?id=' + encodeURIComponent(servicio.id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
                if (result.ok && result.servicio) {
                    servicio.destacado = result.servicio.destacado;
                    servicio.resumen = result.servicio.resumen;
                    servicio.imagen = result.servicio.imagen;
                }
            })
            .catch(function () {});
    }

    fetch('api/servicios')
        .then(function (res) { return res.json(); })
        .then(function (servicios) {
            if (!servicios.length) {
                empty.style.display = 'block';
                table.style.display = 'none';
                return;
            }

            servicios.sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });

            body.innerHTML = servicios.map(function (s) {
                var estado = s.estado === 'draft' ? 'draft' : 'published';
                var badgeClass = estado === 'published' ? 'badge-success' : 'badge-secondary';
                var checked = Number(s.destacado) === 1 ? 'checked' : '';
                return '<tr>'
                    + '<td><img class="thumb-admin" src="' + escapeHtml(s.imagen) + '" alt="' + escapeHtml(s.titulo) + '"></td>'
                    + '<td><strong>' + escapeHtml(s.titulo) + '</strong></td>'
                    + '<td><span class="badge ' + badgeClass + '">' + estado + '</span></td>'
                    + '<td class="text-right">'
                    + '<label class="pb-switch">'
                    + '<input type="checkbox" data-destacado-toggle="" data-id="' + s.id + '" ' + checked + '>'
                    + '<span class="pb-switch__slider"></span>'
                    + '</label>'
                    + '</td>'
                    + '</tr>';
            }).join('');

            body.addEventListener('change', function (ev) {
                var toggle = ev.target.closest('[data-destacado-toggle]');
                if (!toggle) return;

                if (toggle.checked && countDestacados() > MAX_DESTACADOS) {
                    toggle.checked = false;
                    window.alert('Solo puedes destacar hasta ' + MAX_DESTACADOS + ' servicios en el carrusel de inicio.');
                    return;
                }

                var id = toggle.getAttribute('data-id');
                var servicio = servicios.find(function (s) { return String(s.id) === id; });
                if (servicio) toggleDestacado(servicio, toggle.checked, toggle.closest('tr'));
            });
        })
        .catch(function () {
            empty.style.display = 'block';
            table.style.display = 'none';
        });
})();

(function () {
    var body = document.getElementById('stat-body');
    if (!body) return;

    var modal = document.getElementById('statModal');
    var form = document.getElementById('statModalForm');
    var items = [];

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function closeModal() { modal.classList.remove('is-open'); }
    function openModal(item) {
        form.reset();
        document.getElementById('statField_valor').value = item.valor || '';
        document.getElementById('statField_etiqueta').value = item.etiqueta || '';
        form.setAttribute('data-editing-id', item.id);
        modal.classList.add('is-open');
    }

    document.getElementById('statModalClose').addEventListener('click', closeModal);
    document.getElementById('statModalCancel').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    function renderRows() {
        body.innerHTML = items.map(function (e) {
            return '<tr>'
                + '<td><strong>' + escapeHtml(e.valor) + '</strong></td>'
                + '<td>' + escapeHtml(e.etiqueta) + '</td>'
                + '<td class="text-right"><button type="button" class="btn btn-sm btn-outline-secondary" data-stat-edit="' + e.id + '"><i class="fas fa-pencil-alt"></i> Editar</button></td>'
                + '</tr>';
        }).join('');
    }

    body.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-stat-edit]');
        if (!btn) return;
        var id = btn.getAttribute('data-stat-edit');
        var item = items.find(function (e) { return String(e.id) === id; });
        if (item) openModal(item);
    });

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var editingId = form.getAttribute('data-editing-id');
        var payload = {
            valor: document.getElementById('statField_valor').value.trim(),
            etiqueta: document.getElementById('statField_etiqueta').value.trim()
        };
        if (!payload.valor || !payload.etiqueta) return;

        fetch('api/estadisticas?id=' + encodeURIComponent(editingId), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
                if (!result.ok) return;
                var idx = items.findIndex(function (e) { return String(e.id) === editingId; });
                if (idx !== -1) items[idx] = result.estadistica;
                renderRows();
                closeModal();
            })
            .catch(function () {});
    });

    fetch('api/estadisticas')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            items = data;
            renderRows();
        })
        .catch(function () {});
})();

(function () {
    var body = document.getElementById('cred-body');
    if (!body) return;

    var modal = document.getElementById('credModal');
    var form = document.getElementById('credModalForm');
    var fileInput = document.getElementById('credField_archivoFile');
    var urlInput = document.getElementById('credField_archivo_url');
    var tipoInput = document.getElementById('credField_archivo_tipo');
    var actualLink = document.getElementById('credField_archivoActual');
    var errorEl = document.getElementById('credField_archivoError');
    var items = [];

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function closeModal() { modal.classList.remove('is-open'); }
    function openModal(item) {
        form.reset();
        errorEl.style.display = 'none';
        document.getElementById('credField_titulo').value = item.titulo || '';
        document.getElementById('credField_descripcion').value = item.descripcion || '';
        var descQuill = window.__quillFields && window.__quillFields['credField_descripcion'];
        if (descQuill) descQuill.root.innerHTML = item.descripcion || '';
        urlInput.value = item.archivo_url || '';
        tipoInput.value = item.archivo_tipo || '';
        form.setAttribute('data-editing-id', item.id);
        if (item.archivo_url) {
            actualLink.href = item.archivo_url;
            actualLink.textContent = 'Ver archivo actual (' + (item.archivo_tipo || 'archivo') + ')';
        } else {
            actualLink.removeAttribute('href');
            actualLink.textContent = 'Sin archivo cargado';
        }
        modal.classList.add('is-open');
    }

    document.getElementById('credModalClose').addEventListener('click', closeModal);
    document.getElementById('credModalCancel').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    function renderRows() {
        body.innerHTML = items.map(function (a) {
            var archivoBadge = a.archivo_url
                ? '<a href="' + a.archivo_url + '" target="_blank" rel="noopener" class="badge badge-success">' + (a.archivo_tipo === 'pdf' ? 'PDF' : 'Imagen') + '</a>'
                : '<span class="badge badge-secondary">Sin archivo</span>';
            return '<tr>'
                + '<td><strong>' + escapeHtml(a.titulo) + '</strong></td>'
                + '<td style="max-width:340px; font-size:12px; color:var(--admin-text-secondary);">' + escapeHtml(a.descripcion) + '</td>'
                + '<td>' + archivoBadge + '</td>'
                + '<td class="text-right"><button type="button" class="btn btn-sm btn-outline-secondary" data-cred-edit="' + a.id + '"><i class="fas fa-pencil-alt"></i> Editar</button></td>'
                + '</tr>';
        }).join('');
    }

    body.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-cred-edit]');
        if (!btn) return;
        var id = btn.getAttribute('data-cred-edit');
        var item = items.find(function (a) { return String(a.id) === id; });
        if (item) openModal(item);
    });

    fileInput.addEventListener('change', function () {
        errorEl.style.display = 'none';
        var file = fileInput.files && fileInput.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            errorEl.textContent = 'El archivo supera el limite de 10MB.';
            errorEl.style.display = 'block';
            fileInput.value = '';
        }
    });

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var editingId = form.getAttribute('data-editing-id');
        var file = fileInput.files && fileInput.files[0];

        var uploadPromise = Promise.resolve();
        if (file) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('tabla', 'acreditaciones');
            fd.append('anterior', urlInput.value || '');
            uploadPromise = fetch('api/upload.php', { method: 'POST', body: fd })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) {
                        errorEl.textContent = result.message || 'No se pudo subir el archivo.';
                        errorEl.style.display = 'block';
                        return Promise.reject(new Error('upload-failed'));
                    }
                    urlInput.value = result.url;
                    tipoInput.value = result.tipo;
                });
        }

        uploadPromise.then(function () {
            var descField = document.getElementById('credField_descripcion');
            var descQuill = window.__quillFields && window.__quillFields['credField_descripcion'];
            if (descQuill) descField.value = descQuill.getText().trim() === '' ? '' : descQuill.root.innerHTML;

            var payload = {
                titulo: document.getElementById('credField_titulo').value.trim(),
                descripcion: descField.value.trim(),
                archivo_url: urlInput.value,
                archivo_tipo: tipoInput.value
            };
            return fetch('api/acreditaciones?id=' + encodeURIComponent(editingId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) return;
                    var idx = items.findIndex(function (a) { return String(a.id) === editingId; });
                    if (idx !== -1) items[idx] = result.acreditacion;
                    renderRows();
                    closeModal();
                });
        }).catch(function () {});
    });

    fetch('api/acreditaciones')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            items = data;
            renderRows();
        })
        .catch(function () {});
})();

(function () {
    var body = document.getElementById('cli-body');
    if (!body) return;

    var MAX_CLIENTES = 25;
    var empty = document.getElementById('cli-empty');
    var table = document.getElementById('cli-table');
    var counter = document.getElementById('cli-counter');
    var addBtn = document.getElementById('cli-add-btn');
    var modal = document.getElementById('cliModal');
    var form = document.getElementById('cliModalForm');
    var fileInput = document.getElementById('cliField_logoFile');
    var preview = document.getElementById('cliField_logoPreview');
    var urlInput = document.getElementById('cliField_logo_url');
    var errorEl = document.getElementById('cliField_logoError');
    var items = [];

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function closeModal() { modal.classList.remove('is-open'); }
    function openModal() {
        form.reset();
        errorEl.style.display = 'none';
        urlInput.value = '';
        preview.src = 'https://placehold.co/170x54/f1f5f9/94a3b8?text=Logo';
        modal.classList.add('is-open');
    }

    addBtn.addEventListener('click', function () {
        if (items.length >= MAX_CLIENTES) {
            window.alert('Ya alcanzaste el limite de ' + MAX_CLIENTES + ' clientes. Elimina alguno antes de agregar otro.');
            return;
        }
        openModal();
    });
    document.getElementById('cliModalClose').addEventListener('click', closeModal);
    document.getElementById('cliModalCancel').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    function updateCounter() {
        counter.textContent = items.length + '/' + MAX_CLIENTES;
    }

    function renderRows() {
        if (!items.length) {
            empty.style.display = 'block';
            table.style.display = 'none';
        } else {
            empty.style.display = 'none';
            table.style.display = '';
        }
        body.innerHTML = items.map(function (c) {
            return '<tr>'
                + '<td><img class="thumb-admin" src="' + escapeHtml(c.logo_url) + '" alt="' + escapeHtml(c.nombre) + '" style="background:#f1f5f9;"></td>'
                + '<td><strong>' + escapeHtml(c.nombre) + '</strong></td>'
                + '<td class="text-right"><button type="button" class="btn btn-sm btn-outline-danger" data-cli-delete="' + c.id + '"><i class="fas fa-trash-alt"></i></button></td>'
                + '</tr>';
        }).join('');
        updateCounter();
    }

    body.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-cli-delete]');
        if (!btn) return;
        var id = btn.getAttribute('data-cli-delete');
        if (!window.confirm('¿Eliminar este cliente? Esta accion no se puede deshacer.')) return;

        fetch('api/clientes?id=' + encodeURIComponent(id), { method: 'DELETE' })
            .then(function (res) { return res.json(); })
            .then(function (result) {
                if (!result.ok) return;
                items = items.filter(function (c) { return String(c.id) !== id; });
                renderRows();
            })
            .catch(function () {});
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
        var file = fileInput.files && fileInput.files[0];
        var nombre = document.getElementById('cliField_nombre').value.trim();
        if (!nombre) return;
        if (!file && !urlInput.value) {
            errorEl.textContent = 'Selecciona un logo.';
            errorEl.style.display = 'block';
            return;
        }

        var uploadPromise = Promise.resolve();
        if (file) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('tabla', 'clientes');
            uploadPromise = fetch('api/upload.php', { method: 'POST', body: fd })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) {
                        errorEl.textContent = result.message || 'No se pudo subir el logo.';
                        errorEl.style.display = 'block';
                        return Promise.reject(new Error('upload-failed'));
                    }
                    urlInput.value = result.url;
                });
        }

        uploadPromise.then(function () {
            return fetch('api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombre, logo_url: urlInput.value })
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (!result.ok) {
                        errorEl.textContent = result.message || 'No se pudo guardar el cliente.';
                        errorEl.style.display = 'block';
                        return;
                    }
                    items.push(result.cliente);
                    renderRows();
                    closeModal();
                });
        }).catch(function () {});
    });

    fetch('api/clientes')
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
