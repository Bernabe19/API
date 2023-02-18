const Plan = require('../models/plan');
const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');

const obtenerPlan = async(req,res) =>{
    const id = req.query.id;
    const token = req.header('x-token');
    try {
       const idToken = infoToken(token).uid;
       const existeUsuarioToken = await Usuario.findById(idToken);
       if(!existeUsuarioToken){
        return res.status(404).json({
            ok: false,
            msg: "No existe un usuario con ese id"
        });
       }
       let total, plan;
       if(id){
        plan = await Plan.findById(id);
        if(!plan){
            return res.status(404).json({
                ok: false,
                msg: "No existe un plan con ese id"
            });
        }
       }else{
        plan = await Plan.find();
       }
       total = await Plan.count()
       return res.status(201).json({
        ok: true,
        msg: "Obtención de planes",
        plan,
        total
       });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "Hubo un error al obtener plan"
        });
    }
}

const crearPlan = async(req,res) =>{
    const token = req.header('x-token');
    const { nombre, descripcion, caracteristicas } = req.body;
    try {
        const idToken = infoToken(token).uid;
        const rolToken = infoToken(token).rol;
        const existeUsuarioToken = await Usuario.findById(idToken);
        const existePlan = await Plan.findOne({ nombre : nombre});
        if(!existeUsuarioToken){
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese id"
            });
        }
        if(existePlan){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un plan con ese nombre'
            });
        }
        if(rolToken !== "admin" || existeUsuarioToken.rol !== "admin"){
            return res.status(403).json({
                ok: false,
                msg: "Solo el Adminsitrador puede crear un plan"
            }); 
        }
        const objetoPlan = {};
        objetoPlan.nombre = nombre;
        objetoPlan.descripcion = descripcion;
        objetoPlan.caracteristicas = caracteristicas;
        const plan = new Plan(objetoPlan);
        await plan.save();
        return res.status(201).json({
            ok: true,
            msg: 'Plan creado correctamente',
            plan
        });   
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Hubo un error al crear plan'
        });
    }
}

const actualizarPlan = async(req,res) =>{
    const { nombre, descripcion, caracteristicas } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid; 
        const tokenRol = infoToken(token).rol;
        const existePlan = await Plan.findOne({ nombre: nombre });
        const existeIdPlan = await Plan.findById(uid);
        const existeUsuarioToken = await Usuario.findById(tokenId);

        if(!existeUsuarioToken){
            return res.status(400).json({
                ok: false,
                msg: 'Id de usuario incorrecto o inexistente en token'
            });
        }
        if(!existeIdPlan){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un plan con ese id'
            });
        }
        if (existePlan) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un plan con ese nombre'
                });
        }
        if(tokenRol !== "admin" || existeUsuarioToken.rol !== "admin" ){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        if(nombre){
            existeIdPlan.nombre = nombre;
        } 
        if(descripcion){
            existeIdPlan.descripcion = descripcion ;
        }
        if(caracteristicas){
            existeIdPlan.caracteristicas = caracteristicas ;
        }
        const plan = await Plan.findByIdAndUpdate(uid, existeIdPlan, { new: true });
        await plan.save();
        return res.status(201).json({
            ok: true,
            msg: 'Plan actualizado correctamente',
            plan
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar plan'
        });
    }
}

const borrarPlan = async(req,res) =>{
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid; 
        const tokenRol = infoToken(token).rol;
        const existeIdPlan = await Plan.findById(uid);
        const existeUsuarioToken = await Usuario.findById(tokenId);
        if(!existeUsuarioToken){
            return res.status(400).json({
                ok: false,
                msg: 'Id de usuario incorrecto o inexistente en token'
            });
        }
        if(!existeIdPlan){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un plan con ese id'
            });
        } 
        if(tokenRol !== "admin" || existeUsuarioToken.rol !== "admin" ){
            return res.status(403).json({
                ok: false,
                msg: 'No está autorizado a acceder a este recurso'
            });
        }
        const resultado = await Plan.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Plan eliminado',
            resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al borrar plan'
        });
    }
}

module.exports = { obtenerPlan, crearPlan, actualizarPlan, borrarPlan};