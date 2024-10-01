import { NextResponse } from 'next/server';
import client from '@/lib/prismadb';

export async function DELETE(req: Request) {
  try {
    // Parse the request body to get the product IDs
    const {
        orders
    } = await req.json();

    // Use Prisma's deleteMany to delete products by their IDs
    const deletedOrders = await client.cart.deleteMany({
      where: {
        id: { in: orders },  // 'in' is used to match any of the IDs in the array
      },
    });

    return NextResponse.json(deletedOrders);
  } catch (error) {
    console.error('[SERVER_DELETE_ORDERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
