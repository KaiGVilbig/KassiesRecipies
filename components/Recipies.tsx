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
    const [openRecipie, setOpenRecipie] = useState<recipie | null>(null);

    const handleOpenRecipie = (r: recipie) => {
        setOpenRecipie(r);
        dispatch(setIsRecipieOpen(true));
    }

    useEffect(() => {
        if (!openRecipie || !gotRecipies) return;
        if (!recipies.find(r => r._id === openRecipie._id)) {
            dispatch(setIsRecipieOpen(false));
            setOpenRecipie(null);
        }
    }, [recipies, openRecipie, gotRecipies, dispatch])

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
                <div className={`${style.container} backdrop-blur-lg`}>
                    {recipies.filter(r => r.name.includes(search)).map((recipie) => (
                        <li key={recipie._id} className={`${style.list} flex justify-start items-start dark:bg-[#0f0c29] dark:border-purple-500/30 dark:text-gray-100`} onClick={() => handleOpenRecipie(recipie)}>
                            {recipie.image !== "" && <Image width={64} height={64} sizes='64px' src={`/api/uploads/${recipie.image}`} alt={recipie.image} className={style.image} />}
                            <span className={`${style.recipeName} text-gray-800 dark:text-gray-100`}>{recipie.name}</span>
                        </li>
                    ))}
                </div>
                <Modal title="Add a Recipe" isOpen={isOpen} type={WhichOpen.add}>
                    <AddRecipieForm conversions={conversions} />
                </Modal>
                <style>{`
                  .add-button {
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                  }
                  .dark .add-button {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
                  }
                `}</style>
                <Modal title="Add a conversion" isOpen={isConversionOpen} type={WhichOpen.conv}>
                    <AddConversion />
                </Modal>
                {openRecipie && (
                    <Modal title={openRecipie.name} isOpen={isRecipieOpen} type={WhichOpen.show}>
                        <ShowRecipie recipie={openRecipie} conversions={conversions} />
                    </Modal>
                )}
            </div>
        )
}

export default Recipies