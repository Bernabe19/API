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
    rol: {
        type: String,
        default: "usuario"
    },
    peso:{
        type: Number,
        required: true
    },
    estado_animico:{
        type: Number
    },
    objetivo:{
        type: Number,
        required:true
    }
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);
