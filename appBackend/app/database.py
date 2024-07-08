import os
import psycopg2
from flask import g
from dotenv import load_dotenv
# Cargar variables de entorno desde el archivo .env
load_dotenv()
# Configuración de la base de datos usando variables de entorno

DATABASE_CONFIG = {
'user': os.getenv('DB_USERNAME'),
'password': os.getenv('DB_PASSWORD'),
'host': os.getenv('DB_HOST'),
'database': os.getenv('DB_NAME'),
'port': os.getenv('DB_PORT', 5432)
}

def create_tabla_clientes():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()
    cur.execute(
    '''
        CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        usuario VARCHAR(10) NOT NULL
        edad INTEGER, NOT NULL
        email VARCHAR(60) NOT NULL, 
        destino VARCHAR(50) NOT NULL ,
        actividad VARCHAR(200) NOT NULL,
        vigencia BOOLEAN NOT NULL,
        CONSTRAINT unique_email UNIQUE (email)
        );
    '''

    #     -- Crear la función para calcular la edad
    #     CREATE OR REPLACE FUNCTION calcular_edad() RETURNS TRIGGER AS $$
    #     BEGIN
    #         NEW.edad := date_part('year', age(NEW.fecha_nacimiento));
    #         RETURN NEW;
    #     END;
    #     $$ LANGUAGE plpgsql;

    #     -- Crear el trigger que utiliza la función calcular_edad
    #     CREATE TRIGGER trigger_calcular_edad
    #     BEFORE INSERT OR UPDATE ON clientes
    #     FOR EACH ROW
    #     EXECUTE FUNCTION calcular_edad();
    # """
)
    conn.commit()
    cur.close()
    conn.close()

# #función de prueba de carga de clientes
# def crear_cliente():
#     conn = psycopg2.connect(**DATABASE_CONFIG)
#     cur = conn.cursor()
#     cur.execute(
#     """
#         INSERT INTO clientes (nombre, apellido, fecha_nacimiento, usuario, email, destino, actividad) VALUES
#         ('Maria', 'Gómez', '1985-10-23', 'mariagomez', 'apolagarrone@gmail.com', 'misiones', 'vela'),
#         ('Luis', 'gimenez', '2000-01-01', 'gimenezluis', 'apolagarrone@gmail.com', 'misiones', 'vela'),
#         ('Paola', 'Garrone', '1974-03-06', 'polilla', 'apolagarrone@gmail.com', 'misiones', 'patin');
#     """
# )
#     conn.commit()
#     cur.close()
#     conn.close()




    # Función para obtener la conexión a la base de datos
def get_db():
# Si 'db' no está en el contexto global de Flask 'g'
    if 'db' not in g:
# Crear una nueva conexión a la base de datos y guardarla en 'g'
        g.db = psycopg2.connect(**DATABASE_CONFIG)
# Retornar la conexión a la base de datos
    return g.db

# Función para cerrar la conexión a la base de datos
def close_db(e=None):
# Extraer la conexión a la base de datos de 'g' y eliminarla
    db = g.pop('db', None)
# Si la conexión existe, cerrarla
    if db is not None:
        db.close()

# Función para inicializar la aplicación con el manejo de la base de datos
def init_app(app):
# Registrar 'close_db' para que se ejecute al final del contexto de la aplicación
    app.teardown_appcontext(close_db)