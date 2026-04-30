"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
    }
}

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
            <div className="flex flex-col items-center pt-6 pb-12 min-h-[calc(100vh-57px)]">
                <motion.div
                    className={style.container}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {recipies.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((recipie) => (
                            <motion.li
                                key={recipie._id}
                                className={style.list}
                                variants={itemVariants}
                                onClick={() => handleOpenRecipie(recipie)}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.15 }}
                            >
                                {recipie.image !== "" && <Image width={52} height={52} sizes='52px' src={`/api/uploads/${recipie.image}`} alt={recipie.image} className={style.image} />}
                                <span className={style.recipeName}>{recipie.name}</span>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.div>
                <Modal title="Add a Recipe" isOpen={isOpen} type={WhichOpen.add}>
                    <AddRecipieForm conversions={conversions} />
                </Modal>
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