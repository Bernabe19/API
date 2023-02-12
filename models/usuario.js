const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    fechaCreacion: {
        type: Date,
        default: new Date()
    },
    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    metodo: {
        type: String,
        default: "normal"
    }
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);