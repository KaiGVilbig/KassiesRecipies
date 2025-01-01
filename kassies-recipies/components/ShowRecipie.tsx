import { recipie } from '@/interfaces'
import React from 'react'

interface RecipieProp {
    recipie: recipie
}

function ShowRecipie({ recipie } : RecipieProp) {
  return (
    <div>
        <h1>Ingredients:</h1>
        {recipie.ingredients.map((i) => (
            <p key={i.name}>{i.name} - {i.value} {i.type}</p>
        ))}
        <br />
        <h1>Steps:</h1>
        {recipie.instructions.map((i, j) => (
            <p key={j}>{j + 1}: {i}</p>
        ))}
    </div>
  )
}

export default ShowRecipie