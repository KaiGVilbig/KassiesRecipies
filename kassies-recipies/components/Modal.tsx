import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface ModalProps {
    title: string,
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