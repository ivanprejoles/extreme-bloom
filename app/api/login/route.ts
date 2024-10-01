import client from '@/lib/prismadb';
import { NextResponse } from "next/server"

export async function POST (
    req: Request
) {
    try {
        const {
            userId,
            email,
            imageUrl,
        } = await req.json()

        if (!userId || !email || !imageUrl) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        let user = await client.user.findUnique({
            where: {
                emailId: userId,
            },
            select: {
                email: true,
                id: true,
                imageUrl: true
            }
        })

        if (!user) {
            user = await client.user.create({
                data: {
                    email,
                    emailId: userId,
                    imageUrl
                },
                select: {
                    email: true,
                    id: true,
                    imageUrl: true
                }
            })
        }

        const {id, ...other} = user
        return NextResponse.json(other)
    } catch (error) {
        console.log('[SERVER_POST - USER_AUTHENTICATION]', error)
        return new NextResponse('[Internal Error][USER_AUTHENTICATION]', {status: 500})
    }
}