const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerSuscripcion, crearSuscripcion, borrarSuscripcion } = require('../controllers/suscripciones');
const { validarCampos } = require('../middleware/validarcampos');
const { validarJWT } = require('../middleware/validarjwt');

const router = Router();

router.get('/', [
    validarJWT,
    check('id','El id debe ser válido').isMongoId().optional(),
    check('fecha1','La fecha1 es opcional').optional(),
    check('fecha2','La fecha2 es opcional').optional(),
    validarCampos
], obtenerSuscripcion);

router.post('/', [
    validarJWT,
    check('id_usuario', 'El argumento id_usuario es obligatorio').not().isEmpty().isMongoId(),
    check('id_plan', 'El argumento id_plan es obligatorio').not().isEmpty().isMongoId(),
    validarCampos
], crearSuscripcion);



router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarSuscripcion);

module.exports = router;