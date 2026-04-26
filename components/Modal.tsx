import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, { ReactNode } from "react"
import { WhichOpen } from "./enums"
import { setAddConversionIsOpen, setAddRecipieIsOpen, setIsRecipieOpen } from "@/redux/features/recipieListSlice"
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

interface ModalProps {
    title: string,
    isOpen: boolean,
    type: WhichOpen,
    children?: ReactNode,
    className?: string
}

export default function Modal( { title, children, isOpen, type, className }: ModalProps) {

    const dispatch = useDispatch<AppDispatch>();

    const handleOpenChange = (open: boolean) => {
        switch(type) {
            case WhichOpen.conv:
                dispatch(setAddConversionIsOpen(open));
                break;
            case WhichOpen.show:
                dispatch(setIsRecipieOpen(open));
                break;
            case WhichOpen.add:
                dispatch(setAddRecipieIsOpen(open));
                break;
        }
    }

      return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className={`sm:max-w-md overflow-y-scroll max-h-[90vh] ${className || ""}`} onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        )
}