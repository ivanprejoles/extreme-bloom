import { Item } from '@prisma/client';
import client from "@/lib/prismadb";
import { GetItemsSchema } from '@/lib/validation';

export async function getProducts(input: GetItemsSchema) {
  const { page, per_page, sort, status } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column = "createdAt", order = "desc"] = sort?.split(".") as [keyof Item, "asc" | "desc"];

    // Simplified select query
    const select = {
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
    };

    // Define the filtering conditions
    const where: any = {
      status: status || undefined, // Only filter if `status` is provided
    };

    // Fetch the items with pagination
    const data = await client.item.findMany({
      skip: offset,
      take: per_page,
      where,
      orderBy: { [column]: order },
      select,
    });

    // Count total items that match the `where` condition
    const total = await client.item.count({ where });

    // Map the data into the desired shape
    const newData = data.map(({ item, ...rest }) => ({
      ...rest,
      categoryId: item?.id ?? null,
      itemTitle: item?.title ?? null,
    }));

    const pageCount = Math.ceil(total / per_page);

    // Return the final data and page count
    return { data: newData, pageCount };
  } catch (err) {
    console.error("[Product_Table][Server Error]: ", err);
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
