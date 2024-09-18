document.addEventListener("DOMContentLoaded", function () {
    // Variables para la pantalla de carga
    const percentageElement = document.querySelector('.percentage');
    const loadingDiv = document.querySelector('.loading');
    const loadingTime = 3000; // Tiempo total de carga en milisegundos
    const intervalTime = loadingTime / 100; // Tiempo entre incrementos de porcentaje
    let currentPercentage = 0;

    // Función para actualizar el porcentaje
    function updatePercentage(percent) {
        percentageElement.textContent = `${percent}%`;
    }

    // Función para redirigir a la página principal
    function redirectToMain() {
        window.location.href = "portafolio.html"; // Cambia a tu URL de destino
    }

    // Incrementa el porcentaje cada intervalo de tiempo
    const interval = setInterval(() => {
        currentPercentage += 1;
        updatePercentage(currentPercentage);

        if (currentPercentage >= 100) {
            clearInterval(interval);
            redirectToMain();
        }
    }, intervalTime);

    // Funcionalidad del botón "volver arriba"
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 300);
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animación de la sección "about-me"
    const aboutSection = document.querySelector('#about-me');
    const aboutTitle = aboutSection.querySelector('.section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutTitle.classList.add('animate');
                observer.disconnect(); // Dejar de observar después de la animación
            }
        });
    });
    observer.observe(aboutSection);
   // Funcionalidad del slider
   const prevButton = document.querySelector('.slider-nav.prev');
   const nextButton = document.querySelector('.slider-nav.next');
   const container = document.querySelector('.projects-container');
   const items = document.querySelectorAll('.article-wrapper');
   let currentIndex = 0;

   function updateSlider() {
       const itemWidth = items[0].offsetWidth + 20; // Ajusta el margen según sea necesario
       const offset = -currentIndex * itemWidth;
       container.style.transform = `translateX(${offset}px)`;
   }

   prevButton.addEventListener('click', () => {
       if (currentIndex > 0) {
           currentIndex--;
           updateSlider();
       }
   });

   nextButton.addEventListener('click', () => {
       if (currentIndex < items.length - 1) {
           currentIndex++;
           updateSlider();
       }
   });


});
