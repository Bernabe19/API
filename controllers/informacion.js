const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');
const Plato = require('../models/plato');
const Suscripcion = require('../models/suscripcion');
const Plan = require('../models/plan');

const obtenerEstadisticas = async(req,res) =>{
    const token = req.header('x-token');
    try {
        let numPlatos, numSuscripciones, peso, cantidades;
        const idToken = infoToken(token).uid;
        const usuarioToken = await Usuario.findById(idToken);

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "No se reconoce el token en la cabecera"
            });
        }
        if (!usuarioToken) {
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario con ese id"
            });
        }
        const suscripciones = await Suscripcion.find({id_usuario:idToken}).sort({fecha_inicio:"desc"});
        numPlatos = await Plato.find({id_usuario:idToken}).count();
        numSuscripciones = await Suscripcion.find({id_usuario:idToken}).count();
        peso = suscripciones[0].peso - suscripciones[suscripciones.length - 1].peso;
        cantidades = await Plato.aggregate([
            { $match:{
                id_usuario:usuarioToken._id
                }
            },
            { $group: {
                _id: null,
                calorias:   { $sum: "$calorias" },
                grasas: { $sum: "$grasas" },
                carbohidratos: { $sum: "$carbohidratos" },
                proteinas: { $sum: "$proteinas" },
            }}]);

        if(peso > 0){peso = `+${peso}`;}
        peso = String(peso);
        return res.status(201).json({
            ok: true,
            msg: "Obtención de estadísticas",
            numPlatos,
            numSuscripciones,
            peso,
            cantidades
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener estadísticas'
        });
    }
}

const obtenerTrofeos = async(req,res) =>{
    const token = req.header('x-token');
    try {
        let platosEstadoAnimico, suscripcionesDistintas = 0;
        const idToken = infoToken(token).uid;
        const usuarioToken = await Usuario.findById(idToken);
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "No se reconoce el token en la cabecera"
            });
        }
        if(!usuarioToken){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un usuario con ese id"
                });
        }
        const perder_peso = await Plan.findOne({nombre:"Perder peso"},{_id:1});
        const ganar_peso = await Plan.findOne({nombre:"Ganar peso"},{_id:1});
        const ganar_musculo = await Plan.findOne({nombre:"Ganar músculo"},{_id:1});

        const suscripciones_perder_peso = await Suscripcion.find({$and:[{id_plan:perder_peso._id},{id_usuario:idToken}]},{_id:1});
        const suscripciones_ganar_peso = await Suscripcion.find({$and:[{id_plan:ganar_peso._id},{id_usuario:idToken}]},{_id:1});
        const suscripciones_ganar_musculo = await Suscripcion.find({$and:[{id_plan:ganar_musculo._id},{id_usuario:idToken}]},{_id:1});
        const arraySuscripciones = [suscripciones_perder_peso.length,suscripciones_ganar_peso.length,suscripciones_ganar_musculo.length];
        arraySuscripciones.forEach(cuenta => {
             if(cuenta > 0){
                suscripcionesDistintas += 1;
             } 
        });
        let array_sus_perder_peso = [];
        let array_sus_ganar_peso = [];
        let array_sus_ganar_musculo = [];
        suscripciones_perder_peso.forEach(suscripcion =>{
            array_sus_perder_peso.push(suscripcion._id)
        });
        suscripciones_ganar_peso.forEach(suscripcion =>{
            array_sus_ganar_peso.push(suscripcion._id)
        });
        suscripciones_ganar_musculo.forEach(suscripcion =>{
            array_sus_ganar_musculo.push(suscripcion._id)
        });
        const platos_perder_peso = await Plato.find({$and:[{id_usuario:idToken},{id_suscripcion:{ $in: array_sus_perder_peso}},{grasas:{$lte:8}}]}).count();
        const platos_ganar_peso = await Plato.find({$and:[{id_usuario:idToken},{id_suscripcion:{ $in: array_sus_ganar_peso}},{carbohidratos:{$gte:25}}]}).count();
        const platos_ganar_musculo = await Plato.find({$and:[{id_usuario:idToken},{id_suscripcion:{ $in: array_sus_ganar_musculo}},{proteinas:{$gte:8}}]}).count();
        platosEstadoAnimico = await Plato.find({estado_animico:0}).count();
        return res.status(201).json({
            ok: true,
            msg: "Obtención de trofeos",
            platosEstadoAnimico,
            suscripcionesDistintas,
            platos_perder_peso,
            platos_ganar_peso,
            platos_ganar_musculo
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener trofeos'
        });
    }
}

module.exports = { obtenerEstadisticas, obtenerTrofeos};
