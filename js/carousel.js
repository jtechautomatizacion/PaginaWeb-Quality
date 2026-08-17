(function () {
    var headerArea = document.querySelector('.header_area');
    if (!headerArea) return;
    var offsetTop = headerArea.offsetHeight + 50;
    window.addEventListener('scroll', function () {
        if (window.scrollY >= offsetTop) {
            headerArea.classList.add('navbar_fixed');
            document.body.classList.add('has-navbar-fixed');
        } else {
            headerArea.classList.remove('navbar_fixed');
            document.body.classList.remove('has-navbar-fixed');
        }
    });
})();

(function () {
    document.querySelectorAll('.menu_nav .has-submenu').forEach(function (li) {
        var navLink = li.querySelector(':scope > .nav-link');
        var icon = navLink ? navLink.querySelector('.fa-chevron-down') : null;
        if (!icon) return;
        navLink.setAttribute('aria-haspopup', 'true');
        navLink.setAttribute('aria-expanded', 'false');
        icon.addEventListener('click', function (ev) {
            if (window.matchMedia('(hover: hover)').matches) return;
            ev.preventDefault();
            ev.stopPropagation();
            document.querySelectorAll('.menu_nav .has-submenu.is-open').forEach(function (open) {
                if (open !== li) {
                    open.classList.remove('is-open');
                    var openLink = open.querySelector(':scope > .nav-link');
                    if (openLink) openLink.setAttribute('aria-expanded', 'false');
                }
            });
            var nowOpen = li.classList.toggle('is-open');
            navLink.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
        });
    });
})();

(function () {
    var toggler = document.querySelector('.navbar-toggler');
    var collapse = document.getElementById('navbarSupportedContent');
    if (toggler && collapse) {
        toggler.addEventListener('click', function () {
            var isOpen = collapse.classList.toggle('show');
            toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }
})();

(function () {
    var hero = document.querySelector('.hm-hero');
    if (!hero) return;

    var prevBtn = hero.querySelector('[data-hm-prev]');
    var nextBtn = hero.querySelector('[data-hm-next]');
    var currentEl = hero.querySelector('[data-hm-current]');
    var totalEl = hero.querySelector('[data-hm-total]');
    var slides = [];
    var index = 0;
    var timer = null;
    var bound = false;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function render() {
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === index);
        });
        if (currentEl) currentEl.textContent = pad(index + 1);
        if (totalEl) totalEl.textContent = pad(slides.length);
    }

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        render();
    }

    function restartAutoplay() {
        if (timer) clearInterval(timer);
        if (slides.length > 1) timer = setInterval(function () { goTo(index + 1); }, 6000);
    }

    window.initHmHero = function () {
        slides = Array.prototype.slice.call(hero.querySelectorAll('.hm-hero__slide'));
        index = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
        if (index < 0) index = 0;

        if (!bound) {
            bound = true;
            if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); restartAutoplay(); });
            if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); restartAutoplay(); });
        }

        render();
        restartAutoplay();
    };

    window.initHmHero();
})();

(function () {
    document.querySelectorAll('[data-hm-carousel]').forEach(function (carousel) {
        var track = carousel.querySelector('.hm-carousel__track, .hm-services__cards');
        var prevBtn = carousel.querySelector('.hm-carousel__arrow--prev');
        var nextBtn = carousel.querySelector('.hm-carousel__arrow--next');
        if (!track) return;

        function scrollByCard(direction) {
            var card = track.firstElementChild;
            var step = card ? card.getBoundingClientRect().width + 22 : track.clientWidth;
            track.scrollBy({ left: direction * step, behavior: 'smooth' });
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
    });
})();

(function () {
    document.querySelectorAll('.carousel[data-ride="carousel"]').forEach(function (carousel) {
        var items = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-item'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.li-slide-btn'));
        var prevBtn = carousel.querySelector('.slide-control-prev-bsc');
        var nextBtn = carousel.querySelector('.slide-control-next-bsc');
        if (!items.length) return;
        var index = items.findIndex(function (it) { return it.classList.contains('active'); });
        if (index < 0) index = 0;

        function render() {
            items.forEach(function (it, i) { it.classList.toggle('active', i === index); });
            dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
        }
        function goTo(i, ev) {
            if (ev) ev.preventDefault();
            index = (i + items.length) % items.length;
            render();
        }

        if (prevBtn) prevBtn.addEventListener('click', function (ev) { goTo(index - 1, ev); });
        if (nextBtn) nextBtn.addEventListener('click', function (ev) { goTo(index + 1, ev); });
        dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
        render();
    });
})();

