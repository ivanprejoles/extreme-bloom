import client from '@/lib/prismadb';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { emailId, email, imageUrl } = await req.json();

    // Check if there are any users in the database
    const totalUsers = await client.user.count();

    if (totalUsers === 0) {
      // No users found, create an admin user
      const newAdmin = await client.user.create({
        data: {
          emailId,
          email,
          imageUrl,
          role: MemberRole.ADMIN,
        },
      });
      return NextResponse.json({ message: 'Admin account created', user: newAdmin });
    }

    // Find if the user is an admin
    const adminUser = await client.user.findUnique({
      where: { emailId },
      select: {
        id: true,
        role: true,
      },
    });

    if (adminUser && adminUser.role === MemberRole.ADMIN) {
      return NextResponse.json({ message: 'User is an admin', user: adminUser });
    }

    return NextResponse.json({ message: 'User is not an admin', user: adminUser });
  } catch (error) {
    console.error('[SERVER_POST - ADD_PRODUCTS]', error);
    return new NextResponse('[Internal Error][ADD_PRODUCTS]', { status: 500 });
  }
}
