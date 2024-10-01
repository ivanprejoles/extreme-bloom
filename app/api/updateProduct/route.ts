import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import {cookies} from 'next/headers';

export async function PATCH (
    req: Request
) {
    try {

        
        const {
            id,
            title,
            description,
            categoryId,
            imageSrc,
            quantity,
            price
        } = await req.json()

        let updatedItem: any = await client.item.update({
            where: { id },
            data: {
                title,
                description,
                categoryId,
                imageSrc,
                quantity,
                price
            },
            select: {
                id: true,
                title: true,
                item: {
                    select: {
                    id: true,
                    title: true,
                    },
                },
                imageSrc: true,
                quantity: true,
                price: true,
                maxOrder: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        const {item, ...rest} = updatedItem

        updatedItem = {
            ...rest,
            categoryId: item.id,
            itemTitle: item.title
        }

        return NextResponse.json(updatedItem)
    } catch (error) {
        console.log('[SERVER_POST - UPDATE_PRODUCT]', error)
        return new NextResponse('[Internal Error][UPDATE_PRODUCT]', {status: 500})
    }
}