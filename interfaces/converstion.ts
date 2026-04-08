import { Units } from "@/components/enums"

export default interface conversion {
    _id: string,
    name: string,
    unit: Units
    toGrams: number
}