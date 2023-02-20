const Suscripcion = require('../models/suscripcion');
const Plan = require('../models/plan');
const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');

const obtenerSucripcion = async(req,res) =>{
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

const crearSuscripcion = async (req,res) =>{
    const {id_usuario, id_plan, ...object} = req.body;
    const token = req.header('x-token');
    try {
        const idToken = infoToken(token).uid;
        const existeUsuarioToken = await Usuario.findById(idToken);
        const existeUsuarioParam = await Usuario.findById(id_usuario);
        const existePlan = await Plan.findById(id_plan);
        if(!existeUsuarioToken){
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese id Token"
            }); 
        }
        if(!existeUsuarioParam){
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese id Body"
            }); 
        }
        if(id_usuario !== idToken){
            return res.status(403).json({
                ok: false,
                msg: "No puede crear la suscripcion a otro usuario"
            }); 
        }
        if(!existePlan){
            return res.status(404).json({
                ok: false,
                msg: "No existe un plan con ese id"
            }); 
        }
        const existeSuscripcionAnterior = await Suscripcion.findOne({ $and: [ { id_usuario: idToken }, { activa: true} ] });
        console.log(existeSuscripcionAnterior);
        if(existeSuscripcionAnterior){
            existeSuscripcionAnterior.activa = false;
           await Suscripcion.findByIdAndUpdate(existeSuscripcionAnterior._id.toString(), existeSuscripcionAnterior, { new: true });
        }
        const peso = existeUsuarioParam.peso;
        const objetoSuscripcion = {};
        objetoSuscripcion.id_usuario = id_usuario;
        objetoSuscripcion.id_plan = id_plan;
        objetoSuscripcion.peso = peso;
        const suscripcion = new Suscripcion(objetoSuscripcion);
        await suscripcion.save();
        return res.status(201).json({
            ok: true,
            msg: 'Suscripcion creada correctamente',
            suscripcion
        });   
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Ha habido un error al crear la suscripcion'
        });  
    }
}
const borrarSuscripcion = async (req,res) =>{
    const id = req.params.id;
    const token = req.header('x-token');
    try {
        const existeSuscripcion = await Suscripcion.findById(id);
        const idToken = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        const existeIdTokenUsuario = await Usuario.findById(idToken);
        if(!existeIdTokenUsuario){
            return res.status(404).json({
                ok: false,
                msg: "No existe un plan con ese id"
            }); 
        } 
        if(existeIdTokenUsuario.rol !== "admin" || rolToken !== "admin"){
            return res.status(403).json({
                ok: false,
                msg: "Solo un administrador puede borrar un suscripcion"
            }); 
        }
        if(!existeSuscripcion){
            return res.status(404).json({
                ok: false,
                msg: "No existe una suscripcion con ese id"
            }); 
        } 
        const suscripcion = await Suscripcion.findByIdAndRemove(id);
        return res.status(201).json({
            ok: true,
            msg: 'Suscripcion eliminada correctamente',
            suscripcion
        });   
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Ha habido un error al borrar la suscripcion'
        });  
    }

}

module.exports = { obtenerSucripcion, crearSuscripcion, borrarSuscripcion };