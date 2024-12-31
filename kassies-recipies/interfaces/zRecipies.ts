import { z } from "zod"
import { Units } from '@/components/enums'

const ingredients = z.object({
    name: z.string(),
    value: z.number(),
    type: z.nativeEnum(Units)
})

const instructions = z.object({
    value: z.string()
})

const formSchema = z.object({
    name: z.string(),
    ingredients: z.array(ingredients),
    instructions: z.array(instructions),
    image: z.string()
})

export {
    ingredients,
    formSchema
}