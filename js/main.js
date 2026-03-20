
const PRECIO_BASE = 1015000;

let tipos = []
let sistemas = []

async function cargarDatos() {
    try {
        const response = await fetch("data/tipos.json");
        const data = await response.json();

        tipos = data.tipos;
        sistemas = data.sistemas;

    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];

function obtenerMultiplicador(tipoId) {
    const tipo = tipos.find(t => t.id === tipoId);
    return tipo ? tipo.multiplicador : 1;
}

function obtenerNombreTipo(tipoId) {
    const tipo = tipos.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : "Desconocido";
}

function obtenerFactorSistema(nombreSistema) {
    const sistema = sistemas.find(s => s.nombre === nombreSistema);
    return sistema ? sistema.factor : 1;
}

function calcularPresupuesto(metros, tipo, sistema) {
    const multiplicador = obtenerMultiplicador(tipo);
    const factorSistema = obtenerFactorSistema(sistema);

    return metros * PRECIO_BASE * multiplicador * factorSistema;
}

function crearPresupuesto(metros, tipo, sistema, total) {
    return {
        id: Date.now(),
        metros: metros,
        tipo: tipo,
        sistema: sistema,
        total: total,
        fecha: new Date().toLocaleString()
    };
}

function guardarStorage() {
    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
}


function mostrarResultado(p) {
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = `
        <p>Metros: ${p.metros} m²</p>
        <p>Tipo: ${obtenerNombreTipo(p.tipo)}</p>
        <p>Sistema: ${p.sistema}</p>
        <p>Total: $${p.total.toLocaleString()}</p>
        <button id="btnContratar">Contratar servicio</button>
    `

    const boton = document.getElementById("btnContratar");

    boton.addEventListener("click", function () {
        contratarServicio(p.id)
    });
}

function contratarServicio(id) {
    const presupuesto = presupuestos.find(p => p.id === id);

    if (!presupuesto) return;

    presupuesto.contratado = true;

    guardarStorage();
    mostrarHistorial();

    Swal.fire({
        icon: "success",
        title: "Servicio contratado",
        text: "Nos estaremos contactando con vos"
    });
}

function mostrarHistorial() {
    const lista = document.getElementById("historial");
    lista.innerHTML = "";


    if (presupuestos.length === 0) {
        lista.innerHTML = "<li>No hay presupuestos aún</li>";
        document.getElementById("totalGeneral").textContent = "";
        return;
    }

    for (let i = 0; i < presupuestos.length; i++) {
        const p = presupuestos[i];

        const li = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = `${p.fecha} - ${p.metros}m² - ${obtenerNombreTipo(p.tipo)} - ${p.sistema} - $${p.total.toLocaleString()}`;

        const boton = document.createElement("button");
        boton.textContent = "Eliminar";

        boton.addEventListener("click", function () {
            eliminarPresupuesto(p.id);
        });

        li.appendChild(texto);
        li.appendChild(boton);

        lista.appendChild(li);
    }

    mostrarTotal();
}

function mostrarTotal() {
    let total = 0;

    for (let i = 0; i < presupuestos.length; i++) {
        total += presupuestos[i].total;
    }

    document.getElementById("totalGeneral").textContent =
        "Total acumulado: $" + total.toLocaleString();
}

function eliminarPresupuesto(id) {

    Swal.fire({
        title: "¿Eliminar presupuesto?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {

        if (result.isConfirmed) {

            presupuestos = presupuestos.filter(p => p.id !== id);

            guardarStorage();
            mostrarHistorial();

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El presupuesto fue eliminado"
            });
        }
    });
}

const form = document.getElementById("formPresupuesto");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const metros = parseInt(document.getElementById("metros").value);
    const tipo = document.getElementById("tipo").value;
    const sistema = document.getElementById("sistema").value;

    if (isNaN(metros) || metros <= 0) {
        return; 
    }

    const total = calcularPresupuesto(metros, tipo, sistema);

    const nuevo = crearPresupuesto(metros, tipo, sistema, total);

    presupuestos.push(nuevo);

    guardarStorage();

    mostrarResultado(nuevo);
    mostrarHistorial();

    form.reset();
});

async function init() {
    await cargarDatos();
    mostrarHistorial();
}

init();