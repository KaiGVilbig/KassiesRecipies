import { z } from "zod"
import { Units } from '@/components/enums'

const ingredients = z.object({
    name: z.string().min(1, "Please enter name of ingredient"),
    value: z.number().gt(0),
    type: z.nativeEnum(Units),
    convAvailable: z.boolean()
})

const instructions = z.object({
    value: z.string().min(1, "Please enter an instruction")
})

const formSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    ingredients: z.array(ingredients),
    instructions: z.array(instructions),
    image: z.string().optional(),
    servings: z.number().gt(0),
    cals: z.number().gt(0)
})

export {
    ingredients,
    instructions,
    formSchema
}