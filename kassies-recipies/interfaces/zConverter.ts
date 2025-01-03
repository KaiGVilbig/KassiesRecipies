import { z } from "zod"
import { Units } from '@/components/enums'

const formSchema = z.object({
    name: z.string().min(1, "Please enter an ingredient"),
    unit: z.nativeEnum(Units),
    toGrams: z.number().gt(0, "Number must be greater than 0"),
    isGrams: z.number().gt(0, "Number must be greater than 0")
})

export {
    formSchema
}