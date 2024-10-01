import { create } from "zustand";

interface itemProps {
    name: string,
    id: string
}

interface orderProps {
    data: itemProps
    isOpen: boolean,
    onDelete: (data: itemProps) => void,
    onClose: () => void,
}

export const useOrderDeleteModal = create<orderProps>((set) => ({
    data: {name: '', id: ''},
    isOpen: false,
    onDelete: (data) => set({isOpen: true, data}),
    onClose: () => set({isOpen: false}),
}))