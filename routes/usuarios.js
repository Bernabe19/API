const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerUsuario, crearUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middleware/validarcampos');
const { validarJWT } = require('../middleware/validarjwt');

const router = Router();

router.post('/', [
    check('nombreUsuario', 'El argumento nombreUsuario es obligatorio').not().isEmpty(),
    check('password', 'El argumento passowrd es obligatorio').not().isEmpty(),
    check('peso', 'El argumento peso es obligatorio').not().isEmpty().isNumeric(),
    check('avatar', 'El argumento avatar es opcional').isString().optional(),
    check('estado_animico', 'El argumento estado_animico es opcional').isNumeric().optional(),
    validarCampos
], crearUsuario);

router.get('/', [
    validarJWT,
    check('nombreUsuario', 'El argumento nombreUsuario es obligatorio').not().isEmpty(),
    check('password', 'El argumento passowrd es obligatorio').not().isEmpty(),
    check('peso', 'El argumento peso es obligatorio').not().isEmpty().isNumeric(),
    check('avatar', 'El argumento avatar es opcional').isString().optional(),
    check('estado_animico', 'El argumento estado_animico es opcional').isNumeric().optional(),
    validarCampos
], obtenerUsuario);



module.exports = router;