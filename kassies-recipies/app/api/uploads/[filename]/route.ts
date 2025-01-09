import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest, 
  { params }: { params: Promise<{ filename: string }> }
) {
  const filename = (await params).filename; // Get the dynamic filename
  const filePath = path.join(process.cwd(), 'uploads', filename); // Path to the file
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath); // Read the file
    const mimeType = 'image/jpeg'; // Adjust this for your file types

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
      },
    });
  } else {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
