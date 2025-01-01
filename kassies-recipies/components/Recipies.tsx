"use client"

import React, { useEffect, useState } from 'react'
import { recipie } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setRecipies, getRecipies } from '@/redux/features/recipieSlice';
import { Button } from "@/components/ui/button"
import Modal from './Modal';
import AddRecipieForm from './AddRecipieForm'
import ShowRecipie from './ShowRecipie';
import style from '@/styles/List.module.css'

function recipies() {
    const dispatch = useDispatch<AppDispatch>();
    const recipies = useSelector(getRecipies);

    const [gotRecipies, setGotRecipies] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openRecipie, setOpenRecipie] = useState<recipie>(recipies[0]);
    const [isRecipieOpen, setIsRecipieOpen] = useState<boolean>(false);

    const handleOpenRecipie = (r: recipie) => {
        setOpenRecipie(r);
        setIsRecipieOpen(true);
    }

    // Get the recipies from the database
    useEffect(() => {
        if (gotRecipies) return;

        const getRecipies = async () => {
            const res = await fetch('/api/recipie', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let ret = res.json().then((data) => {
                console.log(data)
                dispatch(setRecipies(data));
            })
        }
        getRecipies();
        setGotRecipies(true);
    }, [gotRecipies])
    console.log(recipies)
    return (
        <div>
            <Button onClick={() => setIsOpen(true)} variant="outline">Add</Button>
            <Modal title="Add a Recipie" isOpen={isOpen} setIsOpen={setIsOpen}>
                <AddRecipieForm setIsOpen={setIsOpen} />
            </Modal>
            <Modal title={openRecipie?.name} isOpen={isRecipieOpen} setIsOpen={setIsRecipieOpen}>
                <ShowRecipie recipie={openRecipie} />
            </Modal>
            <div className={style.container}>
                {recipies.map((recipie) => (
                    <li key={recipie._id} className={`${style.list}`} onClick={() => handleOpenRecipie(recipie)}>{recipie.name}</li>
                ))}
            </div>
        </div>
    )
}

export default recipies