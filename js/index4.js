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

// BOTONES DE FILTRO: vigentes e inactivos
let filtrosButtons = {
    "Activos": document.querySelector("#VerClientesVigentes"),
    "Inactivos": document.querySelector("#VerClientesInactivos"),
    "Todos": document.querySelector("#VerClientesTodos"),
    "Buscar_cliente": document.querySelector("#BuscarIdCliente"), 
    "Registro": document.querySelector("#IrAlRegistro")
}

// CONTENEDOR DE TABLAS
let contenedorTablas = document.querySelector("#customer-body")


// TEMPLATES DE TABLAS
let tablaActivosTemplate = document.querySelector(".tr-activos.template");
let tablaInactivosTemplate = document.querySelector(".tr-inactivos.template");
let tablaTodosTemplate = document.querySelector(".tr-todos.template");



// Verificar que las plantillas existen
if (!tablaActivosTemplate || !tablaInactivosTemplate || !tablaTodosTemplate) {
    console.error("Las plantillas de tablas no se encontraron en el DOM.");
}

// CLONAR TEMPLATES
let tablasTemplate = {
    "Activos": tablaActivosTemplate ? tablaActivosTemplate.cloneNode(true) : null,
    "Inactivos": tablaInactivosTemplate ? tablaInactivosTemplate.cloneNode(true) : null,
    "Todos": tablaTodosTemplate ? tablaTodosTemplate.cloneNode(true): null,

};

// REMOVER TEMPLATES
if (tablaActivosTemplate) tablaActivosTemplate.remove();
if (tablaInactivosTemplate) tablaInactivosTemplate.remove();
if (tablaTodosTemplate) tablaTodosTemplate.remove()
//if (FormularioConsulta) FormularioConsulta.remove();


function mostrarMensaje(mensaje) {
    let mensajeElement = document.createElement('div');
    mensajeElement.classList.add('mensaje');
    mensajeElement.textContent = mensaje;
    document.body.appendChild(mensajeElement);
    
    setTimeout(() => {
        mensajeElement.remove();
    }, 2000);
    ; // Elimina el mensaje después de 3 segundos
}

function actPagRetraso(retraso) {
    setTimeout(() => {
        location.reload();
    }, retraso);
}

// FUNCION INACTIVAR CLIENTES
function inactivarCliente(event) {
    let id_cliente = event.currentTarget.id_cliente;
    let url = `${BASE_URL}/api/clientes/archivados/${id_cliente}`;
    fetchData(url, "DELETE", () => {
        mostrarMensaje("Cliente dado de baja");
        actPagRetraso(1000);
    })

    let vigencia = document.querySelector("#Vigencia")
    if (vigencia !== true){
        vigencia.style.backgroundcolor = "green"}
    
    }



//FUNCION REACTIVAR CLIENTES
function reactivarCliente(event) {
    let id_cliente = event.currentTarget.id_cliente;
    let url = `${BASE_URL}/api/clientes/activos/${id_cliente}`;
    fetchData(url, "PUT", () => {
        mostrarMensaje("Cliente reactivado correctamente");
        actPagRetraso(1000);
    });
}


// FUNCION EDITAR CLIENTE (abre pagina nueva)

function editarCliente(event) {
    let id_cliente = event.currentTarget.id_cliente;
    window.location.replace(`actualiz_clientes.html?id_cliente=${id_cliente}`);
}


