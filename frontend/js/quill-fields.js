(function () {
    if (typeof Quill === 'undefined') return;

    window.__quillFields = window.__quillFields || {};

    var TOOLBAR = [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
    ];

    var PAIRS = [
        ['svcField_resumen_editor', 'svcField_resumen'],
        ['svcField_contenido_editor', 'svcField_contenido'],
        ['prjField_resumen_editor', 'prjField_resumen'],
        ['prjField_contenido_editor', 'prjField_contenido'],
        ['artField_resumen_editor', 'artField_resumen'],
        ['artField_contenido_editor', 'artField_contenido'],
        ['crsField_resumen_editor', 'crsField_resumen'],
        ['crsField_contenido_editor', 'crsField_contenido'],
        ['credField_descripcion_editor', 'credField_descripcion'],
        ['nosBloqField_contenido_editor', 'nosBloqField_contenido']
    ];

    PAIRS.forEach(function (pair) {
        var editorId = pair[0];
        var textareaId = pair[1];
        var editorEl = document.getElementById(editorId);
        var textareaEl = document.getElementById(textareaId);
        if (!editorEl || !textareaEl) return;

        var quill = new Quill('#' + editorId, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR },
            placeholder: 'Escribe aqui...'
        });

        if (textareaEl.value) quill.root.innerHTML = textareaEl.value;

        quill.on('text-change', function () {
            textareaEl.value = quill.getText().trim() === '' ? '' : quill.root.innerHTML;
        });

        window.__quillFields[textareaId] = quill;
    });
})();
