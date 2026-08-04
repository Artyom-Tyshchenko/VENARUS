window.addEventListener('DOMContentLoaded', () => {

    /* ===================== БУРГЕР-МЕНЮ ===================== */
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    const menuLinks = document.querySelectorAll('.menu [data-menu-link]');

    function closeMenu() {
        hamburger.classList.remove('hamburger_active');
        menu.classList.remove('menu_active');
    }

    function toggleMenu() {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    }

    if (hamburger && menu) {
        hamburger.addEventListener('click', toggleMenu);
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
        }
    };

    function openModal(type) {
        const data = modalData[type];
        if (!data) return;
        modalContent.innerHTML = `<h3 class="modal-title">${data.title}</h3>${data.html}`;
        modalOverlay.classList.add('modal-overlay--active');
        document.body.classList.add('no-scroll');
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
