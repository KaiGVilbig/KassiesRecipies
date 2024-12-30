import { connectMongoRecipies } from "@/utils";
import { Recipie } from "@/models";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function addRecipie(req: any, res: any) {

    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Sending')
    let sendJSON = req.body.formData
    let key: string = "_id"
    delete sendJSON[key]
    const recipie = await Recipie.create(sendJSON)
    console.log('Sent')
    db.connection.close()
    res.json({ recipie })
}