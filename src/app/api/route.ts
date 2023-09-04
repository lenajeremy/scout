import { NextRequest, NextResponse, } from "next/server";


export async function GET(request: NextRequest) {
    console.log(typeof request.nextUrl)
    return NextResponse.json({ request: request.nextUrl, timeSent: new Date() }, { status: 400 })
}

export async function POST(request: NextRequest) {
    console.log(request.body)
    console.log(request.nextUrl.searchParams)
    return NextResponse.json({ ...request.body, timeSent: new Date() }, { status: 200 })
}