import { NextResponse } from "next/server";

export async function GET() {
    return await getRecipies();
}

// GET: Get
async function getRecipies() {
    return NextResponse.json({status: 200})
}
