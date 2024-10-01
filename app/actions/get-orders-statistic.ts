import client from "@/lib/prismadb";

export async function getOrderStatistics() {
    try {
        const [orders, newOrders] = await Promise.all([
            client.cart.findMany({
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    items: true,
                    updatedAt: true,
                },
            }),
            client.cart.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    user: {
                        select: {
                            imageUrl: true,
                            email: true

                        }
                    },
                    amount: true,
                    createdAt: true
                },
                take: 5,
            }),
        ]);

        return { orders, newOrders };
    } catch (error) {
        console.log('[Order Monitoring][Server Error]:', error);   
        return { orders: [], newOrders: [] };
    }
}
