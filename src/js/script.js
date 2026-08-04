window.addEventListener('DOMContentLoaded', () => {

    /* ===================== БУРГЕР-МЕНЮ ===================== */
    const menu = document.querySelector('.menu');
    const hamburgers = document.querySelectorAll('.hamburger');
    const stickyHamburger = document.getElementById('stickyHamburger');
    const menuLinks = document.querySelectorAll('.menu [data-menu-link]');

    function closeMenu() {
        hamburgers.forEach(h => h.classList.remove('hamburger_active'));
        menu.classList.remove('menu_active');
    }

    function toggleMenu() {
        const isActive = menu.classList.contains('menu_active');
        if (!isActive) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
        hamburgers.forEach(h => h.classList.toggle('hamburger_active', !isActive));
        menu.classList.toggle('menu_active');
    }

    if (hamburgers.length && menu) {
        hamburgers.forEach(h => h.addEventListener('click', toggleMenu));
    }

    // Плавающий бургер появляется, когда прокрутили мимо шапки
    if (stickyHamburger) {
        const SHOW_AFTER = 400;
        function updateStickyHamburger() {
            stickyHamburger.classList.toggle('hamburger--sticky-visible', window.scrollY > SHOW_AFTER);
        }
        updateStickyHamburger();
        window.addEventListener('scroll', updateStickyHamburger, { passive: true });
    }

    menuLinks.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = item.dataset.menuLink;
            if (action === 'map') {
                e.preventDefault();
                closeMenu();
                openModal('map');
            } else {
                closeMenu();
            }
        });
    });

    /* ===================== МОДАЛЬНЫЕ ОКНА ===================== */
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    const modalData = {
        scheme: {
            title: 'Схема приёма',
            html: `
                <p class="modal-lead">Ниже — обобщённая схема приёма в зависимости от дозировки препарата.</p>
                <table class="modal-table">
                    <thead>
                        <tr><th>Дозировка</th><th>Как принимать</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1000 мг</td><td>1 таблетка в сутки, желательно утром, во время еды</td></tr>
                        <tr><td>500 мг</td><td>2 таблетки в сутки (за один или два приёма), во время еды</td></tr>
                    </tbody>
                </table>
                <p class="modal-note">Точную схему и длительность приёма определяет врач. Информация носит ознакомительный характер и не заменяет консультацию специалиста.</p>
            `
        },
        instruction: {
            title: 'Инструкция',
            html: `
                <p class="modal-lead">Краткая ознакомительная выжимка (демо-контент учебного проекта):</p>
                <ul class="modal-list">
                    <li><b>Показания:</b> облегчение симптомов хронической венозной недостаточности нижних конечностей (тяжесть, отёчность, судороги).</li>
                    <li><b>Способ применения:</b> см. раздел «Схема приёма».</li>
                    <li><b>Противопоказания:</b> индивидуальная непереносимость компонентов; период беременности и грудного вскармливания — по согласованию с врачом; детский возраст.</li>
                    <li><b>Особые указания:</b> перед началом приёма рекомендуется консультация врача.</li>
                </ul>
                <p class="modal-note">Это сокращённая демонстрационная версия для учебного pet-проекта. Полная официальная инструкция — на сайте производителя.</p>
                <a class="modal-link" href="https://venarus.ru/" target="_blank" rel="noopener">Перейти на официальный сайт →</a>
            `
        },
        map: {
            title: 'Где купить',
            html: `
                <p class="modal-lead">Аптеки в Москве, где можно приобрести препарат:</p>
                <div class="modal-map">
                    <iframe
                        src="https://www.google.com/maps?q=%D0%B0%D0%BF%D1%82%D0%B5%D0%BA%D0%B0%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&output=embed"
                        width="100%" height="100%" style="border:0" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            `
        },
        search: {
            title: 'Поиск по сайту',
            html: `
                <form class="modal-search" id="siteSearchForm">
                    <input type="text" id="siteSearchInput" class="modal-search__input" placeholder="Например: судороги, геморрой, дозировка..." autocomplete="off">
                    <button type="submit" class="modal-search__submit">Найти</button>
                </form>
                <div id="siteSearchResults" class="modal-search__results"></div>
            `
        }
    };

    // Индекс разделов сайта для простого клиентского поиска
    const searchIndex = [
        { id: 'about-drug', title: 'О препарате', keywords: 'венарус диосмин гесперидин состав дозировка 1000 500 мг таблетки' },
        { id: 'about-varicose', title: 'О варикозе', keywords: 'варикоз вены тяжесть отёк отек судороги клапаны симптомы' },
        { id: 'reshenie', title: 'Решение', keywords: 'приём прием схема дозировка рекомендации как принимать' },
        { id: 'specialists-info', title: 'О производстве', keywords: 'производство завод специалистам формула контакты' },
        { id: 'specialist-opinion', title: 'Мнение специалистов', keywords: 'врач флеболог мнение видео специалист' },
        { id: 'hemorrhoid', title: 'Геморрой', keywords: 'геморрой проктолог венозное сплетение' },
        { id: 'fourth-section', title: 'Где купить / Полезная информация', keywords: 'аптека купить apteka 366 stolichki профилактика упражнения питание диагностика' }
    ];

    function runSiteSearch(query) {
        const resultsEl = document.getElementById('siteSearchResults');
        if (!resultsEl) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            resultsEl.innerHTML = '';
            return;
        }
        const matches = searchIndex.filter(item =>
            item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
        );
        if (!matches.length) {
            resultsEl.innerHTML = '<p class="modal-note">Ничего не найдено. Попробуйте другой запрос.</p>';
            return;
        }
        resultsEl.innerHTML = matches.map(m =>
            `<a href="#${m.id}" class="modal-search__result" data-search-target="${m.id}">${m.title}</a>`
        ).join('');
        resultsEl.querySelectorAll('[data-search-target]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(link.dataset.searchTarget);
                closeModal();
                if (target) {
                    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
                }
            });
        });
    }

    function openModal(type) {
        const data = modalData[type];
        if (!data) return;
        modalContent.innerHTML = `<h3 class="modal-title">${data.title}</h3>${data.html}`;
        modalOverlay.classList.add('modal-overlay--active');
        document.body.classList.add('no-scroll');

        if (type === 'search') {
            const form = document.getElementById('siteSearchForm');
            const input = document.getElementById('siteSearchInput');
            if (form && input) {
                input.focus();
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    runSiteSearch(input.value);
                });
                input.addEventListener('input', () => runSiteSearch(input.value));
            }
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('modal-overlay--active');
        document.body.classList.remove('no-scroll');
    }

    document.querySelectorAll('[data-modal]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(el.dataset.modal);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* ===================== СЛАЙДЕР ДОЗИРОВОК (стрелочки в шапке) ===================== */
    const dosageSlides = document.querySelectorAll('.dosage-slide');
    const dosageNext = document.querySelector('.main-section__switch-right');
    const dosagePrev = document.querySelector('.main-section__switch-left');
    let dosageIndex = 0;

    function showDosage(index) {
        dosageSlides.forEach((slide, i) => {
            slide.classList.toggle('dosage-slide--active', i === index);
        });
    }

    if (dosageSlides.length) {
        showDosage(0);
        if (dosageNext) {
            dosageNext.addEventListener('click', (e) => {
                e.preventDefault();
                dosageIndex = (dosageIndex + 1) % dosageSlides.length;
                showDosage(dosageIndex);
            });
        }
        if (dosagePrev) {
            dosagePrev.addEventListener('click', (e) => {
                e.preventDefault();
                dosageIndex = (dosageIndex - 1 + dosageSlides.length) % dosageSlides.length;
                showDosage(dosageIndex);
            });
        }
    }

    /* ===================== ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ===================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.length > 1) {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });

    /* ===================== АДАПТИВНОЕ МАСШТАБИРОВАНИЕ ШИРОКОГО МАКЕТА ===================== */
    const scaleInner = document.getElementById('scaleWrapper');
    const scaleOuter = document.getElementById('scaleOuter');
    const BASE_WIDTH = 1440;

    function updateScale() {
        if (!scaleInner || !scaleOuter) return;
        const viewportWidth = window.innerWidth;
        const scale = viewportWidth / BASE_WIDTH;
        scaleInner.style.transform = `scale(${scale})`;
        scaleOuter.style.height = (scaleInner.offsetHeight * scale) + 'px';
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('load', updateScale);
    setTimeout(updateScale, 400);
    setTimeout(updateScale, 1200);

    /* ===================== ХОВЕР-ПОДЪЁМ КАРТОЧЕК "ПОЛЕЗНАЯ ИНФОРМАЦИЯ" ===================== */
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('info-card--hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('info-card--hover'));
    });
});
