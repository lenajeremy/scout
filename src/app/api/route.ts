import { NextRequest, NextResponse, } from "next/server";


export async function GET(request: NextRequest) {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    return NextResponse.json({ request: request.nextUrl, ...request.json(), timeSent: new Date(), params }, { status: 200 })
}

export async function POST(request: NextRequest) {
    const reader = await request.json()

    return NextResponse.json({ ...reader, timeSent: new Date() }, { status: 200 })
}