from flask import Flask
from app.views import *
from app.database import *
from flask import render_template

app = Flask(__name__)


# Rutas de la API-REST
#app.route('/', methods=['GET'])(index)
@app.route('/')
def index():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()
    cur.execute(sql, datos)
    conn.commit()
    cur.close()
    conn.close()
    return render_template('index.html')




app.route('/store', methods=["POST"])

def store():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()
    _nombre = request.form["fistname"]
    _apellido = request.form["lastname"]
    _fecha_nacimiento= request.form["fecha de nacimiento"]
    _usuario = request.form["usuario"]
    _email = request.form["email"]
    _destino = request.form["destino"]
    


    sql = "INSERT INTO clientes (nombre, apellido, fecha_nacimiento, usuario, email, destino, actividad) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"
    datos = (_nombre, _apellido,  _fecha_nacimiento, _usuario, _email, _destino)

   
    cur.execute(sql, datos)
    conn.commit()
    cur.close()
    conn.close()


if __name__ == '__main__':
    app.run(debug=True)
    
#create_table_tareas()    
store()
init_app(app)