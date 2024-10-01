// import { create } from "zustand";
// import { itemType } from "./use-items";

// interface cartType {
//     id: string,
//     title: string,
//     price: number,
//     quantity: number,
//     imageSrc: string
// }

// interface useStorage {
//     cart: {[key: string]: cartType},
//     addQuantity: (item: itemType) => void,
//     minusQuantity: (item: itemType) => void,
//     removeItem: (id: string) => void,
//     eraseItems: () => void
// }

// export const useUserStorage = create<useStorage>((set) => ({
//     cart: {},
//     addQuantity: (item) => set((state) => {
//         const { description: desc, ...other } = item;
//         const existingItem = state.cart[other.id];
//         if (existingItem) {
//             return {
//                 ...state,
//                 cart: {
//                     ...state.cart,
//                     [other.id]: {
//                         ...existingItem,
//                         quantity: existingItem.quantity + 1
//                     }
//                 }
//             };
//         } else {
//             return {
//                 ...state,
//                 cart: {
//                     ...state.cart,
//                     [other.id]: {
//                         ...other,
//                         quantity: 1
//                     }
//                 }
//             };
//         }
//     }),    
//     minusQuantity: (item) => set((state) => {
//         const { description: desc, ...other } = item;
//         const existingItem = state.cart[other.id];

//         if (existingItem) {
//             if (existingItem.quantity === 1) {
//                 delete state.cart[other.id];
//                 return { ...state };
//             } else {
//                 return {
//                     ...state,
//                     cart: {
//                         ...state.cart,
//                         [other.id]: {
//                             ...existingItem,
//                             quantity: existingItem.quantity - 1
//                         }
//                     }
//                 };
//             }
//         }
//         return state;
//     }),
//     removeItem: (id) => set((state) => {
//         const newCart = { ...state.cart };
//         delete newCart[id];
//         return { 
//             ...state,
//             cart: newCart
//         };
//     }),
//     eraseItems: () => set((state) => ({
//         ...state,
//         cart: {}
//     })),
// }))
import { create } from "zustand";
import { itemType } from "./use-items";
import { createJSONStorage, persist } from "zustand/middleware";

interface cartType {
    id: string,
    title: string,
    price: number,
    quantity: number,
    imageSrc: string
}

interface useStorage {
    cart: {[key: string]: cartType},
    addQuantity: (item: itemType) => void,
    minusQuantity: (item: itemType) => void,
    removeItem: (id: string) => void,
    eraseItems: () => void
}

const loadCartFromLocalStorage = (): {[key: string]: cartType} => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
};

const saveCartToLocalStorage = (cart: {[key: string]: cartType}) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const useUserStorage = create<useStorage>()(
    persist(
        (set, get) => ({
            cart: {},
            addQuantity: (item) => set((state) => {
                const { description: desc, ...other } = item;
                const existingItem = state.cart[other.id];
                const newCart = existingItem
                    ? {
                        ...state.cart,
                        [other.id]: {
                            ...existingItem,
                            quantity: existingItem.quantity + 1,
                        },
                    }
                    : {
                        ...state.cart,
                        [other.id]: {
                            ...other,
                            quantity: 1,
                        },
                    };
                return { cart: newCart };
            }),
            minusQuantity: (item) => set((state: any) => {
                const { description: desc, ...other } = item;
                const existingItem = state.cart[other.id];
                const newCart = existingItem
                    ? existingItem.quantity === 1
                        ? {
                            ...state.cart,
                            [other.id]: undefined,
                        }
                        : {
                            ...state.cart,
                            [other.id]: {
                                ...existingItem,
                                quantity: existingItem.quantity - 1,
                            },
                        }
                    : state.cart;
                return { cart: newCart };
            }),
            removeItem: (id) => set((state) => {
                const newCart = { ...state.cart };
                delete newCart[id];
                return { cart: newCart };
            }),
            eraseItems: () => set(() => {
                return { cart: {} };
            }),
        }),
        {
            name: "cart-storage", // The key in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);