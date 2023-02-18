const { Schema, model } = require('mongoose');

const PlanSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    caracteristicas:  {
        type: Array,
        required: true,
    }
}, { collection: 'planes' });

PlanSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Plan', PlanSchema);