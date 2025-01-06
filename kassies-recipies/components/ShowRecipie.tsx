import { recipie } from '@/interfaces'
import React, { useState } from 'react'
import style from '@/styles/Recipie.module.css'
import Image from 'next/image'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from './ui/select'

interface RecipieProp {
    recipie: recipie
}

const multipliers: Array<number> = [.25, .33, .5, 1, 2, 3, 4, 5, 6]

function ShowRecipie({ recipie } : RecipieProp) {

  const [ingMultiplier, setMultiplier] = useState<number>(1);

  return (
    <div>
        <br />
        <div className="relative">
          {recipie.image !== "" && <Image width={0} height={0} sizes='100vh' src={`/api/uploads/${recipie.image}`} alt={recipie.image} className={style.image} />}
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
          </Select><br />
        </div>
        <p>Servings: {recipie.servings * ingMultiplier}</p>
        <p>Calories per serving: {recipie.cals}</p><br />
        <h1>Ingredients:</h1>
        {recipie.ingredients.map((i) => (
            <p key={i.name}>{i.name} - {i.value * ingMultiplier} {i.type}</p>
        ))}
        <br />
        <h1>Steps:</h1>
        {recipie.instructions.map((i, j) => (
            <p key={j} className="mb-2">{j + 1}: {i}</p>
        ))}
    </div>
  )
}

export default ShowRecipie