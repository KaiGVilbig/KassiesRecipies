"use client"

import React, { useEffect, useState } from 'react'
import { recipie } from '@/interfaces';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setRecipies } from '@/redux/features/recipieSlice';
import Modal from './Modal';
import AddRecipieForm from './AddRecipieForm'
import style from '@/styles/Modal.module.css'

function recipies() {

    const [recipies, setRecipie] = useState<Array<recipie>>([]);
    const [gotRecipies, setGotRecipies] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleAddRecipie = () => {
        setOpen(true);
    }

    // Get the recipies from the database
    useEffect(() => {
        if (gotRecipies) return;

        const getRecipies = async () => {
            const res = await fetch('/api/recipies/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let ret = res.json().then((data) => {
                console.log(data)
                dispatch(setRecipies(data));
                setRecipie(data)
            })
        }

        setGotRecipies(true);
    }, [recipies, gotRecipies])

    return (
        <div>
            <Modal title="Add a Recipie" buttonText="Add">
                <AddRecipieForm />
            </Modal>
        </div>
    )
}

export default recipies