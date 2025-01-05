"use client"

import React, { useEffect, useState } from 'react'
import { recipie } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setRecipies, getRecipies } from '@/redux/features/recipieSlice';
import { setConversions, getConversions } from '@/redux/features/conversionSlice';
import { Button } from "@/components/ui/button"
import Modal from './Modal';
import AddRecipieForm from './AddRecipieForm'
import ShowRecipie from './ShowRecipie';
import AddConversion from './AddConversion';
import style from '@/styles/List.module.css'

function Recipies() {
    const dispatch = useDispatch<AppDispatch>();
    const recipies = useSelector(getRecipies);
    const conversions = useSelector(getConversions);

    const [gotRecipies, setGotRecipies] = useState<boolean>(false);
    const [gotConversions, setGotConversions] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openRecipie, setOpenRecipie] = useState<recipie>(recipies[0]);
    const [isRecipieOpen, setIsRecipieOpen] = useState<boolean>(false);
    const [isConversionOpen, setIsConversionOpen] = useState<boolean>(false);

    const handleOpenRecipie = (r: recipie) => {
        setOpenRecipie(r);
        setIsRecipieOpen(true);
    }

    // Get the recipies and conversions from the database
    useEffect(() => {
        if (gotRecipies) return;

        const getRecipies = async () => {
            const res = await fetch('/api/recipie', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            res.json().then((data) => {
                console.log(data)
                dispatch(setRecipies(data));
                setGotRecipies(true);
                getConversions();
                setGotConversions(true);
            })
        }
        if (gotConversions) return;

        const getConversions = async () => {
            const res = await fetch('/api/conversion', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            res.json().then((data) => {
                console.log(data)
                dispatch(setConversions(data))
            })
        }

        getRecipies();
    }, [gotRecipies, gotConversions, dispatch])

    return (
        <div className="flex justify-center items-start h-screen p-4">
            <div className='w-[10px]'></div>
            <div className={style.container}>
                {recipies.map((recipie) => (
                    <li key={recipie._id} className={`${style.list}`} onClick={() => handleOpenRecipie(recipie)}>{recipie.name}</li>
                ))}
            </div>
            <div className="w-[10px] flex flex-col items-end space-y-4 mr-10">
                <Button onClick={() => setIsOpen(true)} variant="outline">Add Recipie</Button>
                <Button onClick={() => setIsConversionOpen(true)} variant="outline">Add Conversion</Button>
            </div>
            <Modal title="Add a Recipie" isOpen={isOpen} setIsOpen={setIsOpen}>
                <AddRecipieForm setIsOpen={setIsOpen} conversions={conversions} />
            </Modal>
            <Modal title="Add a conversion" isOpen={isConversionOpen} setIsOpen={setIsConversionOpen}>
                <AddConversion setIsOpen={setIsConversionOpen} />
            </Modal>
            <Modal title={openRecipie?.name} isOpen={isRecipieOpen} setIsOpen={setIsRecipieOpen}>
                <ShowRecipie recipie={openRecipie} />
            </Modal>
        </div>
    )
}

export default Recipies