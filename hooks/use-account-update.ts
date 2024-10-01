import { create } from "zustand";

interface itemProps {
    id: string
    email: string,
    facebook: string,
    number: string,
}

interface AccountProps {
    data: itemProps
    isOpen: boolean,
    onOpen: (data: itemProps) => void,
    onClose: () => void,
}

export const useAccountUpdateModal = create<AccountProps>((set) => ({
    data: {
        id: "",
        email: "",
        facebook: "",
        number: ""
    },
    isOpen: false,
    onOpen: (data) => set({isOpen: true, data}),
    onClose: () => set({isOpen: false}),
}))