'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Sidebar as SideBar} from 'primereact/sidebar';
import { Button } from '@/components/ui/button';
import { FaShoppingCart } from "react-icons/fa";
import { useUserStorage } from '@/hooks/use-storage';
import Logo from '@/components/general/logo';
import CartCollapse from '@/components/general/cart-collapse';
import { doSignInWithGoogle, doSignOut } from '@/firebase/auth';
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import Link from 'next/link';

const MainHeader = () => {
  const [storageVisible, setStorageVisible] = useState(false)
  const {cart} = useUserStorage()
  const [user, setUser] = useState<{email:string, id: string, cookieId: string, imageUrl: string, username: string}|null>(null);
  const [isMounting, setIsMounting] = useState(true)

  useEffect(() => {
    setIsMounting(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({email: user.email as string, id: user.uid, cookieId: user.providerId, imageUrl: user.photoURL as string, username: user.displayName as string});
      } else {
        setUser(null);
      }
      setIsMounting(false)
    });

    return () => unsubscribe();
  }, [auth]);

  const totalQuantity = useMemo(() => {
    if (Object.values(cart).length > 0) {
      return Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
    }
    return 0
  }, [cart]);

  return (
    <>
      <header className='sticky top-0 z-[50] w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className="container flex h-14 max-w-screen-2xl justify-between">
          <div className="flex gap-4 w-auto h-full items-center">
            {/* logo */}
            <Logo />
          </div>
          <div className="flex gap-4 w-auto h-full items-center">{
            !isMounting && (
              <>
                {user 
                  ? (
                    <Popover>
                      <PopoverTrigger asChild className='cursor-pointer'>
                        <Avatar>
                          <AvatarImage className='select-none' src={user.imageUrl} />
                          <AvatarFallback>
                            {user.username.split(" ").reduce((acc, word) => {
                                return acc + word.charAt(0);
                              }, "")
                            }
                          </AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <div className="grid gap-4">
                          <Link href='/account' className='h-9 w-full'>
                            <Button 
                              className='w-full h-full'
                              variant='outline' 
                              size='sm'
                            >
                              Storage
                            </Button>
                          </Link>
                          <Button 
                            onClick={doSignOut}
                            variant='destructive' 
                            size='sm'
                          >
                            Log out
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                  : (  
                    <Button 
                      onClick={doSignInWithGoogle}
                      className="aspect-video rounded-full" 
                      variant='outline' 
                      size='lg'
                    >
                      Login
                    </Button>
                  )
                }
              </>
            )}
            {/* cart */}
            <Button 
              onClick={() => setStorageVisible(true)}
              disabled={totalQuantity <= 0} 
              className='text-white w-auto flex gap-1 p-4 rounded-full relative'
              variant='green' 
              size='default' 
            >
              <FaShoppingCart
                className='w-6 h-6'
              />
              <span className="font-bold min-w-3">
                {totalQuantity}
              </span>
            </Button>
          </div>
        </div>
      </header>
      <SideBar className='w-full lg:w-1/2 2xl:w-1/3' visible={storageVisible} position="right" onHide={() => setStorageVisible(false)}>
          <CartCollapse user={user} />
      </SideBar>
    </>
  )
}

export default MainHeader