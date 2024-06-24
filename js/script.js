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
});

document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Aquí puedes agregar la funcionalidad de envío del formulario.
    alert('Form submitted!');
});
