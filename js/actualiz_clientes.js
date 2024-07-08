let BASE_URL = 'http://localhost:5000';

let botonEnviar = document.querySelector("#FormularioActualizacion #ActualizarRegistro");

let params = new URLSearchParams(document.location.search); // buscar en la dirección si tiene id o no, en función de eso irá a editar o crear
let id_cliente = params.get("id_cliente");

function getCheckedValues(checkboxName) {
    let checkboxes = document.querySelectorAll(`input[name="${checkboxName}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

function mostrarMensaje(mensaje) {
    let mensajeElement = document.createElement('div');
    mensajeElement.classList.add('mensaje');
    mensajeElement.textContent = mensaje;
    document.body.appendChild(mensajeElement);
    
    setTimeout(() => {
        mensajeElement.remove();
    }, 1000);
    ; // Elimina el mensaje después de 3 segundos
}
function redirigirConRetraso(url, retraso) {
    setTimeout(() => {
        window.location.replace(url);
    }, retraso);
}

function actualizar_registro(event) {

    let dataActualizar = {
        'id_cliente': id_cliente,

        'nombre': document.querySelector("#NombreF").value,
        'apellido': document.querySelector("#Apellido").value,
        'usuario': document.querySelector("#Usuario").value,
        'email': document.querySelector("#Email").value,
        'edad': document.querySelector("#Edad").value,
        'destino': document.querySelector("#Destino").value,
        'actividad': document.querySelector("#Actividades").value,
        'vigencia': document.querySelector("#Vigencia").value
    };

    let url = BASE_URL + '/api/clientes/actualizar/' + id_cliente;

    fetchData(url, "PUT", (response) => {
        document.querySelector("#FormularioActualizacion").reset();
        mostrarMensaje("Datos actualizados correctamente");
        redirigirConRetraso("index4.html", 1000);
        
        
    }, dataActualizar);
}



function actualizar() {
    if (id_cliente !== null) {

        let url = BASE_URL + '/api/clientes/fetch/' + id_cliente;
        fetchData(url, "GET", (data) => {
            document.querySelector("#Id_Cliente").value = data.id_cliente;
            document.querySelector("#NombreF").value = data.nombre;
            document.querySelector("#Apellido").value = data.apellido;
            document.querySelector("#Usuario").value = data.usuario;
            document.querySelector("#Edad").value = data.edad;
            document.querySelector("#Email").value = data.email;
            document.querySelector("#Actividades").value = data.actividad;
            document.querySelector("#Vigencia").value = data.vigencia;

        });

        botonEnviar.addEventListener("click", actualizar_registro);
    } 
}




actualizar();



