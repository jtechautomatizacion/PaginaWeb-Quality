(function () {
    function resolveApiUrl(url) {
        if (!url || /^https?:\/\//i.test(url)) return url;
        return window.API_BASE + '/' + url.replace(/^\/+/, '');
    }
    window.resolveApiUrl = resolveApiUrl;

    if (document.body.classList.contains('admin-theme') && !localStorage.getItem('gtqc_token')) {
        window.location.href = 'index.html';
        return;
    }

    function authFetch(url, options) {
        options = options || {};
        var token = localStorage.getItem('gtqc_token');
        options.headers = Object.assign({}, options.headers, token ? { Authorization: 'Bearer ' + token } : {});
        return fetch(url, options).then(function (res) {
            if (res.status === 401) {
                localStorage.removeItem('gtqc_token');
                window.location.href = 'index.html';
            }
            return res;
        });
    }
    window.authFetch = authFetch;

    var toggle = document.querySelector('[data-sidebar-toggle]');
    var shell = document.querySelector('.admin-shell');
    if (toggle && shell) {
        if (window.matchMedia('(min-width: 992px)').matches && localStorage.getItem('adminSidebarCollapsed') === '1') {
            shell.classList.add('sidebar-collapsed');
        }
        var closeMobileSidebar = function () {
            shell.classList.remove('sidebar-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };
        toggle.addEventListener('click', function () {
            var isMobile = window.matchMedia('(max-width: 991.98px)').matches;
            if (isMobile) {
                var nowOpen = shell.classList.toggle('sidebar-open');
                toggle.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
                document.body.style.overflow = nowOpen ? 'hidden' : '';
            } else {
                shell.classList.toggle('sidebar-collapsed');
                localStorage.setItem('adminSidebarCollapsed', shell.classList.contains('sidebar-collapsed') ? '1' : '0');
            }
        });
        shell.addEventListener('click', function (ev) {
            if (!shell.classList.contains('sidebar-open')) return;
            if (ev.target === shell) closeMobileSidebar();
        });
        document.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape' && shell.classList.contains('sidebar-open')) closeMobileSidebar();
        });
    }

    var userBtn = document.querySelector('[data-user-toggle]');
    var dropdown = document.querySelector('[data-user-dropdown]');
    if (userBtn && dropdown) {
        userBtn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            dropdown.classList.toggle('is-open');
            userBtn.setAttribute('aria-expanded', dropdown.classList.contains('is-open') ? 'true' : 'false');
        });
        document.addEventListener('click', function (ev) {
            if (!dropdown.contains(ev.target) && !userBtn.contains(ev.target)) {
                dropdown.classList.remove('is-open');
                userBtn.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                dropdown.classList.remove('is-open');
                userBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function getImageUrl(imagenPath) {
        if (!imagenPath) return 'https://placehold.co/200x150/e9edf5/e9edf5';
        if (/^https?:\/\//.test(imagenPath)) return imagenPath;
        return 'https://api.grouptqualityc.com.pe' + (imagenPath.startsWith('/') ? imagenPath : '/' + imagenPath);
    }

    function renderAdminRow(item, viewBase) {
        var estado = item.estado === 'draft' ? 'draft' : 'published';
        var badgeClass = estado === 'published' ? 'badge-success' : 'badge-secondary';
        var displayDate = item.fecha_admin || item.fecha || '';
        var searchBlob = (item.titulo + ' ' + item.resumen + ' ' + item.slug).toLowerCase();
        var tr = document.createElement('tr');
        tr.setAttribute('data-item', '');
        tr.setAttribute('data-id', String(item.id));
        tr.setAttribute('data-item-json', JSON.stringify(item));
        tr.setAttribute('data-search', searchBlob);
        tr.setAttribute('data-status', estado);
        tr.setAttribute('data-date', item.fecha || '');
        tr.setAttribute('data-timestamp', String(item.timestamp || 0));
        tr.setAttribute('data-title', item.titulo.toLowerCase());
        tr.innerHTML = '<td><img class="thumb-admin" src="' + escapeHtml(getImageUrl(item.imagen)) + '" alt="' + escapeHtml(item.titulo) + '"></td>'
            + '<td><strong>' + escapeHtml(item.titulo) + '</strong><div class="text-muted" style="font-size:12px;">' + escapeHtml(item.resumen) + '</div></td>'
            + '<td><span class="badge ' + badgeClass + '">' + estado + '</span></td>'
            + '<td style="white-space:nowrap;">' + escapeHtml(displayDate) + '</td>'
            + '<td><code style="font-size:11px;">' + escapeHtml(item.slug) + '</code></td>'
            + '<td class="text-right admin-row-actions" style="white-space:nowrap;">'
            + '<button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" title="Editar"><i class="fas fa-pencil-alt"></i></button> '
            + '<button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" title="Eliminar"><i class="fas fa-trash-alt"></i></button>'
            + '</td>';
        return tr;
    }

    function initAdminFilters() {
        var filtersRoot = document.querySelector('[data-admin-filters]');
        if (!filtersRoot) return;

        var body = document.querySelector('[data-list-body]');
        var rows = Array.prototype.slice.call(document.querySelectorAll('[data-item]'));
        var searchInput = filtersRoot.querySelector('[data-filter-search]');
        var statusSelect = filtersRoot.querySelector('[data-filter-status]');
        var rangeSelect = filtersRoot.querySelector('[data-filter-range]');
        var sortSelect = filtersRoot.querySelector('[data-filter-sort]');
        var resetBtn = filtersRoot.querySelector('[data-filter-reset]');
        var chips = document.querySelectorAll('[data-chip]');
        var resultsInfo = document.querySelector('[data-results-info]');
        var emptyEl = document.querySelector('[data-empty-filter]');
        var table = document.getElementById('admin-list-table');
        var totalAll = rows.length;
        var activeChip = 'all';

        var apply = function () {
            var q = (searchInput.value || '').toLowerCase().trim();
            var status = statusSelect.value;
            var days = parseInt(rangeSelect.value || '0', 10);
            var cutoff = days > 0 ? (Date.now() / 1000) - (days * 86400) : 0;

            if (activeChip !== 'all') { status = activeChip; statusSelect.value = activeChip; }

            var visible = 0;
            rows.forEach(function (row) {
                var s = row.getAttribute('data-search');
                var st = row.getAttribute('data-status');
                var ts = parseInt(row.getAttribute('data-timestamp') || '0', 10);
                var passSearch = q === '' || s.indexOf(q) !== -1;
                var passStatus = !status || st === status;
                var passDate = cutoff === 0 || ts >= cutoff;
                var ok = passSearch && passStatus && passDate;
                row.style.display = ok ? '' : 'none';
                if (ok) visible++;
            });

            sortRows();

            resultsInfo.innerHTML = 'Mostrando <strong>' + visible + '</strong> de <strong>' + totalAll + '</strong> registros.';
            if (visible === 0 && totalAll > 0) {
                emptyEl.style.display = 'block';
                table.style.display = 'none';
            } else {
                emptyEl.style.display = 'none';
                table.style.display = '';
            }
        };

        var sortRows = function () {
            var sortKey = sortSelect.value;
            var visibleRows = rows.filter(function (r) { return r.style.display !== 'none'; });
            visibleRows.sort(function (a, b) {
                if (sortKey === 'title-asc') return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
                if (sortKey === 'title-desc') return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
                var tsA = parseInt(a.getAttribute('data-timestamp') || '0', 10);
                var tsB = parseInt(b.getAttribute('data-timestamp') || '0', 10);
                return sortKey === 'date-asc' ? tsA - tsB : tsB - tsA;
            });
            visibleRows.forEach(function (r) { body.appendChild(r); });
        };

        [searchInput, statusSelect, rangeSelect, sortSelect].forEach(function (el) {
            el.addEventListener('input', apply);
            el.addEventListener('change', apply);
        });

        resetBtn.addEventListener('click', function () {
            searchInput.value = '';
            statusSelect.value = '';
            rangeSelect.value = '';
            sortSelect.value = 'date-desc';
            activeChip = 'all';
            chips.forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-chip') === 'all'); });
            apply();
        });

        chips.forEach(function (c) {
            c.addEventListener('click', function () {
                activeChip = c.getAttribute('data-chip');
                chips.forEach(function (x) { x.classList.remove('is-active'); });
                c.classList.add('is-active');
                if (activeChip === 'all') statusSelect.value = '';
                apply();
            });
        });

        document.querySelectorAll('th[data-sort]').forEach(function (th) {
            th.addEventListener('click', function () {
                var key = th.getAttribute('data-sort');
                var isAsc = th.classList.contains('sort-asc');
                document.querySelectorAll('th[data-sort]').forEach(function (t) {
                    t.classList.remove('sort-asc', 'sort-desc');
                });
                if (key === 'title') {
                    sortSelect.value = isAsc ? 'title-desc' : 'title-asc';
                    th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
                } else if (key === 'date') {
                    sortSelect.value = isAsc ? 'date-desc' : 'date-asc';
                    th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
                } else if (key === 'status') {
                    rows.sort(function (a, b) {
                        var sa = a.getAttribute('data-status');
                        var sb = b.getAttribute('data-status');
                        return isAsc ? sb.localeCompare(sa) : sa.localeCompare(sb);
                    });
                    rows.forEach(function (r) { body.appendChild(r); });
                    th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
                    return;
                }
                apply();
            });
        });

        apply();
    }

    function updateChipCounts(items) {
        var total = items.length;
        var published = items.filter(function (i) { return i.estado !== 'draft'; }).length;
        var draft = total - published;
        var allChip = document.querySelector('[data-chip="all"] .admin-chip__count');
        var pubChip = document.querySelector('[data-chip="published"] .admin-chip__count');
        var draftChip = document.querySelector('[data-chip="draft"] .admin-chip__count');
        if (allChip) allChip.textContent = String(total);
        if (pubChip) pubChip.textContent = String(published);
        if (draftChip) draftChip.textContent = String(draft);
    }

    var listBody = document.querySelector('[data-list-body]');
    if (listBody && listBody.hasAttribute('data-api')) {
        var apiUrl = resolveApiUrl(listBody.getAttribute('data-api'));
        var viewBase = listBody.getAttribute('data-view-base') || '';

        fetch(apiUrl)
            .then(function (res) { return res.json(); })
            .then(function (items) {
                items.sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
                listBody.innerHTML = '';
                items.forEach(function (item) { listBody.appendChild(renderAdminRow(item, viewBase)); });
                updateChipCounts(items);
                initAdminFilters();
            })
            .catch(function () { initAdminFilters(); });
    } else {
        initAdminFilters();
    }

    var pbModal = document.getElementById('pbModal');
    if (pbModal) {
        window.pbOpenCreate = function () {
            document.getElementById('pbModalTitle').textContent = 'Nueva pagina';
            document.getElementById('pbModalForm').action = '/admin/pages/create';
            document.getElementById('pbField_title').value = '';
            document.getElementById('pbField_slug').value = '';
            document.getElementById('pbField_nav_label').value = '';
            document.getElementById('pbField_menu_location').value = 'header';
            document.getElementById('pbField_parent_slug').value = '';
            document.getElementById('pbField_menu_order').value = '100';
            document.getElementById('pbField_slug').readOnly = false;
            document.getElementById('pbFieldSlugWrap').style.display = '';
            pbModal.classList.add('is-open');
        };
        window.pbOpenMeta = function (page) {
            document.getElementById('pbModalTitle').textContent = 'Ajustes: ' + page.title;
            document.getElementById('pbModalForm').action = '/admin/pages/' + page.slug + '/meta';
            document.getElementById('pbField_title').value = page.title || '';
            document.getElementById('pbField_slug').value = page.slug || '';
            document.getElementById('pbField_slug').readOnly = true;
            document.getElementById('pbFieldSlugWrap').style.display = '';
            document.getElementById('pbField_nav_label').value = page.nav_label || '';
            document.getElementById('pbField_menu_location').value = page.menu_location || 'none';
            document.getElementById('pbField_parent_slug').value = page.parent_slug || '';
            document.getElementById('pbField_menu_order').value = page.menu_order != null ? page.menu_order : 0;
            pbModal.classList.add('is-open');
        };
        window.pbCloseModal = function () { pbModal.classList.remove('is-open'); };
        pbModal.addEventListener('click', function (e) { if (e.target === pbModal) window.pbCloseModal(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window.pbCloseModal(); });
    }

    function dmyToIso(dmy) {
        var parts = (dmy || '').split('/');
        return parts.length === 3 ? parts[2] + '-' + parts[1] + '-' + parts[0] : '';
    }

    function isoToDmy(iso) {
        var parts = (iso || '').split('-');
        return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : '';
    }

    function wireCreateModal(config) {
        var modal = document.getElementById(config.modalId);
        if (!modal) return;
        var form = document.getElementById(config.formId);
        var modalTitleEl = modal.querySelector('.pb-modal__title');
        var modalTitleDefault = modalTitleEl ? modalTitleEl.textContent : '';

        function updateImagePreview() {
            if (!config.imageUpload) return;
            var urlInput = document.getElementById(config.imageUpload.urlFieldId);
            var preview = document.getElementById(config.imageUpload.previewId);
            if (preview) preview.src = (urlInput && urlInput.value) ? urlInput.value : config.imageUpload.placeholder;
        }

        function setQuillValue(fieldId, html) {
            var quill = window.__quillFields && window.__quillFields[fieldId];
            if (quill) quill.root.innerHTML = html || '';
        }

        window[config.openFn] = function (item) {
            form.reset();
            if (item && item.id != null) {
                form.setAttribute('data-editing-id', String(item.id));
                config.fields.forEach(function (f) {
                    var el = document.getElementById(f.id);
                    var value = item[f.key] != null ? item[f.key] : '';
                    if (el) el.value = value;
                    setQuillValue(f.id, value);
                });
                if (config.checkboxFields) {
                    config.checkboxFields.forEach(function (f) {
                        var el = document.getElementById(f.id);
                        if (el) el.checked = !!Number(item[f.key]);
                    });
                }
                if (config.customFields && config.customFields.onLoad) config.customFields.onLoad(item);
                if (modalTitleEl) modalTitleEl.textContent = 'Editar: ' + item.titulo;
            } else {
                form.removeAttribute('data-editing-id');
                config.fields.forEach(function (f) { setQuillValue(f.id, ''); });
                if (config.customFields && config.customFields.onReset) config.customFields.onReset();
                if (modalTitleEl) modalTitleEl.textContent = modalTitleDefault;
            }
            updateImagePreview();
            modal.classList.add('is-open');
        };
        window[config.closeFn] = function () {
            modal.classList.remove('is-open');
            form.removeAttribute('data-editing-id');
            if (modalTitleEl) modalTitleEl.textContent = modalTitleDefault;
        };
        modal.addEventListener('click', function (e) { if (e.target === modal) window[config.closeFn](); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') window[config.closeFn](); });

        if (config.imageUpload) {
            var fileInput = document.getElementById(config.imageUpload.fileInputId);
            var uploadError = document.getElementById(config.imageUpload.errorId);
            if (fileInput) {
                fileInput.addEventListener('change', function () {
                    if (uploadError) uploadError.style.display = 'none';
                    var file = fileInput.files && fileInput.files[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                        if (uploadError) { uploadError.textContent = 'El archivo supera el limite de 10MB.'; uploadError.style.display = 'block'; }
                        fileInput.value = '';
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var preview = document.getElementById(config.imageUpload.previewId);
                        if (preview) preview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();

            var uploadPromise = Promise.resolve();
            if (config.imageUpload) {
                var fileInputEl = document.getElementById(config.imageUpload.fileInputId);
                var urlInputEl = document.getElementById(config.imageUpload.urlFieldId);
                var selectedFile = fileInputEl && fileInputEl.files && fileInputEl.files[0];
                if (selectedFile) {
                    var fd = new FormData();
                    fd.append('file', selectedFile);
                    fd.append('tabla', config.imageUpload.tabla);
                    fd.append('anterior', urlInputEl ? urlInputEl.value : '');
                    uploadPromise = authFetch(window.API_BASE + '/api/upload', { method: 'POST', body: fd })
                        .then(function (res) { return res.json(); })
                        .then(function (result) {
                            if (result.ok && urlInputEl) {
                                urlInputEl.value = result.url;
                            } else {
                                var uploadErrorEl = document.getElementById(config.imageUpload.errorId);
                                if (uploadErrorEl) { uploadErrorEl.textContent = result.message || 'No se pudo subir la imagen.'; uploadErrorEl.style.display = 'block'; }
                                return Promise.reject(new Error('upload-failed'));
                            }
                        });
                }
            }

            uploadPromise.then(function () {
                var payload = {};
                config.fields.forEach(function (f) {
                    var quill = window.__quillFields && window.__quillFields[f.id];
                    var el = document.getElementById(f.id);
                    if (quill && el) el.value = quill.getText().trim() === '' ? '' : quill.root.innerHTML;
                    payload[f.key] = el ? el.value.trim() : '';
                });
                if (config.checkboxFields) {
                    config.checkboxFields.forEach(function (f) {
                        var el = document.getElementById(f.id);
                        payload[f.key] = !!(el && el.checked);
                    });
                }
                if (config.customFields && config.customFields.onSubmit) config.customFields.onSubmit(payload);
                if (!payload.titulo) return;

                var editingId = form.getAttribute('data-editing-id');
                var url = editingId ? config.apiUrl + '?id=' + encodeURIComponent(editingId) : config.apiUrl;
                var method = editingId ? 'PUT' : 'POST';

                return authFetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                    .then(function (res) { return res.json(); })
                    .then(function (result) {
                        if (!result.ok) return;
                        var item = result[config.responseKey];
                        var body = document.querySelector('[data-list-body]');
                        if (body) {
                            var newRow = renderAdminRow(item, config.viewBase);
                            var existingRow = editingId ? body.querySelector('[data-id="' + editingId + '"]') : null;
                            if (existingRow) {
                                existingRow.replaceWith(newRow);
                            } else {
                                body.insertBefore(newRow, body.firstChild);
                            }
                        }
                        updateChipCounts(Array.prototype.slice.call(document.querySelectorAll('[data-item]')).map(function (r) {
                            return { estado: r.getAttribute('data-status') };
                        }));
                        window[config.closeFn]();
                    });
            }).catch(function () {});
        });

        var listBody = document.querySelector('[data-list-body]');
        if (listBody) {
            listBody.addEventListener('click', function (ev) {
                var editBtn = ev.target.closest('[data-action="edit"]');
                if (editBtn) {
                    var editRow = editBtn.closest('[data-item]');
                    var item = {};
                    try { item = JSON.parse(editRow.getAttribute('data-item-json') || '{}'); } catch (e) {}
                    window[config.openFn](item);
                    return;
                }

                var delBtn = ev.target.closest('[data-action="delete"]');
                if (delBtn) {
                    var delRow = delBtn.closest('[data-item]');
                    var id = delRow.getAttribute('data-id');
                    if (!id) return;
                    if (!window.confirm('¿Eliminar este registro? Esta accion no se puede deshacer.')) return;

                    authFetch(config.apiUrl + '?id=' + encodeURIComponent(id), { method: 'DELETE' })
                        .then(function (res) { return res.json(); })
                        .then(function (result) {
                            if (!result.ok) return;
                            delRow.remove();
                            var remaining = Array.prototype.slice.call(document.querySelectorAll('[data-item]'));
                            updateChipCounts(remaining.map(function (r) { return { estado: r.getAttribute('data-status') }; }));
                            var resultsInfo = document.querySelector('[data-results-info]');
                            if (resultsInfo) {
                                var visible = remaining.filter(function (r) { return r.style.display !== 'none'; }).length;
                                resultsInfo.innerHTML = 'Mostrando <strong>' + visible + '</strong> de <strong>' + remaining.length + '</strong> registros.';
                            }
                        })
                        .catch(function () {});
                }
            });
        }
    }

    function wireSimpleImageUpload(fileInputId, hiddenInputId, previewId, errorId, tabla) {
        var fileInput = document.getElementById(fileInputId);
        var hiddenInput = document.getElementById(hiddenInputId);
        var preview = document.getElementById(previewId);
        var errorEl = document.getElementById(errorId);
        if (!fileInput || !hiddenInput) return;
        fileInput.addEventListener('change', function () {
            if (errorEl) errorEl.style.display = 'none';
            var file = fileInput.files && fileInput.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                if (errorEl) { errorEl.textContent = 'El archivo supera el limite de 10MB.'; errorEl.style.display = 'block'; }
                fileInput.value = '';
                return;
            }
            var fd = new FormData();
            fd.append('file', file);
            fd.append('tabla', tabla);
            fd.append('anterior', hiddenInput.value || '');
            authFetch(window.API_BASE + '/api/upload', { method: 'POST', body: fd })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (result.ok) {
                        hiddenInput.value = result.url;
                        if (preview) preview.src = result.url;
                    } else if (errorEl) {
                        errorEl.textContent = result.message || 'No se pudo subir la imagen.';
                        errorEl.style.display = 'block';
                    }
                })
                .catch(function () {
                    if (errorEl) { errorEl.textContent = 'No se pudo subir la imagen.'; errorEl.style.display = 'block'; }
                });
        });
    }

    var GALERIA_PLACEHOLDER = 'https://placehold.co/160x120/e9edf5/e9edf5';

    function svcGaleriaRow(data) {
        data = data || {};
        var row = document.createElement('div');
        row.className = 'pb-gallery-item';
        row.setAttribute('data-gallery-item', '');
        row.innerHTML = '<img class="pb-gallery-item__preview" data-gallery-preview src="' + escapeHtml(data.imagen || GALERIA_PLACEHOLDER) + '" alt="Vista previa">'
            + '<div class="pb-gallery-item__fields">'
            + '<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" data-gallery-file>'
            + '<input type="text" placeholder="Titulo del ensayo" data-gallery-titulo value="' + escapeHtml(data.titulo) + '">'
            + '<input type="text" placeholder="Norma (ej. NTP 339.035)" data-gallery-norma value="' + escapeHtml(data.norma) + '">'
            + '<input type="hidden" data-gallery-imagen value="' + escapeHtml(data.imagen) + '">'
            + '</div>'
            + '<button type="button" class="pb-gallery-item__remove" data-gallery-remove title="Quitar"><i class="fas fa-times"></i></button>';

        var fileInput = row.querySelector('[data-gallery-file]');
        var preview = row.querySelector('[data-gallery-preview]');
        var hiddenUrl = row.querySelector('[data-gallery-imagen]');
        fileInput.addEventListener('change', function () {
            var file = fileInput.files && fileInput.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) { window.alert('El archivo supera el limite de 10MB.'); fileInput.value = ''; return; }
            var fd = new FormData();
            fd.append('file', file);
            fd.append('tabla', 'servicios');
            fd.append('anterior', hiddenUrl.value || '');
            authFetch(window.API_BASE + '/api/upload', { method: 'POST', body: fd })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (result.ok) {
                        hiddenUrl.value = result.url;
                        preview.src = result.url;
                    } else {
                        window.alert(result.message || 'No se pudo subir la imagen.');
                    }
                })
                .catch(function () { window.alert('No se pudo subir la imagen.'); });
        });

        row.querySelector('[data-gallery-remove]').addEventListener('click', function () { row.remove(); });

        return row;
    }

    window.svcGaleriaAdd = function () {
        var list = document.getElementById('svcField_galeriaList');
        if (list) list.appendChild(svcGaleriaRow());
    };

    function svcGaleriaLoad(items) {
        var list = document.getElementById('svcField_galeriaList');
        if (!list) return;
        list.innerHTML = '';
        (items || []).forEach(function (it) { list.appendChild(svcGaleriaRow(it)); });
    }

    function svcGaleriaCollect() {
        var list = document.getElementById('svcField_galeriaList');
        if (!list) return [];
        return Array.prototype.slice.call(list.querySelectorAll('[data-gallery-item]')).map(function (row) {
            return {
                imagen: row.querySelector('[data-gallery-imagen]').value.trim(),
                titulo: row.querySelector('[data-gallery-titulo]').value.trim(),
                norma: row.querySelector('[data-gallery-norma]').value.trim()
            };
        }).filter(function (it) { return it.titulo || it.imagen; });
    }

    wireCreateModal({
        modalId: 'svcModal', formId: 'svcModalForm', openFn: 'svcOpenCreate', closeFn: 'svcCloseModal',
        apiUrl: resolveApiUrl('api/servicios'), responseKey: 'servicio', viewBase: '/servicios',
        fields: [
            { id: 'svcField_titulo', key: 'titulo' },
            { id: 'svcField_resumen', key: 'resumen' },
            { id: 'svcField_contenido', key: 'contenido' },
            { id: 'svcField_imagen', key: 'imagen' },
            { id: 'svcField_introImagen', key: 'intro_imagen' },
            { id: 'svcField_estado', key: 'estado' }
        ],
        checkboxFields: [
            { id: 'svcField_destacado', key: 'destacado' }
        ],
        imageUpload: {
            fileInputId: 'svcField_imagenFile', urlFieldId: 'svcField_imagen', previewId: 'svcField_imagenPreview',
            errorId: 'svcField_imagenError', tabla: 'servicios', placeholder: 'https://placehold.co/640x480/e9edf5/e9edf5'
        },
        customFields: {
            onLoad: function (item) {
                var introPreview = document.getElementById('svcField_introImagenPreview');
                if (introPreview) introPreview.src = item.intro_imagen || 'https://placehold.co/640x480/e9edf5/e9edf5';
                var incluyeEl = document.getElementById('svcField_incluye');
                if (incluyeEl) {
                    var incluye = [];
                    try { incluye = JSON.parse(item.incluye || '[]'); } catch (e) {}
                    incluyeEl.value = incluye.join('\n');
                }
                var estadoEl = document.getElementById('svcField_estado');
                if (estadoEl) estadoEl.value = item.estado || 'published';
                var galeria = [];
                try { galeria = JSON.parse(item.galeria || '[]'); } catch (e) {}
                svcGaleriaLoad(galeria);
            },
            onReset: function () {
                var introPreview = document.getElementById('svcField_introImagenPreview');
                if (introPreview) introPreview.src = 'https://placehold.co/640x480/e9edf5/e9edf5';
                var incluyeEl = document.getElementById('svcField_incluye');
                if (incluyeEl) incluyeEl.value = '';
                var estadoEl = document.getElementById('svcField_estado');
                if (estadoEl) estadoEl.value = 'published';
                svcGaleriaLoad([]);
            },
            onSubmit: function (payload) {
                var incluyeEl = document.getElementById('svcField_incluye');
                payload.incluye = incluyeEl ? incluyeEl.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];
                payload.galeria = svcGaleriaCollect();
            }
        }
    });

    wireSimpleImageUpload('svcField_introImagenFile', 'svcField_introImagen', 'svcField_introImagenPreview', 'svcField_introImagenError', 'servicios');

    wireCreateModal({
        modalId: 'prjModal', formId: 'prjModalForm', openFn: 'prjOpenCreate', closeFn: 'prjCloseModal',
        apiUrl: resolveApiUrl('api/proyectos'), responseKey: 'proyecto', viewBase: '/proyectos',
        fields: [
            { id: 'prjField_titulo', key: 'titulo' },
            { id: 'prjField_ubicacion', key: 'ubicacion' },
            { id: 'prjField_fecha', key: 'fecha' },
            { id: 'prjField_categoria', key: 'categoria' },
            { id: 'prjField_empresa', key: 'empresa' },
            { id: 'prjField_resumen', key: 'resumen' },
            { id: 'prjField_contenido', key: 'contenido' },
            { id: 'prjField_imagen', key: 'imagen' }
        ],
        imageUpload: {
            fileInputId: 'prjField_imagenFile', urlFieldId: 'prjField_imagen', previewId: 'prjField_imagenPreview',
            errorId: 'prjField_imagenError', tabla: 'proyectos', placeholder: 'https://placehold.co/600x400/e9edf5/e9edf5'
        }
    });

    wireCreateModal({
        modalId: 'artModal', formId: 'artModalForm', openFn: 'artOpenCreate', closeFn: 'artCloseModal',
        apiUrl: resolveApiUrl('api/investigacion'), responseKey: 'articulo', viewBase: '/investigacion',
        fields: [
            { id: 'artField_titulo', key: 'titulo' },
            { id: 'artField_resumen', key: 'resumen' },
            { id: 'artField_contenido', key: 'contenido' },
            { id: 'artField_docente', key: 'docente' },
            { id: 'artField_imagen', key: 'imagen' }
        ],
        imageUpload: {
            fileInputId: 'artField_imagenFile', urlFieldId: 'artField_imagen', previewId: 'artField_imagenPreview',
            errorId: 'artField_imagenError', tabla: 'investigacion', placeholder: 'https://placehold.co/84x56/eceff4/eceff4'
        },
        customFields: {
            onLoad: function (item) {
                var el = document.getElementById('artField_fecha');
                if (el) el.value = dmyToIso(item.fecha);
            },
            onReset: function () {
                var el = document.getElementById('artField_fecha');
                if (el) el.value = '';
            },
            onSubmit: function (payload) {
                var el = document.getElementById('artField_fecha');
                if (el && el.value) payload.fecha = isoToDmy(el.value);
            }
        }
    });

    (function () {
        var crsDocenteSelect = document.getElementById('crsField_docente');

        function wireCrsModal() {
            wireCreateModal({
                modalId: 'crsModal', formId: 'crsModalForm', openFn: 'crsOpenCreate', closeFn: 'crsCloseModal',
                apiUrl: resolveApiUrl('api/cursos'), responseKey: 'curso', viewBase: '/cursos',
                fields: [
                    { id: 'crsField_titulo', key: 'titulo' },
                    { id: 'crsField_modalidad', key: 'modalidad' },
                    { id: 'crsField_duracion', key: 'duracion' },
                    { id: 'crsField_nivel', key: 'nivel' },
                    { id: 'crsField_inversion', key: 'inversion' },
                    { id: 'crsField_docente', key: 'docente_id' },
                    { id: 'crsField_resumen', key: 'resumen' },
                    { id: 'crsField_contenido', key: 'contenido' },
                    { id: 'crsField_imagen', key: 'imagen' }
                ],
                imageUpload: {
                    fileInputId: 'crsField_imagenFile', urlFieldId: 'crsField_imagen', previewId: 'crsField_imagenPreview',
                    errorId: 'crsField_imagenError', tabla: 'cursos', placeholder: 'https://placehold.co/84x56/eceff4/eceff4'
                }
            });
        }

        if (!crsDocenteSelect) { wireCrsModal(); return; }

        fetch(window.API_BASE + '/api/docentes')
            .then(function (res) { return res.json(); })
            .then(function (docentes) {
                crsDocenteSelect.innerHTML = '<option value="">Selecciona un docente...</option>'
                    + docentes.map(function (d) { return '<option value="' + d.id + '">' + escapeHtml(d.titulo) + '</option>'; }).join('');
            })
            .catch(function () {})
            .then(wireCrsModal);
    })();

    wireCreateModal({
        modalId: 'docModal', formId: 'docModalForm', openFn: 'docOpenCreate', closeFn: 'docCloseModal',
        apiUrl: resolveApiUrl('api/docentes'), responseKey: 'docente', viewBase: '/docentes',
        fields: [
            { id: 'docField_titulo', key: 'titulo' },
            { id: 'docField_role', key: 'role' },
            { id: 'docField_bio', key: 'bio' },
            { id: 'docField_linkedin', key: 'linkedin' },
            { id: 'docField_imagen', key: 'imagen' },
            { id: 'docField_resumen', key: 'resumen' }
        ],
        imageUpload: {
            fileInputId: 'docField_imagenFile', urlFieldId: 'docField_imagen', previewId: 'docField_imagenPreview',
            errorId: 'docField_imagenError', tabla: 'docentes', placeholder: 'https://placehold.co/84x56/eceff4/eceff4'
        },
        customFields: {
            onSubmit: function (payload) {
                payload.resumen = payload.role || '';
            }
        }
    });

    var contentForm = document.getElementById('contentForm');
    if (contentForm) {
        var contentStatus = document.getElementById('contentFormStatus');
        var contentFieldEls = Array.prototype.slice.call(contentForm.querySelectorAll('[id^="contentField_"]'));

        fetch(window.API_BASE + '/api/contenido')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                contentFieldEls.forEach(function (el) {
                    var clave = el.id.replace('contentField_', '');
                    if (data[clave] != null) el.value = data[clave];
                });
            })
            .catch(function () {
                if (contentStatus) contentStatus.textContent = 'No se pudo cargar el contenido actual.';
            });

        contentForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var payload = {};
            contentFieldEls.forEach(function (el) {
                payload[el.id.replace('contentField_', '')] = el.value;
            });
            if (contentStatus) contentStatus.textContent = 'Guardando...';
            authFetch(window.API_BASE + '/api/contenido', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                    if (contentStatus) contentStatus.textContent = result.ok ? 'Cambios guardados.' : 'No se pudo guardar.';
                })
                .catch(function () {
                    if (contentStatus) contentStatus.textContent = 'No se pudo guardar.';
                });
        });
    }

    var themeToggle = document.querySelector('.admin-theme-toggle');
    if (themeToggle) {
        var savedTheme = localStorage.getItem('adminTheme') || 'dark';
        document.body.classList.add('admin-theme');
        if (savedTheme === 'light') document.body.classList.add('light');

        var updateIcon = function() {
            var isDark = !document.body.classList.contains('light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        };
        updateIcon();

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light');
            var theme = document.body.classList.contains('light') ? 'light' : 'dark';
            localStorage.setItem('adminTheme', theme);
            updateIcon();
        });
    }
})();
