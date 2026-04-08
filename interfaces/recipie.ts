import Ingrdient from './ingredient'

export default interface recipie {
    _id: string,
    name: string,
    ingredients: Array<Ingrdient>,
    instructions: Array<string>,
    image: string,
    servings: number,
    cals: number
}