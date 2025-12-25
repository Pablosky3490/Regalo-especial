// Variables globales
let cartasVolteadas = 0;
const totalCartas = 6;
let palabrasDescubiertas = [];
let puedeVoltear = true;

// Obtener fecha actual
function obtenerFechaActual() {
    const fecha = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar fecha actual en la carta
    const fechaElement = document.getElementById('fecha-actual');
    if (fechaElement) {
        fechaElement.textContent = obtenerFechaActual();
    }
    
    // Inicializar frase secreta
    actualizarFraseSecreta();
});

// Función para voltear carta
function voltearCarta(carta) {
    // Verificar si ya está volteada o si no puede voltear
    if (carta.classList.contains('volteada') || !puedeVoltear) {
        return;
    }
    
    // Desactivar volteo temporalmente durante animación
    puedeVoltear = false;
    
    // Añadir clase volteada
    carta.classList.add('volteada');
    
    // Reproducir sonido
    const sonido = document.getElementById('sonido-voltear');
    if (sonido) {
        sonido.currentTime = 0;
        sonido.play();
    }
    
    // Obtener palabra
    const palabra = carta.getAttribute('data-palabra');
    palabrasDescubiertas.push(palabra);
    
    // Incrementar contador
    cartasVolteadas++;
    document.getElementById('contador').textContent = cartasVolteadas;
    
    // Actualizar frase secreta
    actualizarFraseSecreta();
    
    // Verificar si todas las cartas están volteadas
    if (cartasVolteadas === totalCartas) {
        setTimeout(() => {
            document.getElementById('boton-carta').disabled = false;
            mostrarMensajeCompleto();
        }, 500);
    }
    
    // Reactivar volteo después de animación
    setTimeout(() => {
        puedeVoltear = true;
    }, 600);
}

// Actualizar frase secreta
function actualizarFraseSecreta() {
    const fraseElement = document.getElementById('frase-secreta');
    let fraseHTML = '';
    
    for (let i = 0; i < totalCartas; i++) {
        if (i < palabrasDescubiertas.length) {
            // Palabra descubierta
            fraseHTML += `<span class="palabra-descubierta">${palabrasDescubiertas[i]}</span>`;
        } else {
            // Palabra oculta
            fraseHTML += '<span class="palabra-oculta">???</span>';
        }
        
        // Añadir espacio entre palabras (excepto la última)
        if (i < totalCartas - 1) {
            fraseHTML += ' ';
        }
    }
    
    fraseElement.innerHTML = fraseHTML;
    
    // Añadir estilo a las palabras descubiertas
    const palabrasDescubiertasElements = document.querySelectorAll('.palabra-descubierta');
    palabrasDescubiertasElements.forEach((palabra, index) => {
        palabra.style.animationDelay = `${index * 0.1}s`;
        palabra.classList.add('animar-palabra');
    });
}

// Mostrar mensaje cuando se completa
function mostrarMensajeCompleto() {
    const fraseElement = document.getElementById('frase-secreta');
    fraseElement.style.color = '#e91e63';
    fraseElement.style.fontSize = '2.2rem';
    
    // Pequeño efecto de confeti
    lanzarConfeti(20);
}

// Función para abrir carta final
function abrirCartaFinal() {
    // Reproducir sonido mágico
    const sonidoFinal = document.getElementById('sonido-final');
    if (sonidoFinal) {
        sonidoFinal.play();
    }
    
    // Ocultar botón
    const boton = document.getElementById('boton-carta');
    boton.style.display = 'none';
    
    // Mostrar carta
    const carta = document.getElementById('contenido-carta');
    carta.classList.remove('oculto');
    
    // Efecto de confeti
    lanzarConfeti(100);
    
    // Scroll suave a la carta
    carta.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Función para lanzar confeti
function lanzarConfeti(cantidad) {
    const colores = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#6bcf7f', '#a28bff'];
    const container = document.getElementById('confetti-container');
    
    for (let i = 0; i < cantidad; i++) {
        const confeti = document.createElement('div');
        confeti.className = 'confeti';
        
        // Posición aleatoria
        const left = Math.random() * 100;
        const size = 5 + Math.random() * 10;
        
        // Estilos
        confeti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${colores[Math.floor(Math.random() * colores.length)]};
            top: -20px;
            left: ${left}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0.9;
            z-index: 1000;
        `;
        
        container.appendChild(confeti);
        
        // Animación
        const animacion = confeti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        // Eliminar después de animación
        animacion.onfinish = () => {
            confeti.remove();
        };
    }
}

// Añadir estilos CSS para animaciones de palabras
const estiloAnimaciones = document.createElement('style');
estiloAnimaciones.textContent = `
    .palabra-descubierta {
        display: inline-block;
        animation: aparecerPalabra 0.5s ease-out forwards;
    }
    
    .palabra-oculta {
        color: #ccc;
    }
    
    @keyframes aparecerPalabra {
        0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    .confeti {
        position: absolute;
        pointer-events: none;
    }
`;
document.head.appendChild(estiloAnimaciones);