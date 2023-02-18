const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerUsuario, crearUsuario, actualizarUsuario, borrarUsuario, cambiarContrasena } = require('../controllers/usuarios');
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
    check('id','El id debe ser válido').isMongoId().optional(),
    validarCampos
], obtenerUsuario);

router.put('/:id', [
    validarJWT,
    check('nombreUsuario', 'El argumento nombre de usuario es opcional').isString().optional(),
    check('avatar', 'El argumento avatar es opcional').isString().optional(),
    check('peso', 'El argumento peso es opcional').isNumeric().optional(),
    check('estado_animico', 'El argumento estado_animico es opcional').isNumeric().optional(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

router.post('/nuevaContrasena', [
    validarJWT,
    check('contrasenaActual', 'El campo contrasenaAntigua es obligatoria').not().isEmpty(),
    check('contrasenaNueva', 'La contraseña nueva es obligatoria').not().isEmpty(),
    check('contrasenaNuevaRepite', 'La confirmación de la contraseña nueva es obligatoria').not().isEmpty(),
    validarCampos
], cambiarContrasena)

module.exports = router;