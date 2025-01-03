import { connectMongoRecipies } from "@/utils";
import { Conversion } from "@/models";
import { conversion } from "@/interfaces"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { action, conversion } = data;
        console.log(action, conversion)
        if (!action || !conversion) {
            return NextResponse.json({ error: 'Missing action or recipie data' }, { status: 500 })
        }

        switch (action) {
            case 'add':
                return await addConversion(conversion);
        }
    } catch (err) {
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 })
    }
}

export async function GET() {
    return await getConversions();
}

// POST: Add
async function addConversion(conversionToAdd: any) {
    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Sending')
    let sendJSON = conversionToAdd
    let key: string = "_id"
    delete sendJSON[key]
    const conv = await Conversion.create(sendJSON)
    console.log('Sent')
    db.connection.close()
    return NextResponse.json(
        { message: 'Conversion added successfully', data: 'conv' },
        { status: 201 }
    )
}

// GET: Get
async function getConversions() {
    console.log('Connecting to DB');
    let db = await connectMongoRecipies()
    console.log('Connected to DB');
    console.log('Getting recipies');
    const conv = await Conversion.find({})
    console.log('Got recipies');
    db.connection.close();
    let formatted: Array<conversion> = conv;

    return NextResponse.json(formatted)
}

// POST: Modify
async function modifyRecipie(req: any, res: any) {

    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Getting')
    const recipie = await Conversion.findOne(req.body, async (err: any, recipie: any) => {
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

// DELETE: Remove
async function removeRecipie(req: any, res: any) {

    console.log('Connecting to DB')
    let db = await connectMongoRecipies()
    console.log('Connected to DB')
    console.log('Removing')
    // const recipie = await Recipie.remove({ _id: req.body.id })
    console.log('Removed')
    db.connection.close()

    // res.json({ recipie })
}