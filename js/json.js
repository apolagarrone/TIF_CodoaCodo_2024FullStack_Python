document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let slides = [];
    let currentIndex = 0;
    fetch('https://apolagarrone.github.io/TP2024_1C_Equipo20_CaC/datos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos obtenidos del JSON:', data); 

            if (data.length > 0 && Array.isArray(data[0].Destinos)) {
                slides = data[0].Destinos;
                renderCarousel();
            } else {
                console.error('Formato de JSON inesperado');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function renderCarousel() {
        carouselContainer.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.classList.add('carousel-slide');
            if (index === 0) {
                slideElement.classList.add('active'); 
            }
            slideElement.innerHTML = `
                <img src="${slide.image}" alt="${slide.Nombre}">
                <h1>${slide.Nombre}</h1>
                <h2>Edad: ${slide.Edad}</h2>
                <h2>Servicio: ${slide.Servicio}</h2>
                <h2>Descripción: ${slide.Descripcion}</h2>
                <h2>Origen: ${slide.Origen}</h2>
            `;
            carouselContainer.appendChild(slideElement);
        });
        updateCarousel();
    }
    function updateCarousel() {
        const slideElements = document.querySelectorAll('.carousel-slide');
        slideElements.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateCarousel();
    });
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });
});


