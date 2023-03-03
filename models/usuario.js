const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    fecha_creacion: {
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
        type: String,
        default: "avatar1"
    },
    rol: {
        type: String,
        default: "usuario"
    },
    peso:{
        type: Number,
        required: true
    },
    estado_animico:{
        type: Number,
        default: 5
    },
    objetivo:{
        type: Number,
        default: 4
    }
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);