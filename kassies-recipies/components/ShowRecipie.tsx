import { recipie } from '@/interfaces'
import React from 'react'
import style from '@/styles/Recipie.module.css'
import Image from 'next/image'

interface RecipieProp {
    recipie: recipie
}

function ShowRecipie({ recipie } : RecipieProp) {
  return (
    <div>
        <br />
        {recipie.image !== "" && <Image src={`/api/uploads/${recipie.image}`} alt={recipie.image} className={style.image} />}
        <br />
        <h1>Ingredients:</h1>
        {recipie.ingredients.map((i) => (
            <p key={i.name}>{i.name} - {i.value} {i.type}</p>
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