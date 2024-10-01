import client from "@/lib/prismadb";

export async function getCategoryStatistics() {
    try {
        const [category, updates] = await Promise.all([
            client.category.findMany({
                select: {
                    id: true,
                    title: true,
                    _count: {
                        select: {
                            items: true,
                        },
                    },
                },
            }),
            client.item.findMany({
                orderBy: {
                    updatedAt: 'desc',
                },
                select: {
                    imageSrc: true,
                    title: true,
                    price: true,
                    item: {
                        select: {
                            title: true,
                        },
                    },
                },
                take: 5,
            }),
        ]);

        return { category, updates };
    } catch (error) {
        console.log('[Product_Categories][Server Error]:', error);   
        return { category: [], updates: [] };
    }
}
