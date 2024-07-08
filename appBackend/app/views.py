from flask import jsonify, request
from app.models import *
from datetime import date
from flask_cors import CORS

def index():
    return jsonify({'message': 'Hello Word API TODO Lists'})

#consultar clientes vigentes
def get_clientes_vigentes():
    clientes = Cliente.get_all_vigentes()
    return jsonify([cliente.serialize() for cliente in clientes])


#consultar clientes dados de baja.
def get_clientes_archivados():
    clientes = Cliente.get_all_archivados()
    return jsonify([cliente.serialize()for cliente in clientes])

#consultar todos los clientes
def get_clientes_todos():
    clientes = Cliente.get_all()
    return jsonify([cliente.serialize() for cliente in clientes])



#Consultar cliente por Id_cliente
def get_cliente(id_cliente):
    cliente = Cliente.get_cliente_by_Id(id_cliente)
    if not cliente:
        return jsonify({'message':'cliente inexistente'}), 404
    return jsonify(cliente.serialize())

def get_cliente_by_usuario(usuario):
    cliente = Cliente.get_cliente_by_usuario(usuario)
    if not cliente:
        return jsonify({'messaje':'el nombre de usuario está disponible'}),
    return jsonify(cliente.serialize())

# CREAR cliente REVISAR 

def registrar_cliente():
    data = request.json
    nuevo_cliente = Cliente(
        nombre=data['nombre'],
        apellido=data['apellido'],
        usuario=data['usuario'],
        edad=data['edad'],
        email=data['email'],
        destino=data['destino'],
        actividad=data['actividad'],
        vigencia=True
    )
    nuevo_cliente.save()
    return jsonify({'message': 'Registro exitoso'}), 201


#Actualizar DaTOS DE CLIENTES.
def actualizar_datos_cliente(id_cliente):
    cliente = Cliente.get_cliente_by_Id(id_cliente)
    if not cliente:
        return jsonify({'message':'cliente inexistente'}), 404
    
    data = request.json
    cliente.nombre=data['nombre']
    cliente.apellido=data['apellido']
    cliente.usuario=data['usuario']
    cliente.edad=data['edad']
    cliente.email=data['email']
    cliente.destino=data['destino']
    cliente.actividad=data['actividad']
    cliente.vigencia=True
    
    cliente.save()
    return jsonify({'message':'Registro actualizado correctamente'})




# Dar de baja clientes (Delete)
def baja_cliente(id_cliente):
    cliente = Cliente.get_cliente_by_Id(id_cliente)
    if not cliente:
        return jsonify({'message':'cliente inexistente'}), 404
    cliente.delete()
    return jsonify({'message':'Cliente dado de baja correctamente'})



# Reactivar clientes (UPDATE)   

def reactivar_cliente(id_cliente):
    cliente = Cliente.get_cliente_by_Id(id_cliente)
    if not cliente: 
        return jsonify({"message": "cliente inexistente"}), 404
    cliente.reactivar()
    return jsonify({'message': 'Task updated successfully'})



    