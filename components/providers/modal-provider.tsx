'use client'

import { useEffect, useState } from "react";
import CategoryModal from "@/components/modals/category-modal";
import { UpdateProductModal } from "../modals/product-update-modal";
import { ProductsAddModal } from "../modals/products-add-modal";
import { UpdateCategoryModal } from "../modals/category-update-modal";
import { DeleteCategoryModal } from "../modals/category-delete-modal";
import { DeleteOrderModal } from "../modals/order-delete-modal";
import { UpdateAccountModal } from "../modals/account-modal";



const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null
    }
    
    return (
        <div className="z-[1000]">
            <CategoryModal />
            <UpdateProductModal />
            <ProductsAddModal />
            <UpdateCategoryModal />
            <DeleteCategoryModal/>
            <DeleteOrderModal />
            <UpdateAccountModal />
        </div>
    );
}
 
export default ModalProvider;
