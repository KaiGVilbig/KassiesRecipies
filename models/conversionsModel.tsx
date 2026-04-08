import {Schema, model, models} from 'mongoose';

const conversionsSchema = new Schema({
    name: { type: String, required: true},
    unit: { type: String, required: true },
    toGrams: { type: Number, required: true }
})

const Conversion = models.Conversion || model('Conversion', conversionsSchema);

export default Conversion;