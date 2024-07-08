let BASE_URL = 'http://localhost:5000';

function fetchData(url, method, callback, data = null) {
    const options = {
        method: method, 
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null, 
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        callback(data);
    })
    .catch(error => console.log("Ocurrió un error " + error))
}

let botonEnviar = document.querySelector("#FormularioRegistro #CrearRegistro");

let params = new URLSearchParams(document.location.search); 
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
    }, 3000);
    ; // Elimina el mensaje después de 3 segundos
}
function redirigirConRetraso(retraso) {
    setTimeout(() => {
        location.reload()
    }, retraso);
}

function crearNuevoCliente(event) {
    
    let datareg = {
        'nombre': document.querySelector("#NombreF").value,
        'apellido': document.querySelector("#Apellido").value,
        'usuario': document.querySelector("#Usuario").value,
        'email': document.querySelector("#Email").value,
        'edad': document.querySelector("#Edad").value,
        'destino': document.querySelector("#Destino").value,
        'actividad': getCheckedValues('Actividad'),
        'vigencia': document.querySelector("#Vigencia").value
    };

    let url = BASE_URL + '/api/clientes/registro/';
    
    fetchData(url, "POST", (response) => {
        mostrarMensaje("Cliente registrado exitosamente");
        redirigirConRetraso(1000);
        document.querySelector("#FormularioRegistro").reset();
    }, datareg);     
}

function add_cliente() {
    if (id_cliente !== null) {
        let url = BASE_URL + '/api/clientes/fetch/' + id_cliente;
        fetchData(url, "GET", (data) => {
            document.querySelector("#Id_Cliente").value = data.id_cliente;
            document.querySelector("#NombreF").value = data.nombre;
            document.querySelector("#Apellido").value = data.apellido;
            document.querySelector("#Usuario").value = data.usuario;
            document.querySelector("#Edad").value = data.edad;
            document.querySelector("#Email").value = data.email;
            document.querySelector("#Vigencia").value = data.vigencia;
            
            // Marcar los checkboxes seleccionados
            let actividades = data.actividad.split(',');
            actividades.forEach((actividad) => {
                let checkbox = document.querySelector(`input[name="Actividad"][value="${actividad.trim()}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            // set_form_readOnly(true);
        });
        alert("El cliente ya se encuentra registrado");

    } else {
        botonEnviar.addEventListener("click", crearNuevoCliente);
    }
}

add_cliente();
