
const precioBase = 980000;
const tiposDeConstruccion = ["Economica", "Estandar", "Premium"];


function solicitarDatos() {
    let metros = parseInt(prompt("Ingrese los metros cuadrados a construir:"));
    
    while ( metros <= 0) {
        metros = parseInt(prompt("Ingrese un número valido de metros cuadrados:"));
    }

    let tipo = prompt(
        "Seleccione el tipo de construcción:\n" +
        "1 - Economica\n" +
        "2 - Estandar\n" +
        "3 - Premium"
    );

    return { metros, tipo };
}


function calcularPresupuesto(metros, tipo) {
    let multiplicador = 1;

    while (tipo != "1" && tipo !== "2" && tipo !== "3") {
        tipo = prompt ("Seleccione el tipo de construccion:\n" +
        "1 - Economica\n" +
        "2 - Estandar\n" +
        "3 - Premium")
    };

    if (tipo === "1") {
        multiplicador = 1;
    } else if (tipo === "2") {
        multiplicador = 1.2;
    } else if (tipo === "3") {
        multiplicador = 1.4;
    } 


    return metros * precioBase * multiplicador;
}


function iniciarPresupuesto() {
    let continuar = true;

    while (continuar) {
        let datos = solicitarDatos();
        let total = calcularPresupuesto(datos.metros, datos.tipo);
        mostrarResultado(datos.metros, datos.tipo, total);

        continuar = confirm("¿Desea realizar otro calculo?");
    }

}


function mostrarResultado(metros, tipo, total) {
    
    alert(
        "Presupuesto estimado:\n" +
        "Metros cuadrados: " + metros + " m2\n" +
        "Costo total estimado: $" + total
    );

    console.log(" PRESUPUESTO ");
    console.log("Metros cuadrados:", metros);
    console.log("Costo total:", total);
}

iniciarPresupuesto();
