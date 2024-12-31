"use client"
import React, { useState, FormEvent, useRef, useEffect, useCallback } from 'react'
import { ingredient, recipie, recipieForm } from '@/interfaces'
import style from '@/styles/RecipieForm.module.css'
import { setRecipies } from '@/redux/features/recipieSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { formSchema, instructions } from '@/interfaces/zRecipies'
import { Units } from '@/components/enums'
import { useForm, FieldErrors, useFieldArray } from 'react-hook-form'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { NextApiResponse } from 'next'

function addRecipieForm() {
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            ingredients: [{ name: "", value: 0, type: Units.g }],
            instructions: [{ value: "" }],
            image: ""
        }
    })
    const control = form.control;

    // Set up watchers
    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredients } = useFieldArray({
        control,
        name: "ingredients"
    });
    const { fields: instructionFields, append: appendInstructions, remove: removeInstructions } = useFieldArray({
        control,
        name: "instructions"
    });

    // Array controls
    const addIngredient = () => {
        const currentIngredients = form.getValues("ingredients") || [];
        const newIngredient = { name: "", value: 0, type: Units.g }
        form.setValue("ingredients", [...currentIngredients, newIngredient])
    }
    const removeIngredient = (index: number) => {
        const currentIngredients = form.getValues("ingredients");
        const updatedIngredients = currentIngredients.filter((_, i) => i !== index);
        console.log(currentIngredients, updatedIngredients)
        form.setValue("ingredients", updatedIngredients);
    }
    const addInstruction = () => {
        const currentInstructions = form.getValues("instructions") || [];
        const newInstructions = {value: ""}
        form.setValue("instructions", [...currentInstructions, newInstructions])

        // Make sure none of the textareas gets resized
        setTimeout(() => {
            document.querySelectorAll("textarea").forEach((textarea) => {
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;
            })
        })
    }
    const removeInstruction = (index: number) => {
        const currentInstructions = form.getValues("instructions");
        const updatedInstructions = currentInstructions.filter((_, i) => i !== index);
        form.setValue("instructions", updatedInstructions);
    }

    // Automatically change textarea height
    const handleInstrInput = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {

        const textarea = e.target as HTMLTextAreaElement;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Convert from zod recipie object to recipie interface
        let instructs: string[] = values.instructions.map((ins: z.infer<typeof instructions>) => ins.value);
        let recipie: recipie = {
            _id: "",
            name: values.name,
            ingredients: values.ingredients,
            instructions: instructs,
            image: ""
        }

        // Send to database
        const res = await fetch('/api/recipie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'add', recipie})
        })
        console.log(res)
    }

    const onError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
        console.log("Validation errors: ", errors)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Da Yummy's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            {form.formState.errors.name && (
                                <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </FormItem>
                    )}
                /><br />
                <FormField 
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium">Ingredients</h3>
                                <Button type="button" onClick={addIngredient} className="ml-4">Add</Button>
                            </div>
                            {ingredientFields.map((field, i) => (
                                <div key={field.id} className={style.ingredient}>
                                    <Button type="button" onClick={() => removeIngredient(i)} className={style.remove}>-</Button>
                                    <div className={style.spec}>
                                        <FormItem>
                                            <FormControl>
                                                <label>Name
                                                    <Input {...form.register(`ingredients.${i}.name` as const)} />
                                                </label>
                                            </FormControl>
                                            {form.formState.errors.ingredients?.[i]?.name && (
                                                <p className="mt-1 text-sm text-red-500">{form.formState.errors.ingredients?.[i]?.name.message}</p>
                                            )}
                                        </FormItem>
                                        <div className="flex items-center space-x-4">
                                            <FormItem>
                                                <FormControl>
                                                    <label>Amount
                                                        <Input type="number" {...form.register(`ingredients.${i}.value`, { valueAsNumber: true })} />
                                                    </label>
                                                </FormControl>
                                                {form.formState.errors.ingredients?.[i]?.value && (
                                                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.ingredients?.[i]?.value.message}</p>
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <label>Unit
                                                        <Select 
                                                            {...form.register(`ingredients.${i}.type`)}
                                                            defaultValue={field.type}
                                                            onValueChange={(e) => {
                                                                let u = e as keyof typeof Units
                                                                form.setValue(`ingredients.${i}.type`, Units[u])
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder={field.type} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.values(Units).map((type, index) => (
                                                                    <SelectItem value={type} key={index}>{type}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </label>
                                                </FormControl>
                                                {form.formState.errors.ingredients?.[i]?.value && (
                                                    <p className="mt-1 text-sm text-transparent">{form.formState.errors.ingredients?.[i]?.value.message}</p>
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {ingredientFields.length >= 2 ? 
                                <Button type="button" onClick={addIngredient} className="w-full">Add Ingredient</Button> : <></>
                            }
                        </div>
                    )}
                /><br />
                <FormField 
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium">Instructions</h3>
                                <Button type="button" onClick={addInstruction} className="ml-4">Add</Button>
                            </div>
                            {instructionFields.map((field, i) => (
                                <div key={field.id} className={style.instruction}>
                                    <Button type="button" onClick={() => removeInstruction(i)} className={style.remove}>-</Button>
                                    <FormItem >
                                        <FormControl>
                                            <label className={style.label}>{i + 1}:
                                                <textarea 
                                                    {...form.register(`instructions.${i}.value` as const)}
                                                    className="block w-full !resize-none overflow-hidden rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    rows={1}
                                                    onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInstrInput(e, i)}
                                                    placeholder=''
                                                    value={form.watch(`instructions.${i}.value`)}
                                                />
                                            </label>
                                        </FormControl>
                                        {form.formState.errors.instructions?.[i]?.value && (
                                            <p className="mt-1 text-sm text-red-500">{form.formState.errors.instructions?.[i]?.value.message}</p>
                                        )}
                                    </FormItem>
                                </div>
                            ))}
                            {instructionFields.length >= 2 ? 
                                <Button type="button" onClick={addInstruction} className="w-full">Add Instruction</Button> : <></>
                            }
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