import Ingrdient from './ingredient'

export default interface recipie {
    _id: String,
    name: String,
    ingredients: Array<Ingrdient>,
    instructions: Array<String>,
    image: String
}