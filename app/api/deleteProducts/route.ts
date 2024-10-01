import { NextResponse } from 'next/server';
import client from '@/lib/prismadb';

export async function DELETE(req: Request) {
  try {
    // Parse the request body to get the product IDs
    const {
        products
    } = await req.json();

    // Use Prisma's deleteMany to delete products by their IDs
    const deletedProducts = await client.item.deleteMany({
      where: {
        id: { in: products },  // 'in' is used to match any of the IDs in the array
      },
    });
    console.log(deletedProducts)

    return NextResponse.json(deletedProducts);
  } catch (error) {
    console.error('[SERVER_DELETE_PRODUCTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
