import { Cart } from '@prisma/client';
import client from "@/lib/prismadb";
import { GetItemsSchema } from '@/lib/validation';

export async function getOrders(input: GetItemsSchema) {
    const { page, per_page, sort, status, operator } = input;
  
    try {
      const offset = (page - 1) * per_page;
      const [column, order] = (sort?.split(".").filter(Boolean) ?? ["createdAt", "desc"]) as [keyof Cart | undefined, "asc" | "desc" | undefined];
      const select =  {
        id: true,
        status: true,
        items: true,
        amount: true,
        user: {
            select: {
                email: true,
                number: true,
                facebook: true,
                imageUrl: true,
                role: true,
            }
        },
        createdAt: true,
        updatedAt: true
      }
  
      const where: any = {
        // title: title ? { contains: title, mode: 'insensitive' } : undefined,
        status: status ? status : undefined,
        // priority: priority ? priority : undefined,
        // createdAt: {
        //   gte: from ? new Date(from) : undefined,
        //   lte: to ? new Date(to) : undefined,
        // },
      };
  
      const data = await client.cart.findMany({
        skip: offset,
        take: per_page,
        where,
        orderBy: column && order ? { [column]: order } : { updatedAt: 'desc' },
        select
      });
  
      const newData = data.map(({ user, ...rest }) => ({
        ...rest,
        email: user.email,
        facebook: user.facebook,
        number: user.number,
        imageSrc: user.imageUrl,
        role: user.role
      }));

      const total = await client.cart.count({ where });
  
      const pageCount = Math.ceil(total / per_page);
      return { data: newData, pageCount };
    } catch (err) {
      console.error("[Product_Table][Server Error]: ",err);
      return { data: [], pageCount: 0 };
    }
}

export async function getTaskCountByStatus() {
    try {
      return await client.cart.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
      });
    } catch (err) {
      console.error(err);
      return [];
    }
}

  