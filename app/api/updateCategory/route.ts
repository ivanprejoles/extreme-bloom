import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH (
    req: Request
) {
    try {

        const {
            id,
            title,
        } = await req.json()

        let updatedCategory: any = await client.category.update({
            where: { id },
            data: {
                title,
            },
        });

        return NextResponse.json(updatedCategory)
    } catch (error) {
        console.log('[SERVER_POST - UPDATE_CATEGORY]', error)
        return new NextResponse('[Internal Error][UPDATE_CATEGORY]', {status: 500})
    }
}