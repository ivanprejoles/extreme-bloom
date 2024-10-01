'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { FaBoxes, FaClipboardList } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import axios from 'axios';
import { MemberRole } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface ClientSideBarProps {
    children: React.ReactNode
}

const ClientSideBar = ({
    children
}: ClientSideBarProps) => {
    const [isMounting, setIsMounting] = useState(true);
    const [user, setUser] = useState<{ id: string, role: MemberRole }>();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounting(true)
        const authenticate = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const response = await axios.post('/api/accountVerify', { emailId: user.uid, email: user.email, imageUrl: user.photoURL });
                if (response.data && response.data.user && response.data.user.role === MemberRole.ADMIN) {
                    setUser({ id: response.data.user.id, role: response.data.user.role });
                }
            } else {
              router.push('/')
            }
          });
          setIsMounting(false);

        return () => authenticate();
    }, [auth]);

    useEffect(() => {
      if (!isMounting) {
          if (!user?.id) {
              router.push('/'); // Redirect to home if user ID does not exist
          } else if (user.role === MemberRole.ADMIN) {
              router.push('/admin/product'); // Redirect to admin product page if admin
          } else {
              router.push('/'); // Redirect to home if not admin
          }
      }
  }, [isMounting, user, router]);

    if (isMounting) {
        return <div>Verifying account...</div>; // Show loading indicator
    }

    if (!user?.id || user.role !== MemberRole.ADMIN) {
      return <div>Redirecting...</div>
    }

    const links = [
        {
            label: "Products",
            href: "/admin/product",
            icon: <FaBoxes className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Orders",
            href: "/admin/order",
            icon: <FaClipboardList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    return (
        <div className={cn("flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-full")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1">
                <div className="w-full h-full overflow-auto rounded-tl-2xl relative">
                    <div className="top-0 absolute left-0 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-screen h-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientSideBar;
