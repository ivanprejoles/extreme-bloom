import { create } from "zustand";

interface itemProps {
    title: string,
    id: string
}

interface categoryProps {
    data: itemProps
    isOpen: boolean,
    onDelete: (data: itemProps) => void,
    onClose: () => void,
}

export const useCategoryDeleteModal = create<categoryProps>((set) => ({
    data: {title: '', id: ''},
    isOpen: false,
    onDelete: (data) => set({isOpen: true, data}),
    onClose: () => set({isOpen: false}),
}))