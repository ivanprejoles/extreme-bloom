import { CategoryCount, OmittedProduct } from '@/lib/types';
import { create } from 'zustand';

interface ProductType {
  category: {[key: string]: CategoryCount};
  productsData: { [key: string]: OmittedProduct } | {};
  onAddCategory: (data: {[key: string]: CategoryCount}) => void;
  onRemoveCategory: (data: string) => void;
  onAddProduct: (data: OmittedProduct[]) => void;
  onRenderProduct : (data: OmittedProduct[]) => void;
  onRemoveProduct: (keys: string[]) => void;
}

export const useProductTable = create<ProductType>((set) => ({
  productsData: {},
  category: {},
  onAddProduct: (data) => set((state) => {
    const bulk = data.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, { ...state.productsData });    
    return {
      ...state,
      productsData: bulk,
    };
  }),
  onRenderProduct: (data) => set((state) => {
    const bulk = data.reduce((acc: {[x: string]: OmittedProduct}, item) => {
      acc[item.id] = item;
      return acc;
    }, { });    
    return {
      ...state,
      productsData: bulk,
    };
  }),
  onAddCategory: (data) => set((state) => {
    return {
      ...state,
      category: {
        ...state.category, 
        ...data
      }
    }
  }),
  onRemoveCategory: (data) => set((state) => {
    const { category } = state;

    if (state.category) {
      delete category[data];
    }
  
    return {
      ...state,
      category
    };
  }),
  onRemoveProduct: (keys) => set((state) => {
    const newData = { ...state.productsData };
    
    keys.forEach((key) => {
      delete newData[key];
    });
    
    return {
      ...state,
      productsData: newData,
    };
  }),
}));
