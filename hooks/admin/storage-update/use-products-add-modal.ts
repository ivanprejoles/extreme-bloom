import { create} from 'zustand'

interface productAddType {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useProductsAddModal = create<productAddType>((set) => ({
    isOpen: false,
    onOpen: () => set(() => ({isOpen: true})),
    onClose: () => set({isOpen: false}),
}))