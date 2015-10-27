var url = "https://alumnoscurso.azure-mobile.net/Tables/Reserva"; // URL Azure Service Mobile

var modificando = undefined;

// Obtengo objeto reserva
function obtenerObjeto() {
    var obj = {
        nombre: document.getElementById("txtNom").value,
        numero_personas: parseInt(document.getElementById("txtNumPer").value),
        fecha_reserva: document.getElementById("txtFecRev").value
};

    return obj;

}
// Creación de tabla dinamica
function crearTabla(data) {

    var tabla = document.getElementById("datos"); // Obtengo la capa y con InnerHTML pego la salida

    var resultado = "<table border='1'>";

        resultado += "<tr>";
        resultado += "<td><b>Nombre: </b> </td>";
        resultado += "<td><b>Num Personas: </b></td>";
        resultado += "<td><b>Fecha Reserva: </b></td>";
        resultado += "</tr>";

    for (var i = 0; i < data.length; i++) {
        
        resultado += "<tr>";
        resultado += "<td>" + data[i].nombre + "</td>";
        resultado += "<td>" + data[i].numero_personas + "</td>";
        resultado += "<td>" + data[i].fecha_reserva + "</td>";
        resultado +=
        "<td><button class='borrar' type='button' onclick='borrar(\"" +
            data[i].id +
        "\")' >Borrar</button> </td>";
        resultado += "<td><button  type='button' onclick='cargarModificacion(\"" +
           data[i].id +
       "\")' >Modificar</button> </td>";
        resultado += "</tr>";
    }
    resultado += "</table>";
    tabla.innerHTML = resultado; // 
}
function borrar(id) {
    var ajax = new XMLHttpRequest();
    ajax.open("delete", url + "/" + id);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                actualizar();
            }
            else {
                alert("Error!!!!");
            }
        }
    }
    ajax.send(null); // para delete no es necesario enviar ningun objeto

}
function cargarModificacion(id) {
    var ajax = new XMLHttpRequest(); // Crear objeto Ajax
    ajax.open("get", url + "/" + id); // String Method, URL ::: Unicamente abre la conexion, es decir conecta
    ajax.onreadystatechange = function () { // Cuando cambiar mi estado, quiero hacer lo siguiente
        if (ajax.readyState == 4) {// hay 4 estados :
                                    //0: request not initialized 
                                    //1: server connection established
                                    //2: request received 
                                    //3: processing request 
                                    //4: request finished and response is ready

            // Validar estados HTTP
            // 201 = Alta
            // 202
            // 203
            // 204 = recibo estado, pero no hay contenido
            // 205 = Delete OK

            // 404 Forbiden (no encuentra un recurso

            // 500  Error interno de servidor, una excepción interna del software
            // Fallo en la programación, Not Found, Null Pointer Exception
            // 300 Codigo de Redirección
            if (ajax.status >= 200 && ajax.status < 300) { // Si todo ha ido bien
                var data = JSON.parse(ajax.responseText); //  responseText regresa un String, JSON.parse recibe unicamente String
                document.getElementById("txtNom").value = data.nombre;
                document.getElementById("txtNumPer").value = data.numero_personas;
                document.getElementById("txtFecRev").value = data.fecha_reserva;
                modificando = data.id;
            }
            else {
                alert("Error!!!!");
            }
        }
    }
    ajax.send(null); // GET es una petición sin datos
                    // PUT y PATCH se agrega un objeto


}
function ejecutarModificacion() {
    var ajax = new XMLHttpRequest();
    ajax.open("PATCH", url + "/" + modificando);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                actualizar();

            }
            else {
                alert("Error!!!!");
            }
        }
    }
    var data = obtenerObjeto();
    data.id = modificando;
    ajax.send(JSON.stringify(data));
}
function actualizar() {
    modificando = undefined;
    var ajax = new XMLHttpRequest();
    ajax.open("get", url);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                var data = JSON.parse(ajax.responseText);
                crearTabla(data);
            }
            else {
                alert("Error!!!!");
            }
        }
    }
    ajax.send(null);
}

function add() {
    var ajax = new XMLHttpRequest(); // Preparar la petición ajax
    ajax.open("post", url); // usamos POST para insertar dato
    ajax.setRequestHeader("Content-Type", "application/json"); // manda una cabecera de petición adicional, es decir indicando el formato de envio contenido JSON
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {// Si todo ha ido bien
                actualizar();

            }
            else {
                alert("Error!!!!");
            }
        }
    }
    // Para el transporte HTTP solo puede transportar en formato Texto
    ajax.send(JSON.stringify(obtenerObjeto())); //  Transformar de JSON a formato Texto Plano (RAW)

}

document.getElementById("btnAct").onclick = actualizar;
document.getElementById("btnUpdate").onclick = function () {
    if (modificando != undefined)
        ejecutarModificacion();
    else
        add();
};