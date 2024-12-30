"use client"
import React, { useState, FormEvent } from 'react'
import { recipie, recipieForm } from '@/interfaces'
import style from '@/styles/RecipieForm.module.css'
import { setRecipies } from '@/redux/features/recipieSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

function addRecipieForm(props: recipieForm) {
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <form className={style.form} onSubmit={onSubmit}>

        </form>
    )
}

export default addRecipieForm