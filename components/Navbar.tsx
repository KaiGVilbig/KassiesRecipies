"use client"
import React, { useState, useEffect } from "react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { Input } from "./ui/input";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setAddConversionIsOpen } from "@/redux/features/recipieListSlice";
import { setAddRecipieIsOpen } from "@/redux/features/recipieListSlice";
import { setSearchParam } from "@/redux/features/recipieListSlice";
import { Menu } from "lucide-react";

export default function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const [isDarkMode, setIsDarkmode] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const root = window.document.documentElement;
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            root.classList.add("dark");
            setIsDarkmode(true);
        }
    }, [])

    const toggleTheme = () => {
        const root = window.document.documentElement;
        const isDark = root.classList.contains("dark");

        if (isDark) {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkmode(false);
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkmode(true);
        }
    }

     return (
        <nav className="w-full h-auto p-4">
            <div className="flex justify-between items-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FFD93D] bg-clip-text text-transparent">
                                Kassie's Recipes
                            </div>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-auto flex justify-between">
                    <Input type="text" className="px-4 py-3 w-60 search-input" placeholder="Search recipes..." onChange={(e) => dispatch(setSearchParam(e.target.value))} />
                    <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="navbar-button">
                        <Menu />
                    </Button>
                </div>
            </div>
            {isOpen &&
                <div className="ml-auto flex justify-end gap-2 navbar-dropdown">
                    <Button onClick={() => dispatch(setAddRecipieIsOpen(true))} className="btn-primary navbar-action-button">Add Recipe</Button>
                     <Button onClick={() => dispatch(setAddConversionIsOpen(true))} className="btn-secondary navbar-action-button">Add Conversion</Button>
                    <Button onClick={toggleTheme} className="theme-toggle" variant="outline">
                        {isDarkMode ? <Sun /> : <Moon />}
                    </Button>
                </div>
            }
        </nav>
    )
}