import client from "@/lib/prismadb";
import { NextResponse } from 'next/server';

export async function POST (
    req: Request
) {  
    try {
        const {
            id
        } = await req.json()

      const information = await client.user.findUnique({
        where: {
            emailId: id
        },
        select: {
          id: true,
          role: true,
          email: true,
          facebook: true,
          number: true,
          createdAt: true,
          carts: {
            select: {
              id: true,
              status: true,
              items: true,
              amount: true,
              updatedAt: true,
              createdAt: true
            }
          }
        }
      })

      if (!information?.carts) {
        return NextResponse.json({ orders: [], information });
      }

      const { carts, ...others} = information
  
      return NextResponse.json({ orders: information?.carts, information: others });
    } catch (error) {
      console.error("[Server Error][User_Info]: ", error);
      return new NextResponse('[Internal Error][GET_INFO]', {status: 500});
    }
}