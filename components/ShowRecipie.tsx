import { recipie } from '@/interfaces'
import React, { useState } from 'react'
import style from '@/styles/Recipie.module.css'
import Image from 'next/image'
import { PencilLine, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from './ui/select'
import ModifyRecipieForm from './ModifyRecipieForm'
import { conversion } from '@/interfaces'
import { useAppDispatch } from '@/redux/store'
import { deleteRecipie } from '@/redux/features/recipieSlice'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'

interface RecipieProp {
    recipie: recipie,
    conversions: Array<conversion>
}

const multipliers: Array<number> = [.25, .33, .5, 1, 2, 3, 4, 5, 6]

function ShowRecipie({ recipie, conversions }: RecipieProp) {
  const dispatch = useAppDispatch()

  const [ingMultiplier, setMultiplier] = useState<number>(1);
  const [modMode, setModMode] = useState<boolean>(false);
  const [recipieHere, setRecipie] = useState<recipie>(recipie);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleModify = () => {
    setModMode(true);
  }

  const handleDelete = () => {
    setShowDeleteDialog(true);
  }

  const confirmDelete = async () => {
    await fetch('/api/recipie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: recipieHere._id })
    })
    dispatch(deleteRecipie(recipieHere._id))
    setShowDeleteDialog(false)
  }

if (modMode) {
    return (
      <ModifyRecipieForm recipie={recipieHere} conversions={conversions} setModMode={setModMode} setRecipie={setRecipie} />
    )
  }

    return (
     <>
       <div>
         <br />
         <div className="relative">
           {recipieHere.image !== "" && <Image width={0} height={0} sizes='100vh' src={`/api/uploads/${recipieHere.image}`} alt={recipieHere.image} className={style.image} />}
         </div>
         <br />
         <div className="flex justify-start items-start">
           <p className="pr-5">Batch size: </p>
           <Select onValueChange={(e) => setMultiplier(Number(e))}>
             <SelectTrigger className="w-[180px]">
               <SelectValue placeholder={1} />
             </SelectTrigger>
             <SelectContent>
                 {Object.values(multipliers).map((mult, index) => (
                     <SelectItem value={mult.toString()} key={index}>{mult === .25 ? '1/4' : mult === .33 ? '1/3' : mult === .5 ? '1/2' : mult}</SelectItem>
                 ))}
             </SelectContent>
           </Select>
           <div className="flex gap-2">
              <Button variant="outline" className="ml-auto" onClick={handleModify} aria-label="modify recipe">
                <PencilLine />
              </Button>
              <Button variant="destructive" className="ml-auto" onClick={handleDelete} aria-label="delete recipe">
                <Trash2 />
              </Button>
            </div>
         </div><br />
         <p>Servings: {recipieHere.servings * ingMultiplier}</p>
         <p>Calories per serving: {recipieHere.cals}</p><br />
         <h1>Ingredients:</h1>
         {recipieHere.ingredients.map((i) => (
             <p key={i.name}>{i.name} - {i.value * ingMultiplier} {i.type}</p>
         ))}
         <br />
         <h1>Steps:</h1>
         {recipieHere.instructions.map((i, j) => (
             <p key={j} className="mb-2">{j + 1}: {i}</p>
         ))}
       </div>
       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Delete Recipe</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete "{recipieHere.name}"? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
             <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </>
   )
}

export default ShowRecipie