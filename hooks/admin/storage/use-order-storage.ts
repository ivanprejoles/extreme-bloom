import { OmittedOrder } from '@/lib/types';
import { Status } from '@prisma/client';
import { create } from 'zustand';

interface OrderType {
  ordersData: { [key: string]: OmittedOrder } | {};
  onAddOrder: (data: OmittedOrder[]) => void;
  onRenderOrder: (data: OmittedOrder[]) => void;
  UpdateStatus: (data: {id: string, status: Status}) => void;
  onRemoveOrder: (keys: string[]) => void;
}

export const useOrderTable = create<OrderType>((set) => ({
  ordersData: {},
  onAddOrder: (data) => set((state) => {
    const bulk = data.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, { ...state.ordersData });    
    return {
      ...state,
      ordersData: bulk,
    };
  }),
  onRenderOrder: (data) => set((state) => {
    const bulk = data.reduce((acc: {[x: string]: OmittedOrder}, item) => {
      acc[item.id] = item;
      return acc;
    }, { });    
    return {
      ...state,
      ordersData: bulk,
    };
  }),
  UpdateStatus: (data) => set((state: any) => ({
    ...state,
    ordersData: {
      ...state.ordersData,
      [data.id]: { ...state.ordersData[data.id], status: data.status },
    },
  })),
  onRemoveOrder: (keys) => set((state) => {
    const newData = { ...state.ordersData };
    
    keys.forEach((key) => {
      delete newData[key];
    });
    
    return {
      ...state,
      ordersData: newData,
    };
  }),
}));
