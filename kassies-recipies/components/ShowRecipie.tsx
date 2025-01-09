import { recipie } from '@/interfaces'
import React, { useState } from 'react'
import style from '@/styles/Recipie.module.css'
import Image from 'next/image'
import { PencilLine } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from './ui/select'
import ModifyRecipieForm from './ModifyRecipieForm'
import { conversion } from '@/interfaces'

interface RecipieProp {
    recipie: recipie,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    conversions: Array<conversion>
}

const multipliers: Array<number> = [.25, .33, .5, 1, 2, 3, 4, 5, 6]

function ShowRecipie({ recipie, setIsOpen, conversions } : RecipieProp) {

  const [ingMultiplier, setMultiplier] = useState<number>(1);
  const [modMode, setModMode] = useState<boolean>(false);
  const [recipieHere, setRecipie] = useState<recipie>(recipie);

  const handleModify = () => {
    setModMode(true);
  }

  if (modMode) {
    return (
      <ModifyRecipieForm recipie={recipieHere} setIsOpen={setIsOpen} conversions={conversions} setModMode={setModMode} setRecipie={setRecipie} />
    )
  } else {
    return (
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
              <Button variant="outline" className="ml-auto" onClick={handleModify}>
                <PencilLine />
              </Button>
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
    )
  }
}

export default ShowRecipie