(function () {
    var btns = document.querySelectorAll('.cat-filter-btn');
    var tiles = document.querySelectorAll('.mosaic-tile[data-category]');
    var empty = document.querySelector('[data-empty]');
    if (!btns.length) return;
    btns.forEach(function (b) {
        b.addEventListener('click', function () {
            btns.forEach(function (x) { x.classList.remove('is-active'); });
            b.classList.add('is-active');
            var f = b.getAttribute('data-cat-filter');
            var shown = 0;
            tiles.forEach(function (t) {
                var cat = t.getAttribute('data-category') || '';
                var match = (f === '*' || cat === f);
                t.style.display = match ? '' : 'none';
                if (match) shown++;
            });
            if (empty) empty.hidden = shown !== 0;
        });
    });
})();

(function () {
    var modal = document.getElementById('docenteModal');
    if (!modal) return;
    var photoBox = document.getElementById('docenteModalPhoto');
    var nameEl = document.getElementById('docenteModalName');
    var roleEl = document.getElementById('docenteModalRole');
    var bioEl = document.getElementById('docenteModalBio');
    var liEl = document.getElementById('docenteModalLinkedin');

    function openModal(btn) {
        var name = btn.getAttribute('data-docente-name') || '';
        var role = btn.getAttribute('data-docente-role') || '';
        var bio = btn.getAttribute('data-docente-bio') || '';
        var photo = btn.getAttribute('data-docente-photo') || '';
        var linkedin = btn.getAttribute('data-docente-linkedin') || '';

        nameEl.textContent = name;
        roleEl.textContent = role;
        roleEl.style.display = role ? '' : 'none';
        bioEl.textContent = bio;
        bioEl.style.display = bio ? '' : 'none';

        if (photo) {
            photoBox.classList.remove('docente-modal__photo--placeholder');
            photoBox.innerHTML = '';
            var img = document.createElement('img');
            img.src = photo;
            img.alt = name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            photoBox.appendChild(img);
        } else {
            photoBox.classList.add('docente-modal__photo--placeholder');
            photoBox.innerHTML = '<i class="fas fa-user-tie"></i>';
        }

        if (linkedin) {
            liEl.href = linkedin;
            liEl.hidden = false;
        } else {
            liEl.hidden = true;
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function (ev) {
        var opener = ev.target.closest('.js-open-docente');
        if (opener) { ev.preventDefault(); openModal(opener); return; }
        if (ev.target.closest('[data-docente-close]') || ev.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
})();

window.initCoursesCatalog = function () {
    var perPage = 16;
    var grid = document.getElementById('coursesGrid');
    if (!grid) return;
    var empty = document.getElementById('coursesEmpty');
    var pagNav = document.getElementById('coursesPagination');
    var searchInput = document.getElementById('coursesSearchInput');
    var filterBtn = document.getElementById('coursesFilterBtn');
    var allCards = Array.prototype.slice.call(grid.querySelectorAll('.course-card'));
    var filterOpts = document.querySelectorAll('.courses-filter-opt');

    var state = { modality: '*', level: '*', q: '', page: 1 };

    filterOpts.forEach(function (opt) {
        opt.addEventListener('click', function () {
            var group = opt.getAttribute('data-filter-group');
            var value = opt.getAttribute('data-filter-value');
            document.querySelectorAll('.courses-filter-opt[data-filter-group="' + group + '"]').forEach(function (x) {
                x.classList.remove('is-active');
            });
            opt.classList.add('is-active');
            state[group] = value;
            state.page = 1;
            render();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            state.q = (searchInput.value || '').toLowerCase().trim();
            state.page = 1;
            render();
        });
    }
    if (filterBtn) {
        filterBtn.addEventListener('click', function () { state.page = 1; render(); });
    }

    function matchCard(card) {
        var mod = card.getAttribute('data-modality') || '';
        var lvl = card.getAttribute('data-level') || '';
        var title = card.getAttribute('data-title') || '';
        if (state.modality !== '*' && mod !== state.modality) return false;
        if (state.level !== '*' && lvl !== state.level) return false;
        if (state.q !== '' && title.indexOf(state.q) === -1) return false;
        return true;
    }

    function render() {
        var visible = allCards.filter(matchCard);
        var total = visible.length;
        var totalPages = Math.max(1, Math.ceil(total / perPage));
        if (state.page > totalPages) state.page = totalPages;
        var start = (state.page - 1) * perPage;
        var end = start + perPage;

        allCards.forEach(function (c) { c.style.display = 'none'; });
        visible.slice(start, end).forEach(function (c) { c.style.display = ''; });

        if (empty) empty.hidden = total !== 0;
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        pagNav.innerHTML = '';
        if (totalPages <= 1) return;

        var frag = document.createDocumentFragment();

        var prev = makeBtn('&laquo;', state.page > 1, function () { state.page--; render(); scrollToTop(); });
        prev.setAttribute('aria-label', 'Anterior');
        frag.appendChild(prev);

        var pages = buildPageList(state.page, totalPages);
        pages.forEach(function (p) {
            if (p === '...') {
                var el = document.createElement('span');
                el.className = 'cp-ellipsis';
                el.textContent = '...';
                frag.appendChild(el);
            } else {
                var b = makeBtn(String(p), true, (function (page) {
                    return function () { state.page = page; render(); scrollToTop(); };
                })(p));
                if (p === state.page) b.classList.add('is-current');
                frag.appendChild(b);
            }
        });

        var next = makeBtn('&raquo;', state.page < totalPages, function () { state.page++; render(); scrollToTop(); });
        next.setAttribute('aria-label', 'Siguiente');
        frag.appendChild(next);

        pagNav.appendChild(frag);
    }

    function makeBtn(html, enabled, handler) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cp-btn';
        b.innerHTML = html;
        if (!enabled) { b.disabled = true; b.classList.add('is-disabled'); }
        else { b.addEventListener('click', handler); }
        return b;
    }

    function buildPageList(current, total) {
        if (total <= 7) {
            var out = [];
            for (var i = 1; i <= total; i++) out.push(i);
            return out;
        }
        var pages = [1];
        var startWin = Math.max(2, current - 1);
        var endWin = Math.min(total - 1, current + 1);
        if (startWin > 2) pages.push('...');
        for (var j = startWin; j <= endWin; j++) pages.push(j);
        if (endWin < total - 1) pages.push('...');
        pages.push(total);
        return pages;
    }

    function scrollToTop() {
        var anchor = document.querySelector('.courses-layout');
        if (!anchor) return;
        var y = anchor.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    render();
};

(function () {
    var modal = document.getElementById('waPickerModal');
    if (!modal) return;
    var openers = document.querySelectorAll('[data-wa-picker]');
    var closers = modal.querySelectorAll('[data-wa-close]');

    function open(ev) {
        if (ev) ev.preventDefault();
        modal.hidden = false;
        document.body.classList.add('wa-picker-open');
    }
    function close() {
        modal.hidden = true;
        document.body.classList.remove('wa-picker-open');
    }

    openers.forEach(function (o) { o.addEventListener('click', open); });
    closers.forEach(function (c) { c.addEventListener('click', close); });
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && !modal.hidden) close();
    });
})();
