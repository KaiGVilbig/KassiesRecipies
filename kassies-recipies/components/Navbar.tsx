"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useState, useEffect } from "react"
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
    const [isDarkMode, setIsDarkmode] = useState<boolean>(false);

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
        <nav className="w-full h-10 p-2 flex justify-between items-center">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        Kassie's Yummy Recipies
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Button onClick={toggleTheme} className="ml-auto p-2 bg-gray-200 dark:bg-gray-700 rounded-lg" variant="outline">
                {isDarkMode ? <Sun /> : <Moon />}
            </Button>
        </nav>
    )
}