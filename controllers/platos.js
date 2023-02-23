const Usuario = require('../models/usuario');
const { infoToken } = require('../helpers/infotoken');
const Suscripcion = require('../models/suscripcion');
const Plato = require('../models/plato');
const { subirImagen, borrarImagen } = require('../configuracion/configcloudinary');

const obtenerPlato = async(req,res) =>{
    const id = req.query.id;
    const suscripcion = req.query.suscripcion;
    const token = req.header('x-token');
    try {
        let plato, total;
        const idToken = infoToken(token).uid;
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "No se reconoce el token en la cabecera"
            });
        }

        if(id){
            const existePlato = await Plato.findById(id);
            if(!existePlato){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe un plato con ese id"
                });
            }
            if(existePlato.id_usuario.toString() !== idToken){
                return res.status(403).json({
                    ok: false,
                    msg: "Solo el propietario del plato puede acceder"
                });
            }
            [plato, total] = await Promise.all([
                Plato.findById(id),
                Plato.find({id_usuario:idToken}).count() 
            ]);
        }else if(suscripcion){
            const existeSuscripcion = Suscripcion.findById(suscripcion);
            if(!existeSuscripcion){
                return res.status(404).json({
                    ok: false,
                    msg: "No existe una suscripcion con ese id"
                });
            }
            [plato, total] = await Promise.all([
                Plato.find({id_suscripcion : suscripcion}),
                Plato.find({id_suscripcion:suscripcion}).count() 
            ]);
        }else if(!id){
            [plato, total] = await Promise.all([
                Plato.find({id_usuario:idToken}),
                Plato.find({id_usuario:idToken}).count() 
            ]);
        }
        return res.status(201).json({
            ok: true,
            msg: "Obtención de platos",
            plato,
            total
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener plato'
        });
    }
}
const crearPlato = async(req,res) =>{
    const { id_suscripcion, imagen, ...object } = req.body;
    const token = req.header('x-token');
    try {
        const idToken = infoToken(token).uid;
        const existeUsuario = await Usuario.findById(idToken);
        const existeSuscripcion = await Suscripcion.findById(id_suscripcion);
        const suscripcionUsuario = await Suscripcion.findOne({$and:[{ id_usuario : idToken },{ activa : true }]});
        if(!existeUsuario){
            return res.status(404).json({
                ok: false,
                msg: "No existe plato con ese id"
            });
        }
        if(!existeSuscripcion){
            return res.status(404).json({
                ok: false,
                msg: "No existe suscripcion con ese id"
            });
        }
        if(existeSuscripcion._id.toString() !== suscripcionUsuario._id.toString()){
            return res.status(404).json({
                ok: false,
                msg: "No se puede añadir un plato a una suscripcion diferente o inactiva"
            });
        }
        const objetoPlato = {};
        objetoPlato.id_suscripcion = id_suscripcion;
        objetoPlato.id_usuario = idToken;
        objetoPlato.nombre = object.nombre;
        objetoPlato.cantidad = object.cantidad;
        objetoPlato.proteinas = object.proteinas;
        objetoPlato.carbohidratos = object.carbohidratos;
        objetoPlato.grasas = object.grasas;
        const plato = new Plato(objetoPlato);
        const subidaImagen = await subirImagen(imagen);
        plato.imagen = {
            public_id: subidaImagen.public_id,
            secure_url: subidaImagen.secure_url
        }
        await plato.save();
        return res.status(201).json({
            ok: true,
            msg: 'Plato creado correctamente',
            plato
        });   
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Ha habido un error al crear el plato'
        });  
    }

} 

const actualizarPlato = async(req, res = response) => {

    const { ...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');
    try {
        const tokenId = infoToken(token).uid; 
        const existeIdPlato = await Plato.findById(uid);
        const existeUsuarioToken = await Usuario.findById(tokenId);

        if(!existeUsuarioToken){
            return res.status(400).json({
                ok: false,
                msg: 'Id de usuario incorrecto o inexistente en token'
            });
        }
        if(!existeIdPlato){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese id de plato'
            });
        }
        if(existeIdPlato.id_usuario.toString() !== tokenId){
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no puede acceder a este plato'
            });
        }

        if(object.nombre){
            existeIdPlato.nombre = nombre;
        } 
        if(object.cantidad){
            existeIdPlato.cantidad = object.cantidad ;
        }
        if(object.proteinas){
            existeIdPlato.proteinas = object.proteinas ;
        }
        if(object.carbohidratos){
            existeIdPlato.carbohidratos = object.carbohidratos ;
        }
        if(object.grasas){
            existeIdPlato.grasas = object.grasas ;
        }
        const plato = await Plato.findByIdAndUpdate(uid, existeIdPlato, { new: true });
        await plato.save();
        return res.status(201).json({
            ok: true,
            msg: 'Plato actualizado correctamente',
            plato
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar plato'
        });
    }
}

const borrarPlato = async(req, res = response) => {

    const uid = req.params.id;
    const token = req.header('x-token');
        
    try {
        const tokenId = infoToken(token).uid;
        const tokenRol = infoToken(token).rol;
        const existeIdPlato = await Plato.findById(uid);
        const existeIdTokenUsuario = await Usuario.findById(tokenId);
        if(!existeIdPlato){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un plato con ese id'
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
        const public_id = existeIdPlato.imagen.public_id;
        const borrar = await borrarImagen(public_id);
        const resultado = await Plato.findByIdAndRemove(uid);
        return res.status(200).json({
            ok: true,
            msg: 'Plato eliminado',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar plato'
        });
    }
}

module.exports = { obtenerPlato, crearPlato, borrarPlato, actualizarPlato};