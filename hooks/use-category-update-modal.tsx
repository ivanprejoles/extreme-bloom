import { create } from "zustand";

interface itemProps {
    title: string,
    id: string
}

interface categoryProps {
    data: itemProps
    isOpen: boolean,
    onOpen: (data: itemProps) => void,
    onClose: () => void,
}

export const useCategoryUpdateModal = create<categoryProps>((set) => ({
    data: {title: '', id: ''},
    isOpen: false,
    onOpen: (data) => set({isOpen: true, data}),
    onClose: () => set({isOpen: false}),
}))