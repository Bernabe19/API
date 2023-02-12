const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuario, crearUsuario } = require('../controllers/usuarios');

const router = Router();

router.post('/', [
    check('nombreUsuario', 'El argumento nombreUsuario es obligatorio').not().isEmpty(),
    check('password', 'El argumento passowrd es obligatorio').not().isEmpty()
], crearUsuario);



module.exports = router;