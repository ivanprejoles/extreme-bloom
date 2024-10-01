//not using
import React, { useCallback, useMemo, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area';
import { useUserStorage } from '@/hooks/use-storage';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { itemType } from '@/hooks/use-items';
import axios from 'axios';
import { doSignInWithGoogle } from '@/firebase/auth';

interface CartCollapseProps {
  user: {email:string, cookieId: string, imageUrl: string, username: string}|null
}

const CartCollapse = ({
  user
}: CartCollapseProps) => {
  const [isSending, setIsSending] = useState(false)
  const {cart, addQuantity, minusQuantity, removeItem, eraseItems} = useUserStorage()

  const total = useMemo(() => {
    return Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const submitCart = async () => {
    
    if (isSending) return
    setIsSending(true)
    const arrayCart = Object.values(cart).map(({ imageSrc, ...rest }) => rest);
    
    try {
      if (user) {
        await axios.post('/api/submitCart', {items: arrayCart, user, total})
          .then((response) => {
            eraseItems()

          })
          .catch((error) => {
            console.error('error: ',error)
            // toast
          })
      } else {
        doSignInWithGoogle()
      }
    } finally {
      setIsSending(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 px-1 h-full flex flex-col">
      <div className="flex-1 w-full relative flex flex-row overflow-hidden">
        <ScrollArea className='w-full h-full pr-3'>
          <table className="w-full h-full table-fixed">
            <thead className="bg-[#0E7D0E] text-white text-sm md:text-sm">
              <tr>
                <th className="text-left p-2 w-1/2">Product</th>
                <th className="text-center p-2 w-1/4">Quantity</th>
                <th className="text-right p-2 w-1/4">Subtotal</th>
              </tr>
            </thead>
            <tbody className='h-full'>
              {Object.values(cart).map((item, key) => (
                <tr key={key} className="border-b">
                  <td className="flex items-center py-2 box-border gap-2">
                    <div className="w-[60px] aspect-square relative overflow-hidden rounded-md">
                      <Image 
                        src={item.imageSrc} 
                        alt={item.title} 
                        className="mr-2 object-cover" 
                        layout='fill' 
                      />
                    </div>
                    <div className='h-full'>
                      <p className='line-clamp-3 text-xs md:text-sm'>{item.title}</p>
                      <p className="text-gray-500 line-clamp-1 text-xs md:text-sm">Price: ₱{item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                      <Button 
                        onClick={() => removeItem(item.id)}
                        size='sm' 
                        variant='outline' 
                        className="text-red-500 hover:text-red-500/80 h-8 text-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                  <td className="text-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      disabled
                      value={item.quantity}
                      className="w-12 text-center border rounded"
                    />
                    <div className="flex flex-row justify-center pt-2 px-3 h-8">
                      {(cart[item.id].quantity > 1) 
                        ? (
                          <Button 
                            onClick={() => minusQuantity(item as itemType)}
                            variant='outline'  
                            size='sm' 
                            className='h-full rounded-r-none px-2'
                          >
                            <MinusIcon className='w-full h-full' />
                          </Button>) 
                        : (
                          <Button 
                            onClick={() => removeItem(item.id)}
                            variant='outline'  
                            size='sm' 
                            className='h-full rounded-r-none px-2'
                          >
                            <Trash2Icon className='w-full h-full' />
                          </Button> 
                        )
                      }
                      <Button 
                        onClick={() => addQuantity(item as itemType)}
                        variant='outline' 
                        size='sm' 
                        className='h-full rounded-l-none px-2'
                      >
                        <PlusIcon className='w-full h-full' />
                      </Button>
                    </div>
                  </td>
                  <td className="w-full overflow-hidden text-right p-2 text-xs md:text-sm line-clamp-1">
                    <span className='w-full'>
                      ₱{(item.price * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </td>
                </tr>
              ))}
              {(Object.keys(cart).length <= 0)  && 
                <tr>
                  <td>No Data.</td>
                </tr>
              }
            </tbody>
          </table>
        </ScrollArea>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-left">
          <p className="font-bold">Total</p>
        </div>
        <div className="text-right">
          <p className="font-bold">₱{total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
      </div>
      <button
        disabled={(Object.keys(cart).length <= 0 || isSending)} 
        onClick={submitCart}
        className="w-full bg-[#0E7D0E] disabled:bg-[#0E7D0E]/60 disabled:cursor-default cursor-pointer text-white py-2 mt-4 rounded-full"
      >
        {!user ? 'Login' : 'Proceed to checkout →'}
      </button>
    </div>
  );
}

export default CartCollapse