const { Schema, model } = require('mongoose');

const PlatoSchema = Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_suscripcion: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    nombre: {
        type: String,
        required: true,
    },
    calorias: {
        type: Number,
        required: true,
    },
    proteinas: {
        type: Number,
        required: true
    },
    carbohidratos:{
        type: Number,
        required: true
    },
    grasas:{
        type: Number,
        required: true
    },
    imagen:{

    },
    fecha:{
        type: Date,
        default: new Date()
    }
}, { collection: 'platos' });

PlatoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Plato', PlatoSchema);
