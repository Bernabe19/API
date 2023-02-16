const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require("../middleware/validarcampos");
const { login, token, confirmarUsuarioLogeado} = require("../controllers/auth");
const router = Router();

router.post('/', [
    check('nombreUsuario', 'El argumento nombreUsuario es obligatorio').not().isEmpty(),
    check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], token);

router.get('/confirmarUsuarioLogeado', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], confirmarUsuarioLogeado);



module.exports = router;