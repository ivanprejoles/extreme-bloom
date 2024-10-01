import { OmittedProduct } from '@/lib/types'
import { create} from 'zustand'

interface productUpdateType {
    isOpen: boolean,
    data: OmittedProduct,
    onOpen: (data: OmittedProduct) => void,
    onClose: () => void,
}

export const useProductUpdateModal = create<productUpdateType>((set) => ({
    isOpen: false,
    data: {
        id: '',
        title: '',
        imageSrc: '',
        quantity: 0,
        price: 0,
        maxOrder: 0,
        description: '',
        itemTitle: '',
        categoryId: '',
        updatedAt: new Date,
        createdAt: new Date
    },
    onOpen: (data) => set(() => ({isOpen: true, data})),
    onClose: () => set({isOpen: false}),
}))