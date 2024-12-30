import { connectMongoRecipies } from "@/utils/connectMongo"
import { Recipie } from "@/models"

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function removeTime(req: any, res: any) {

    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Removing')
    // const recipie = await Recipie.remove({ _id: req.body.id })
    console.log('Removed')
    db.connection.close()

    // res.json({ recipie })
}