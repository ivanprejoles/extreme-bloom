import client from "./prismadb"
import * as z from "zod"
import { Status } from '@prisma/client';

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  status: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
  // title: z.string().optional(),
  // priority: z.string().optional(),
  // from: z.string().optional(),
  // to: z.string().optional(),
})

export const getItemsSchema = searchParamsSchema

export type GetItemsSchema = z.infer<typeof getItemsSchema>

export const createItemSchema = z.object({
  title: z.string(),
  categoryId: z.string(),
  itemTitle: z.string(),
  imageSrc: z.string(),
  quantity: z.number().min(0),
  price: z.number().min(0),
  maxOrder: z.number().min(3),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateItemSchema = z.infer<typeof createItemSchema>

export const updateItemSchema = z.object({
  title: z.string().optional(),
  categoryId: z.string().optional(),
  itemTitle: z.string().optional(),
  imageSrc: z.string().optional(),
  quantity: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  maxOrder: z.number().min(3).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type UpdateTaskSchema = z.infer<typeof updateItemSchema>
