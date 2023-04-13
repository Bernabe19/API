const { Schema, model } = require('mongoose');

const SuscripcionSchema = Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    fecha_inicio: {
        type: Date,
        default: new Date(),
    },
    fecha_fin: {
        type: Date,
        default: new Date(),
    },
    peso: {
        type: Number,
    },
    activa:{
        type: Boolean,
        default: true
    }
}, { collection: 'suscripciones' });

SuscripcionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Suscripcion', SuscripcionSchema);
