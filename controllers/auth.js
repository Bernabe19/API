const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { infoToken } = require('../helpers/infotoken');
const jwt = require('jsonwebtoken');


const token = async(req, res = response) => {

    const token = req.header("x-token");

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;
        const nuevoToken = await generarJWT(uid, rol);
        return res.status(200).json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombreUsuario: usuarioBD.nombreUsuario,
            peso: usuarioBD.peso,
            estado_animico: usuarioBD.estado_animico,
            rol: rolBD,
            avatar: usuarioBD.avatar,
            token: nuevoToken
        });
    } catch {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    }
}


const login = async(req, res = response) => {

    const { nombreUsuario, password } = req.body;

    try {

        const usuarioBD = await Usuario.findOne({ nombreUsuario: nombreUsuario });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: '',
                infoAux: "nombreUsuario"
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: '',
                infoAux: "password"
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        return res.status(200).json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}

const confirmarUsuarioLogeado = async(req, res) => {
    const token = req.header('x-token');
    try {
        if (!token) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el token enviado',
            });
        }
        const uid = infoToken(token).uid;
        return res.status(200).json({
            ok: true,
            msg: 'Usuario logeado confirmado',
            id: uid
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al confirmar usuario logeado',
        });
    }
}

module.exports = { login , token, confirmarUsuarioLogeado};