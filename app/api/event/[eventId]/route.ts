import client from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import {cookies} from 'next/headers';

export async function PATCH (
    req: Request,
    { params }: { params: { eventId: string } }
) {
    try {

        const {
            title,
            label,
            imageUrl,
        } = await req.json()

        let updatedItem: any = await client.event.update({
            where: { id: params.eventId },
            data: {
                title,
                description: label,
                imageSrc: imageUrl  
            },
        });

        return NextResponse.json(updatedItem)
    } catch (error) {
        console.log('[SERVER_POST - UPDATE_EVENT]', error)
        return new NextResponse('[Internal Error][UPDATE_EVENT]', {status: 500})
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { eventId: string } }
) {
    try {
  
      const deletedProducts = await client.event.delete({
        where: {
            id: params.eventId
        },
      });
      return NextResponse.json(deletedProducts);
    } catch (error) {
      console.error('[SERVER_DELETE_EVENT]', error);
      return new NextResponse('Internal Error[DELETE_EVENT]', { status: 500 });
    }
}
  