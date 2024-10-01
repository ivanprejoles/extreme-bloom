import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface itemType {
    id: string,
    imageSrc: string,
    title: string,
    price: number,
    quantity: number,
    description: string,
    maxOrder: number,
    updatedAt: Date
}

interface categoryType {
    id: string,
    title: string,
    imageSrc: string
}

export interface itemCategoryType {
    items: itemType[],
    current: number,
    end: number,  
}

interface useItems {
    category: categoryType[],
    items: {[key: string]: itemCategoryType},
    onAddCategory: (category: categoryType[]) => void,
    onAddItem: (item: itemType, category: string) => void,
    onAddItems: (items: {[key: string]: itemCategoryType}) => void,
}

export const useItemsStore = create<useItems>(
    // persist(
        (set) => ({
            category: [],
            items: {},
            onAddCategory: (category) => set((state) => ({
                ...state,
                category: [...state.category, ...category]
            })),
            onAddItem: (item, category) => set((state) => ({
                ...state,
                items: {
                    ...state.items,
                    [category] : {
                        ...state.items[category],
                        ...item
                    }
                }
            })),
            onAddItems: (items) => set((state) => ({
                ...state,
                items
            }))
        })
    //     {
    //         name: "item-store",
    //         storage: {
    //             getItem: (name) => {
    //                 const item = localStorage.getItem(name);
    //                 if (item) {
    //                     const parsed = JSON.parse(item);
    //                     return {
    //                         ...parsed,
    //                         state: {
    //                             ...parsed.state,
    //                             category: parsed.state.category,
    //                             items: parsed.state.items
    //                         }
    //                     };
    //                 }                                                                                                   
    //                 return null;
    //             },
    //             setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    //             removeItem: (name) => localStorage.removeItem(name),
    //         },
    //     }
    // )
)