import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

interface ModalProps {
    title: String,
    buttonText: String,
    children?: ReactNode
}

export default function Modal( { title, buttonText, children }: ModalProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{buttonText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {/* Pass setIsOpen to child */}
                {children}
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
                </DialogClose>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}