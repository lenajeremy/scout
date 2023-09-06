import { NextRequest, NextResponse, } from "next/server";


export async function GET(request: NextRequest) {
    return NextResponse.json({ request: request.nextUrl,...request.json(), timeSent: new Date() }, { status: 200 })
}

export async function POST(request: NextRequest) {
    const reader = await request.json()
        
    return NextResponse.json({ ...reader, timeSent: new Date() }, { status: 200 })
}