// FUNCION TRAER REGISTROS DE CLIENTES
function consultarClientes(clientes_status){
    let fetch_data = {
        'Activos': {
            'URL': BASE_URL + '/api/clientes/activos/', 
            'tablasTemplateName': 'Activos' 
        }, 
        'Inactivos': {
            'URL': BASE_URL + '/api/clientes/archivados/',
            'tablasTemplateName': 'Inactivos'
        }, 
        'Todos': {
            'URL': BASE_URL + '/api/clientes/todos/',
            'tablasTemplateName': 'Todos'
        },
        'Buscar_cliente': {
            'URL': BASE_URL + '/api/clientes/fetch/', 
                'tablasTemplateName': 'Todos' 
            } 
        
    }
    if (!(clientes_status in fetch_data)){
        throw new Error(`El Parametro: ${clientes_status} no está definido!`);
    }
    fetchData(fetch_data[clientes_status].URL, "GET", (data) => {
        let clientes = [];
        for (const Cliente of data) {
            let cliente = tablasTemplate[fetch_data[clientes_status].tablasTemplateName];
            if (!cliente) {
                console.error("La plantilla de tabla no se clonó correctamente.");
                continue;
            }
            cliente = cliente.cloneNode(true);
            cliente.querySelector(".id").innerHTML = Cliente.id_cliente;
            cliente.querySelector(".nombre").innerHTML = Cliente.nombre;
            cliente.querySelector(".apellido").innerHTML = Cliente.apellido;
            cliente.querySelector(".usuario").innerHTML = Cliente.usuario;
            cliente.querySelector(".edad").innerHTML = Cliente.edad;
            cliente.querySelector(".email").innerHTML = Cliente.email;
            cliente.querySelector(".destino").innerHTML = Cliente.destino;
            cliente.querySelector(".actividad").innerHTML = Cliente.actividad;
            cliente.querySelector(".vigencia").innerHTML = Cliente.vigencia;

            if (Cliente.vigencia === false) {
                cliente.classList.add('vigencia-false');
            }
                        
            let editarClienteAction = cliente.querySelector("#Editar");
            let eliminarClienteAction = cliente.querySelector("#Eliminar");
            let reactivarClienteAction = cliente.querySelector("#Reactivar");
            


            if (editarClienteAction) {
                editarClienteAction.addEventListener("click", editarCliente);
                editarClienteAction.id_cliente = Cliente.id_cliente;
            }

            if (eliminarClienteAction) {
                eliminarClienteAction.addEventListener("click", inactivarCliente);
                eliminarClienteAction.id_cliente = Cliente.id_cliente;
            }

            if (reactivarClienteAction) {
                reactivarClienteAction.addEventListener("click", reactivarCliente);
                reactivarClienteAction.id_cliente = Cliente.id_cliente;
            }

            clientes.push(cliente);
        }
        contenedorTablas.replaceChildren(...clientes); //elipsis o js222 desmpaquetador
        
    });
}


// Función para activar filtros
function activarFiltros(event) {
    for (let busqueda in filtrosButtons) {
        filtrosButtons[busqueda].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

    consultarClientes(event.currentTarget.filterName);
}

// Función para inicializar filtros
function filtrar() {
    for (let filtro in filtrosButtons) {
        filtrosButtons[filtro].addEventListener("click", activarFiltros);
        filtrosButtons[filtro].filterName = filtro;
    }
}

//Función de búsqueda por ID
document.querySelector("#BuscarIdCliente").addEventListener("click", function() {
    const id_cliente = document.querySelector("#IdCliente").value;
    const url = `${BASE_URL}/api/clientes/fetch/${id_cliente}`;
    fetchData(url, "GET", (data) => {
        let clientes = [];
        const Cliente = data;
        let cliente = tablasTemplate["Todos"];
        if (!cliente) {
            console.error("La plantilla de tabla no se clonó correctamente.");
        } else {
            cliente = cliente.cloneNode(true);
            cliente.querySelector(".id").innerHTML = Cliente.id_cliente;
            cliente.querySelector(".nombre").innerHTML = Cliente.nombre;
            cliente.querySelector(".apellido").innerHTML = Cliente.apellido;
            cliente.querySelector(".usuario").innerHTML = Cliente.usuario;
            cliente.querySelector(".edad").innerHTML = Cliente.edad;
            cliente.querySelector(".email").innerHTML = Cliente.email;
            cliente.querySelector(".destino").innerHTML = Cliente.destino;
            cliente.querySelector(".actividad").innerHTML = Cliente.actividad;
            cliente.querySelector(".vigencia").innerHTML = Cliente.vigencia;

            if (Cliente.vigencia === false) {
                cliente.classList.add('vigencia-false');
            }

            const editarClienteAction = cliente.querySelector("#Editar");
            const eliminarClienteAction = cliente.querySelector("#Eliminar");
            const reactivarClienteAction = cliente.querySelector("#Reactivar");

            if (editarClienteAction) {
                editarClienteAction.addEventListener("click", editarCliente);
                editarClienteAction.id_cliente = Cliente.id_cliente;
            }

            if (eliminarClienteAction) {
                eliminarClienteAction.addEventListener("click", inactivarCliente);
                eliminarClienteAction.id_cliente = Cliente.id_cliente;
            }

            if (reactivarClienteAction) {
                reactivarClienteAction.addEventListener("click", reactivarCliente);
                reactivarClienteAction.id_cliente = Cliente.id_cliente;
            }

            clientes.push(cliente);
        }
        contenedorTablas.replaceChildren(...clientes);
    });
});


filtrar();
consultarClientes("Todos");


