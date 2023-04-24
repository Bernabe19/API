const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require("../middleware/validarcampos");
const { obtenerEstadisticas, obtenerTrofeos} = require("../controllers/informacion");
const router = Router();

router.get('/estadisticas', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], obtenerEstadisticas);

router.get('/trofeos', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], obtenerTrofeos);



module.exports = router;
