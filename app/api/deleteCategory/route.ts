import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function DELETE (
    req: Request
) {
    try {

        const {
            id,
        } = await req.json()

        console.log(id)

        let updatedCategory: any = await client.category.delete({
            where: { id},
        });

        return NextResponse.json(updatedCategory)
    } catch (error) {
        console.log('[SERVER_POST - UPDATE_CATEGORY]', error)
        return new NextResponse('[Internal Error][UPDATE_CATEGORY]', {status: 500})
    }
}