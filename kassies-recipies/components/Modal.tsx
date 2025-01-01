import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface ModalProps {
    title: String,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    children?: ReactNode
}

export default function Modal( { title, children, isOpen, setIsOpen }: ModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {children}
            </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}