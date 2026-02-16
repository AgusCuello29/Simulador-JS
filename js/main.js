
const precioBase = 1015000;
let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];



function calcularPresupuesto(metros, tipo) {
    let multiplicador = 1;

    if (tipo === "2") multiplicador = 1.2;
    if (tipo === "3") multiplicador = 1.4;

    return metros * precioBase * multiplicador;
}

// Objeto
function crearPresupuesto(metros, tipo, total) {
    return {
        id: Date.now(),
        metros: metros,
        tipo: tipo,
        total: total,
        fecha: new Date().toLocaleString()
    };
}

function obtenerNombreTipo(tipo) {
    if (tipo === "1") return "Económica";
    if (tipo === "2") return "Estándar";
    if (tipo === "3") return "Premium";
}

// Muestra resultado 
function mostrarResultado(presupuesto) {
    const divResultado = document.getElementById("resultado");

    divResultado.innerHTML = `
        <p><strong>Metros:</strong> ${presupuesto.metros} m2</p>
        <p><strong>Tipo:</strong> ${obtenerNombreTipo(presupuesto.tipo)}</p>
        <p><strong>Total estimado:</strong> $${presupuesto.total.toLocaleString()}</p>
    `;
}


function mostrarHistorial() {
    const lista = document.getElementById("historial");
    lista.innerHTML = "";

    presupuestos.forEach(p => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${p.fecha} - ${p.metros}m2 - $${p.total.toLocaleString()}
            <button onclick="eliminarPresupuesto(${p.id})">Eliminar</button>
        `;

        lista.appendChild(li);
    });

    mostrarTotalGeneral();
}


function mostrarTotalGeneral() {
    const total = presupuestos.reduce((acumulador, p) => acumulador + p.total, 0);

    document.getElementById("totalGeneral").textContent =
        "Total acumulado presupuestado: $" + total.toLocaleString();
}


function eliminarPresupuesto(id) {
    presupuestos = presupuestos.filter(p => p.id !== id);

    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));

    mostrarHistorial();
}


document.getElementById("formPresupuesto").addEventListener("submit", function(e) {
    e.preventDefault();

    const metros = parseInt(document.getElementById("metros").value);
    const tipo = document.getElementById("tipo").value;

    if (metros <= 0) return;

    const total = calcularPresupuesto(metros, tipo);

    const nuevoPresupuesto = crearPresupuesto(metros, tipo, total);

    presupuestos.push(nuevoPresupuesto);

    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));

    mostrarResultado(nuevoPresupuesto);
    mostrarHistorial();

    this.reset();
});

mostrarHistorial();
