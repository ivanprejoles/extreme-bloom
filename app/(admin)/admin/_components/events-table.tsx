'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { OmittedEvent } from '@/lib/types'
import { useEventAddModal } from '@/hooks/use-event-add'
import Image from 'next/image'

interface EventsTableProps {
  events: OmittedEvent[]
}

const EventsTable = ({
  events
}: EventsTableProps) => {
  const {
    onOpen
  } = useEventAddModal()
  
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
              <CardTitle>Events</CardTitle>
              <CardDescription>
                  Current events from your store.
              </CardDescription>
          </div>
          <Button 
              size="sm" 
              onClick={() => onOpen(null)}
              className="ml-auto gap-1"
          >
              <Plus className="h-4 w-4" />
              Add Event
          </Button>
      </CardHeader>
      <CardContent>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {(events.length > 0) && events.map((event, key) => (
                      <TableRow key={key}>
                          <TableCell>
                          <div className="h-fit max-h-full relative w-fit max-w-full rounded-sm overflow-hidden">
                            <Image
                              src={event.imageSrc || '/no-image.png'}
                              alt={event.title}
                              // layout="fill"
                              width={100}
                              height={100}
                              className="object-cover"
                            />
                          </div>
                          </TableCell>
                          <TableCell>
                              <div className="font-medium">{event.title}</div>
                          </TableCell>
                          <TableCell>
                              <div className="font-medium">{event.description}</div>
                          </TableCell>
                          <TableCell>
                              <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                      onClick={() => onOpen(event)}
                                  >
                                      Edit
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                              </DropdownMenu>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </CardContent>
  </Card>
  )
}

export default EventsTable