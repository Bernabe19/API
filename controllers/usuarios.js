const Usuario = require('../models/usuario');

const getUsuario = async(req,res) =>{

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

module.exports = { getUsuario, crearUsuario};