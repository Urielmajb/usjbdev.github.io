document.addEventListener("DOMContentLoaded", function () {
    const percentageElement = document.querySelector('.percentage');
    const loadingDiv = document.querySelector('.loading');

    // Seteamos el tiempo de la pagina loading (e.g., 5 seconds)
    const loadingTime = 4000;
    const intervalTime = loadingTime / 100;
    let currentPercentage = 0;

    //Incrementamos el porcentaje cada intervalo de tiempo en milisegundos.
    const interval = setInterval(function () {
        currentPercentage += 1;
        updatePercentage(currentPercentage);

        if (currentPercentage >= 100) {
            clearInterval(interval);
            redirectToMain();
        }
    }, intervalTime);

    function updatePercentage(percent) {
        percentageElement.textContent = `${percent}%`;
    }

    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('showing');
    });

    const filterButtons = document.querySelectorAll('.filter-button');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Funcion que te redirige a la pagina principal 
    function redirectToMain() {
        window.location.href = "portafolio.html"; // 
    }

    var backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const aboutSection = document.querySelector('#about-me');
    const aboutTitle = aboutSection.querySelector('.section-title');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutTitle.classList.add('animate');
                observer.disconnect();
            }
        });
    });

    observer.observe(aboutSection);

});

