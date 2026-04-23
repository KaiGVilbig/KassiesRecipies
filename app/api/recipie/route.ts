import { connectMongoRecipies } from "@/utils";
import { Recipie } from "@/models";
import { recipie } from "@/interfaces"
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";

const uploadDir = path.join(process.cwd(), 'uploads');

export const config = {
    api: {
        bodyParser: false
    }
}


export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type')
        let data: any
        
        if (contentType && contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file: File | null = formData.get('image') as unknown as File
            const action = formData.get('action') as unknown as string
            const recipie = formData.get('recipie') as unknown as string
            const oldImage = formData.get('oldImageLocaltion') as unknown as string
            
            if (!action || !recipie) {
                return NextResponse.json({ error: 'Missing action or recipie data' }, { status: 500 })
            }
            
            if (file) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const path = `${uploadDir}/${JSON.parse(recipie).image}`;
                await writeFile(path, buffer);
                console.log(oldImage)
                if (oldImage) {
                    const path = `${uploadDir}/${oldImage}`;
                    await unlink(path);
                }
            }
            
            switch (action) {
                case 'add':
                    return await addRecipie(JSON.parse(recipie));
                case 'modify':
                    return await modifyRecipie(JSON.parse(recipie) as recipie);
            }
        } else {
            data = await req.json();
            const action = data.action
            const recipie = data.id
            
            if (!action || !recipie) {
                return NextResponse.json({ error: 'Missing action or id data' }, { status: 500 })
            }
            
            switch (action) {
                case 'delete':
                    return await deleteRecipie(recipie);
            }
        }
        
        return NextResponse.json({ error: 'Unknown request format' }, { status: 400 })
    } catch (err) {
        return NextResponse.json({ error: `Failed to process the request: ${err}` }, { status: 500 })
    }
}

export async function GET() {
    return await getRecipies();
}

// POST: Add
async function addRecipie(recipieToAdd: any) {
    console.log("here")
    console.log(recipieToAdd)
    console.log('Connecting to DB')
    const db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Sending')
    const sendJSON = recipieToAdd
    const key: string = "_id"
    delete sendJSON[key]
    const recipie = await Recipie.create(sendJSON)
    console.log('Sent')
    db.connection.close()
    return NextResponse.json(
        { message: 'Recipie added successfully', data: recipie },
        { status: 201 }
    )
}

// GET: Get
async function getRecipies() {
    console.log('Connecting to DB');
    const db = await connectMongoRecipies()
    console.log('Connected to DB');
    console.log('Getting recipies');
    const recipie = await Recipie.find({})
    console.log('Got recipies');
    db.connection.close();
    const formatted: Array<recipie> = recipie;

    return NextResponse.json(formatted)
}

// // POST: Modify
async function modifyRecipie(modRecipie: recipie) {

    console.log('Connecting to DB')
    const db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Getting')
    const recipie = await Recipie.findByIdAndUpdate(modRecipie._id, modRecipie, { new: true })
    console.log('Got')
    db.connection.close()
    return NextResponse.json(
        { message: 'Recipie modified successfully', data: recipie },
        { status: 201 }
    )
}

// DELETE: Remove
async function deleteRecipie(recipieId: string) {
    console.log('Connecting to DB')
    const db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Removing')
    const recipie = await Recipie.findByIdAndDelete(recipieId)
    console.log('Removed')
    db.connection.close()

    if (!recipie) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Recipe deleted successfully', data: recipie })
}