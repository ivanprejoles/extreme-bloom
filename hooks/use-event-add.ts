import { OmittedEvent } from '@/lib/types'
import { create} from 'zustand'

interface eventAddType {
    isOpen: boolean,
    data: OmittedEvent|null
    onOpen: (data: OmittedEvent|null) => void,
    onClose: () => void,
}

export const useEventAddModal = create<eventAddType>((set) => ({
    isOpen: false,
    data: null,
    onOpen: (data) => set(() => ({
        isOpen: true,
        data
    })),
    onClose: () => set({isOpen: false}),
}))