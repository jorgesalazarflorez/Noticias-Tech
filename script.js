const urlBase = "https://hacker-news.firebaseio.com/v0";
const porPagina = 9;
const contenedor = document.getElementById("noticias");
const mensaje = document.getElementById("mensaje");
const btnActualizar = document.getElementById("btnActualizar");
const btnMas = document.getElementById("btnMas");

let idsNoticias = [];
let cantidadMostrada = 0;

const obtenerIds = async () =>
    idsNoticias = await (await fetch(`${urlBase}/topstories.json`)).json();
const obtenerNoticia = async id =>
    (await fetch(`${urlBase}/item/${id}.json`)).json();
const formatearFecha = segundos =>
    new Date(segundos * 1000).toLocaleDateString("es-CO", {
        day: "numeric", month: "long", year: "numeric"
    });

function crearTarjeta(noticia) {
    if (!noticia) return;

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
        <h2>${noticia.title}</h2>
        <p>Autor: ${noticia.by}</p>
        <p>Fecha: ${formatearFecha(noticia.time)}</p>
        <a href="${noticia.url || `https://news.ycombinator.com/item?id=${noticia.id}`}" target="_blank">Leer noticia</a>`;
    contenedor.appendChild(tarjeta);
}

async function cargarNoticias() {
    mensaje.textContent = "Cargando noticias...";
    btnMas.disabled = true;
    try {
        const fin = cantidadMostrada + porPagina;
        (await Promise.all(idsNoticias.slice(cantidadMostrada, fin).map(obtenerNoticia)))
            .forEach(crearTarjeta);
        cantidadMostrada = fin;
        mensaje.textContent = "";
    } catch (error) {
        mensaje.textContent = "No se pudieron cargar las noticias. Intenta de nuevo.";
    }
    btnMas.disabled = false;
}

async function iniciar() {
    contenedor.innerHTML = "";
    cantidadMostrada = 0;
    mensaje.textContent = "Cargando noticias...";
    try {
        await obtenerIds();
        await cargarNoticias();
    } catch (error) {
        mensaje.textContent = "No se pudo conectar con la API. Intenta de nuevo.";
    }
}

btnActualizar.addEventListener("click", iniciar);
btnMas.addEventListener("click", cargarNoticias);
iniciar();
