import { connectMongoRecipies } from "@/utils/connectMongo"
import { Recipie } from "@/models"
import { recipie } from "@/interfaces"

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function getRecipies(req: any, res: any) {

    console.log('Connecting to DB');
    let db = await connectMongoRecipies()
    console.log('Connected to DB');
    console.log('Getting recipies');
    const recipie = await Recipie.find({})
    console.log('Got recipies');
    db.connection.close();
    let formatted: Array<recipie> = recipie;

    res.json({ formatted })
}