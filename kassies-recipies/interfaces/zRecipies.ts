import { z } from "zod"

const ingrdients = z.object({
    name: z.string(),
    value: z.number(),
    type: z.string()
})

const formSchema = z.object({
    name: z.string(),
    ingrdients: z.array(ingrdients),
    instructions: z.array(z.string()),
    image: z.string()
})

export {
    ingrdients,
    formSchema
}