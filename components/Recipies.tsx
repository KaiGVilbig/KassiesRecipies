"use client"

import React, { useEffect, useState } from 'react'
import { recipie } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setRecipies, getRecipies } from '@/redux/features/recipieSlice';
import { setConversions, getConversions } from '@/redux/features/conversionSlice';
import { 
    getSearchParam, 
    getAddConversionIsOpen, 
    getAddRecipieIsOpen, 
    getIsRecipieOpen, 
    setIsRecipieOpen 
} from '@/redux/features/recipieListSlice';
import Modal from './Modal';
import AddRecipieForm from './AddRecipieForm'
import ShowRecipie from './ShowRecipie';
import AddConversion from './AddConversion';
import style from '@/styles/List.module.css'
import Image from 'next/image';
import { WhichOpen } from './enums';

function Recipies() {
    const dispatch = useDispatch<AppDispatch>();
    const recipies = useSelector(getRecipies);
    const conversions = useSelector(getConversions);
    const search = useSelector(getSearchParam);
    const isOpen = useSelector(getAddRecipieIsOpen);
    const isConversionOpen = useSelector(getAddConversionIsOpen);
    const isRecipieOpen = useSelector(getIsRecipieOpen);

    const [gotRecipies, setGotRecipies] = useState<boolean>(false);
    const [gotConversions, setGotConversions] = useState<boolean>(false);
    const [openRecipie, setOpenRecipie] = useState<recipie>(recipies[0]);

    const handleOpenRecipie = (r: recipie) => {
        setOpenRecipie(r);
        dispatch(setIsRecipieOpen(true));
    }

    // const handleSearch = (value: string) => {
    //     setSearch(value);
    // }

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
                dispatch(setConversions(data))
            })
        }

        getRecipies();
    }, [gotRecipies, gotConversions, dispatch])

    return (
        <div className="flex justify-center items-start h-screen p-4">
            <div className='w-[10px]'></div>
            <div className={style.container}>
                {recipies.filter(r => r.name.includes(search)).map((recipie) => (
                    <li key={recipie._id} className={`${style.list} flex justify-start items-start`} onClick={() => handleOpenRecipie(recipie)}>
                        {recipie.image !== "" && <Image width={0} height={0} sizes='100vh' src={`/api/uploads/${recipie.image}`} alt={recipie.image} className={style.image} />}
                        &nbsp;{recipie.name}
                    </li>
                ))}
            </div>
            <Modal title="Add a Recipie" isOpen={isOpen} type={WhichOpen.add}>
                <AddRecipieForm conversions={conversions} />
            </Modal>
            <Modal title="Add a conversion" isOpen={isConversionOpen} type={WhichOpen.conv}>
                <AddConversion />
            </Modal>
            <Modal title={openRecipie?.name} isOpen={isRecipieOpen} type={WhichOpen.show}>
                <ShowRecipie recipie={openRecipie} conversions={conversions} />
            </Modal>
        </div>
    )
}

export default Recipies