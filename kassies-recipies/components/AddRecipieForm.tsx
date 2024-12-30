"use client"
import React, { useState, FormEvent } from 'react'
import { ingredient, recipie, recipieForm } from '@/interfaces'
import style from '@/styles/RecipieForm.module.css'
import { setRecipies } from '@/redux/features/recipieSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { formSchema } from '@/interfaces/zRecipies'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

function addRecipieForm() {
    const dispatch = useDispatch<AppDispatch>();

    const [ingreds, setIngreds] = useState<Array<ingredient>>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Yummy yum",
            ingrdients: [],
            instructions: [],
            image: ""
        }
    })

    const ingredients = form.watch("ingrdients", []);
    const instructions = form.watch("instructions", []);

    const addIngredient = () => {
        const currentIngredients = form.getValues("ingrdients") || [];
        const newIngredient = { name: "", value: 0, type: "" }
        form.setValue("ingrdients", [...currentIngredients, newIngredient])
    }
    const addInstruction = () => {
        const currentInstructions = form.getValues("instructions") || [];
        const newInstructions = ""
        form.setValue("instructions", [...currentInstructions, newInstructions])
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        

        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Da Yummy's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="ingrdients"
                    render={({ field }) => (
                        <div>
                            <h3>Ingredients</h3>
                            <Button onClick={addIngredient}>Add</Button>
                            {ingredients.map((_, i) => (
                                <div key={i}>
                                    <FormItem>
                                        {/* <FormLabel>ingredients</FormLabel> */}
                                        <FormControl>
                                            <label>Name
                                                <Input {...form.register(`ingrdients.${i}.name` as const)} />
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <label>Amount
                                                <Input type="number" {...form.register(`ingrdients.${i}.value` as const)} />
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <label>Unit
                                                <Input {...form.register(`ingrdients.${i}.type` as const)} />
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                </div>
                            ))}
                        </div>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <div>
                            <h3>Instructions</h3>
                            <Button onClick={addInstruction}>Add</Button>
                            {instructions.map((_, i) => (
                                <div key={i}>
                                    <FormItem>
                                        <FormControl>
                                            <label>{i + 1}:
                                                <Input {...form.register(`instructions.${i}` as const)} />
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                </div>
                            ))}
                        </div>
                    )}
                />
                <br />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default addRecipieForm