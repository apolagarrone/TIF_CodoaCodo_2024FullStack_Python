from app.database import get_db


class Cliente:
    def __init__(self, id_cliente=None, nombre=None, apellido=None, usuario=None, edad=None, email=None, destino=None, actividad=None, vigencia=True,):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.apellido = apellido
        self.usuario = usuario
        self.edad = edad
        self.email = email
        self.destino = destino
        self.actividad = actividad
        self.vigencia = vigencia

    @staticmethod #este decorador permite ejecutar la función cuando aún no hay datos generados.
    def __get_clientes_by_query(query):
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        cliente = []
        for row in rows:
            cliente.append(
                Cliente(
                id_cliente=row[0],
                nombre=row[1],
                apellido=row[2],
                usuario=row[3],
                edad=row[4], 
                email=row[5], 
                destino=row[6],
                actividad=row[7],
                vigencia=row[8]
                )
            )
        cursor.close()
        return cliente
    
    @staticmethod
    def get_all():
        return Cliente.__get_clientes_by_query(
        """ SELECT * 
            FROM clientes 
            ORDER BY id_cliente
        """)
    

    @staticmethod
    def get_all_vigentes():
        return Cliente.__get_clientes_by_query(
        """ SELECT * 
            FROM clientes 
            WHERE vigencia = true
            ORDER BY id_cliente
        """)
    
    @staticmethod
    def get_all_archivados():
        return Cliente.__get_clientes_by_query(
        """ SELECT * 
            FROM clientes 
            WHERE vigencia = False
            ORDER BY id_cliente
        """)


    @staticmethod
    def get_cliente_by_Id(id_cliente):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM clientes WHERE id_cliente = %s", (id_cliente,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return Cliente(
                id_cliente=row[0],
                nombre=row[1],
                apellido=row[2],
                usuario=row[3],
                edad=row[4], 
                email=row[5], 
                destino=row[6],
                actividad=row[7],
                vigencia=row[8]
                
            )
        return None
    
    def get_cliente_by_usuario(usuario):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM clientes WHERE usuario = %s", (usuario,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return Cliente(
                id_cliente=row[0],
                nombre=row[1],
                apellido=row[2],
                usuario=row[3],
                edad=row[4], 
                email=row[5], 
                destino=row[6],
                actividad=row[7],
                vigencia=row[8]
                
            )
        return None

    def save(self):
        db = get_db()
        cursor = db.cursor()
        if self.id_cliente: # Actualizar Tarea existente
            cursor.execute(
            '''
                UPDATE Clientes
                SET nombre = %s, apellido = %s, usuario = %s, edad = %s,  email = %s, destino = %s, actividad = %s, vigencia = %s 
                WHERE id_cliente = %s
            ''',
                (self.nombre, self.apellido, self.usuario, self.edad, self.email, self.destino, self.actividad, self.vigencia, self.id_cliente))
        else: # Crear Tarea nueva
            cursor.execute(
            """
            INSERT INTO Clientes
            (nombre, apellido, usuario, edad, email, destino, actividad, vigencia)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (self.nombre, self.apellido, self.usuario, self.edad, self.email, self.destino, self.actividad, self.vigencia))
            self.id_cliente = cursor.lastrowid
        db.commit()
        cursor.close()
        db.close()


    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("UPDATE Clientes SET vigencia = false WHERE id_cliente = %s", (self.id_cliente,))
        db.commit()
        cursor.close()


    def reactivar(self):
            db = get_db()
            cursor = db.cursor()
            cursor.execute("UPDATE Clientes SET vigencia = true WHERE id_cliente = %s", (self.id_cliente,))
            db.commit()
            cursor.close()


    def serialize(self):
        return {
        'id_cliente': self.id_cliente,
        'nombre': self.nombre,
        'apellido': self.apellido,
        'usuario': self.usuario,
        'edad': self.edad,
        'email': self.email,
        'destino': self.destino,
        'actividad': self.actividad,
        'vigencia': self.vigencia   
    }

