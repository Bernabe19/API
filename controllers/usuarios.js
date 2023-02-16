const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');
const fs = require('fs');
const bcrypt = require('bcryptjs')

const obtenerUsuario = async(req,res) =>{
    const id = req.query.id;
    const token = req.header('x-token');
    try {
        let usuario, total;
        const idToken = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        const usuarioToken = await Usuario.findById(idToken);

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "No se reconoce el token en la cabecera"
            });
        }

        if(id){
            const usuarioParam = await Usuario.findById(id);
            if(!usuarioParam){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
            }
            if(idToken !== id && usuarioToken.rol !== "admin"){
                return res.status(403).json({
                    ok: false,
                    msg: "No puede acceder a la información de otro usuario"
                });
            }
            [usuario, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.count() 
            ]);
        }else if(!id){
            if(rolToken !== "admin" || usuarioToken.rol !== "admin"){
                return res.status(403).json({
                    ok: false,
                    msg: 'Acción permitida solo a Adminsitrador'
                });
            }
            [usuario, total] = await Promise.all([
                Usuario.find(),
                Usuario.count() 
            ]);
        }
        return res.status(201).json({
            ok: true,
            msg: "Obtención de usuarios",
            usuario,
            total
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuario'
        });
    }
}
const crearUsuario = async(req,res) =>{
    const { nombreUsuario, password, ...object } = req.body;
    try {
        const existeUsuario = await Usuario.findOne({nombreUsuario: nombreUsuario});
        if(existeUsuario){
            return res.status(404).json({
                ok: false,
                msg: "Ya existe un usuario con ese nombre de usuario"
            });
        }
        const salt = bcrypt.genSaltSync();
        const encPassword = bcrypt.hashSync(password,salt);

        const objetoUsuario = {};
        objetoUsuario.nombreUsuario = nombreUsuario;
        objetoUsuario.peso = object.peso;
        objetoUsuario.rol = "usuario";
        objetoUsuario.password = encPassword;
        if(object.estado_animico){
            objetoUsuario.estado_animico = object.estado_animico;
        }
        if(object.avatar){
            objetoUsuario.avatar = object.avatar;
        }
        const usuario = new Usuario(objetoUsuario);
        await usuario.save();
        return res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario
        });   
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Ha habido un error al crear el usuario'
        });  
    }

} 

const actualizarUsuario = async(req, res = response) => {

    const { nombreUsuario, ...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid; 
        const tokenRol = infoToken(token).rol;
        const existeUsuario = await Usuario.findOne({ nombreUsuario: nombreUsuario });
        const existeIdUsuario = await Usuario.findById(uid);
        const existeUsuarioToken = await Usuario.findById(tokenId);

        if(!existeUsuarioToken){
            return res.status(400).json({
                ok: false,
                msg: 'Id de usuario incorrecto o inexistente en token'
            });
        }

        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }

        if (existeUsuario) {
            if (existeUsuario._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Nombre de usuario ya existe'
                });
            }
        }
        if(uid !== tokenId && tokenRol !== "admin" ){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }

        if(nombreUsuario){
            existeIdUsuario.nombreUsuario = nombreUsuario;
        } 
        if(object.avatar){
            existeIdUsuario.avatar = object.avatar ;
        }
        if(object.peso){
            existeIdUsuario.peso = object.peso ;
        }
        if(object.estado_animico){
            existeIdUsuario.estado_animico = object.estado_animico ;
        }
        const usuario = await Usuario.findByIdAndUpdate(uid, existeIdUsuario, { new: true });
        await usuario.save();
        return res.status(201).json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar usuario'
        });
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header('x-token');
        
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdUsuario = await Usuario.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario'
            });
        }
        if(!existeIdTokenUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Id de usuario en cabecera'
            });
        }
        if(uid !== tokenId && tokenRol !== "admin"){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        //Borrar entidades y archivos asociados a un usuario
        
        
        const resultado = await Usuario.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar usuario'
        });
    }
}

module.exports = { obtenerUsuario, crearUsuario, actualizarUsuario, borrarUsuario};