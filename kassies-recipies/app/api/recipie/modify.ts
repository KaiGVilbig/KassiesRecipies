import { connectMongoRecipies } from "@/utils/connectMongo"
import { Recipie } from "@/models"

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

// Needs work
export default async function modifyTime(req: any, res: any) {

    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Getting')
    const recipie = await Recipie.findOne(req.body, async (err: any, recipie: any) => {
        if (err) return;

        recipie.name = req.body.name;
        recipie.ingredients = req.body.ingredients;
        recipie.instructions = req.body.instructions;

        await recipie.save()
    })
    console.log('Got')
    db.connection.close()

    res.json({ recipie })
}