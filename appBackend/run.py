from flask import Flask
from app.views import *
from app.database import *
from flask_cors import CORS

app = Flask(__name__)

init_app(app)
CORS(app)

#Rutas de la API-REST
app.route('/', methods=['GET'])(index)

app.route('/api/clientes/activos/', methods=['GET'])(get_clientes_vigentes)
app.route('/api/clientes/archivados/', methods=['GET'])(get_clientes_archivados)
app.route('/api/clientes/todos/', methods=['GET'])(get_clientes_todos)

app.route('/api/clientes/fetch/<int:id_cliente>', methods=['GET'])(get_cliente)
app.route('/api/clientes/fetch/usuario', methods=['GET'])(get_cliente_by_usuario)

app.route('/api/clientes/registro/', methods=['POST'])(registrar_cliente)

app.route('/api/clientes/actualizar/<int:id_cliente>', methods=['PUT'])(actualizar_datos_cliente) #va a la nueva pagina
app.route('/api/clientes/archivados/<int:id_cliente>', methods=['DELETE'])(baja_cliente)
app.route('/api/clientes/activos/<int:id_cliente>', methods=['PUT'])(reactivar_cliente)



if __name__ == '__main__':
    app.run(debug=True)

