import client from "@/lib/prismadb";

export async function getCategories () {
    try {
        const categories = await client.category.findMany({
            select: {
                id: true,
                title: true,
                items: {
                    select: {
                        id: true,
                        imageSrc: true,
                        title: true,
                        price: true,
                        quantity: true,
                        description: true,
                        maxOrder: true,
                        updatedAt: true
                    },
                }
            }
        })

        return categories

    } catch (error) {
        console.log('[SERVER_POST - GET_CATEGORIES]', error)
        return []
    }
}