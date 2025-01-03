"use client"
import React, { useState } from 'react'
import { conversion, ingredient, recipie, recipieForm } from '@/interfaces'
import style from '@/styles/RecipieForm.module.css'
import { addRecipie } from '@/redux/features/recipieSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { formSchema, ingredients, instructions } from '@/interfaces/zRecipies'
import { Units } from '@/components/enums'
import { useForm, FieldErrors, useFieldArray } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import toGrams from './Converter'

interface AddProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    conversions: Array<conversion>
}

const errMsgs: string[] = ["An error has occured on the server", "Too many errors occuring, try again later"]

function addRecipieForm({ setIsOpen, conversions } : AddProps) {
    const dispatch = useDispatch<AppDispatch>();
    console.log(conversions)
    const [error, setError] = useState<number>(0);
    const [forceRefresh, setForceRefresh] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            ingredients: [{ name: "", value: 0, type: Units.g, convAvailable: false }],
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
        const newIngredient = { name: "", value: 0, type: Units.g, convAvailable: false }
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

    const handlePossibleConv = (index: number, unit: Units) => {
        let ing = form.getValues(`ingredients.${index}`);
        
        const found = conversions.find(obj => obj.name === ing.name && obj.unit == unit)
        if (found) {
            form.setValue(`ingredients.${index}.convAvailable`, true);
        } else {
            form.setValue(`ingredients.${index}.convAvailable`, false);
        }
        setForceRefresh(!forceRefresh);
    }

    const handleConvert = (index: number) => {
        let ing: ingredient = form.getValues(`ingredients.${index}`);
        const found = conversions.find(obj => obj.name === ing.name && obj.unit == ing.type)

        if (found && ing.value > 0) {
            let newIng: number = toGrams(ing, found);
            form.setValue(`ingredients.${index}.value`, newIng);
            form.setValue(`ingredients.${index}.type`, Units.g);
            form.setValue(`ingredients.${index}.convAvailable`, false);
        }
        setForceRefresh(!forceRefresh);
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
        await fetch('/api/recipie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'add', recipie})
        }).then(async (res) => {
            // Error handling and closing dialog
            if (res.status === 201) {
                const data = await res.json();
                dispatch(addRecipie(data.data));
                setIsOpen(false);
            } else {
                setError(error + 1);
                if (error >= 2) {
                    setTimeout(() => {
                        setIsOpen(false);
                    }, 1000)
                }
            }
        })
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
                                                    <Input {...form.register(`ingredients.${i}.name` as const, {
                                                        onChange: (e) => {
                                                            form.setValue(`ingredients.${i}.name`, e.target.value.toLowerCase())
                                                        }
                                                    })} />
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
                                                            defaultValue={form.getValues(`ingredients.${i}.type`)}
                                                            onValueChange={(e) => {
                                                                let u = e as keyof typeof Units
                                                                handlePossibleConv(i, Units[u])
                                                                form.setValue(`ingredients.${i}.type`, Units[u])
                                                            }}
                                                            value={form.getValues(`ingredients.${i}.type`)}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder={form.getValues(`ingredients.${i}.type`)} />
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
                                        {form.getValues(`ingredients.${i}.convAvailable`) &&
                                            <Button type="button" variant="outline" onClick={() => handleConvert(i)}>Conver to Grams</Button>
                                        }
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
                                                    className="block w-full !resize-none overflow-hidden rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent "
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
                {error > 0 && 
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{ error < 2 ? errMsgs[0] : errMsgs[1] }</AlertDescription>
                    </Alert>
                }
                <br />
                <div className="flex justify-end items-center space-x-4">
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default addRecipieForm
// FLOZ DOESNT WORK?