const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerPlato, crearPlato, borrarPlato, actualizarPlato, predecirPrueba } = require('../controllers/platos');
const { validarCampos } = require('../middleware/validarcampos');
const { validarJWT } = require('../middleware/validarjwt');

const router = Router();

router.post('/', [
    check('id_suscripcion', 'El argumento id_suscripcion es obligatorio').not().isEmpty().isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().isString(),
    check('calorias', 'El argumento cantidad es obligatorio').not().isEmpty().isNumeric(),
    check('proteinas', 'El argumento proteinas es obligatorio').not().isEmpty().isNumeric(),
    check('carbohidratos', 'El argumento carbohidratos es obligatorio').not().isEmpty().isNumeric(),
    check('grasas', 'El argumento grasas es obligatorio').not().isEmpty().isNumeric(),
    check('imagen', 'El argumento iamgen es obligatorio').not().isEmpty(),
    validarCampos
], crearPlato);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre de usuario es opcional').isString().optional(),
    check('calorias', 'El argumento cantidad es opcional').isNumeric().optional(),
    check('proteinas', 'El argumento proteinas es opcional').isNumeric().optional(),
    check('carbohidratos', 'El argumento carbohidratos es opcional').isNumeric().optional(),
    check('grasas', 'El argumento grasas es opcional').isNumeric().optional(),
    validarCampos
], actualizarPlato);

router.get('/', [
    validarJWT,
    check('id','El id debe ser válido').isMongoId().optional(),
    check('suscripcion','El id debe ser válido').isMongoId().optional(),
    validarCampos
], obtenerPlato);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarPlato);

router.post("/predecir",[

], predecirPrueba)
module.exports = router;
