import { create } from "zustand";

interface categoryProps {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useCategoryModal = create<categoryProps>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))