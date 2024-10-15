'use client'

import * as React from "react"
import { Map } from "lucide-react"
import { PiMapPinAreaFill } from "react-icons/pi";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import dynamic from "next/dynamic"
import { FaGlobeAfrica } from "react-icons/fa";


export function MapDrawer() {
//   const [goal, setGoal] = React.useState(350)

  const MyMap = React.useMemo(() => dynamic(
    () => import('@/components/ui/map'),
    {
        loading: () => 
            <div className="h-full border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
                <div className="animate-pulse h-full w-full space-x-4 relative">
                    <PiMapPinAreaFill className="absolute top-0 bottom-0 left-0 right-0 m-auto w-10 h-10 text-gray-400" />
                    <div className="absolute top-0 bottom-10 left-0 right-0 m-auto w-auto h-auto text-gray-400 text-xl">Loading...</div>
                </div>
            </div>,
        ssr: false
    }
  ), [])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size='icon' className="w-10 h-10 z-[100] fixed top-[70px] left-2">
            <Map />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="z-[101]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Our Location</DrawerTitle>
            <DrawerDescription>Get your order here.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 h-[28rem] w-full">
            <MyMap posix={[14.397992, 120.961712]} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Remove</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
