const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerPlan, crearPlan, actualizarPlan, borrarPlan } = require('../controllers/planes');
const { validarCampos } = require('../middleware/validarcampos');
const { validarJWT } = require('../middleware/validarjwt');

const router = Router();

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty(),
    check('caracteristicas', 'El argumento caracteristicas es obligatorio').not().isEmpty(),
    validarCampos
], crearPlan);

router.get('/', [
    validarJWT,
    check('id','El id debe ser válido').isMongoId().optional(),
    validarCampos
], obtenerPlan);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es opcional').optional(),
    check('descripcion', 'El argumento descripcion es opcional').optional(),
    check('caracteristicas', 'El argumento caracteristicas es opcional').optional(),
    validarCampos
], actualizarPlan);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarPlan);

module.exports = router;