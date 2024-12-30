import { ingredient } from '@/interfaces';
import {Schema, model, models} from 'mongoose';

const recipieSchema = new Schema({
    name: { type: String, required: true},
    ingredients: { type: Array<ingredient>, required: true },
    instructions: { type: Array<String>, required: true },
    image: { type: String, required: false }
})

const Recipie = models.Recipie || model('Recipie', recipieSchema);

export default Recipie;