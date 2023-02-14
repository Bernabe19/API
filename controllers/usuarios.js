const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');
const fs = require('fs');

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
            if(idToken !== id && usuarioToken.rol !== "Admin"){
                return res.status(403).json({
                    ok: false,
                    msg: "No puede acceder a la información de otro usuario"
                });
            }
            [usuario, total] = await Promise.all(
                await Usuario.findById(id),
                await Usuario.count() 
            );
        }else if(!id){
            if(rolToken !== "Admin" || usuarioToken.rol !== "Admin"){
                return res.status(403).json({
                    ok: false,
                    msg: 'Acción permitida solo a Adminsitrador'
                });
            }
            [usuario, total] = await Promise.all(
                await Usuario.find(),
                await Usuario.count() 
            );
        }
        return res.status(201).json({
            ok: true,
            msg: "Se ha creado el usuario",
            usuario,
            total
        });
    } catch (error) {
        console.log(error.msg);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener usuario'
        });
    }
}
const crearUsuario = async(req,res) =>{
    const { nombreUsuario, password, ...object } = req.body;
    try {
        const usuario = new Usuario(req.body);
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

module.exports = { obtenerUsuario, crearUsuario};