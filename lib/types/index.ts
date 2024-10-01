import { $Enums, Cart, Category, Prisma, Status } from "@prisma/client"

export interface SearchParams {
    [key: string]: string | string[] | undefined
}

export interface Option {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    withCount?: boolean
}

export interface DataTableFilterField<TData> {
    label: string
    value: keyof TData
    placeholder?: string
    options?: Option[]
}

export interface DataTableFilterOption<TData> {
    id: string
    label: string
    value: keyof TData
    options: Option[]
    filterValues?: string[]
    filterOperator?: string
    isMulti?: boolean
}

export type OmittedOrder = {
    email: string;
    facebook: string | null;
    number: string | null;
    role: $Enums.MemberRole;
    imageSrc: string;
    status: $Enums.Status;
    id: string;
    items: Prisma.JsonValue[];
    createdAt: Date;
    updatedAt: Date;
    amount: number;
}

export type OmittedProduct  = {
    id: string;
    title: string;
    imageSrc: string;
    quantity: number;
    price: number;
    maxOrder: number;
    description: string;
    itemTitle: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type AccountOrder  = {
    id: string;
    status: $Enums.Status;
    items: Prisma.JsonValue[];
    amount: number;
    updatedAt: Date;
    createdAt: Date;
}

export type OrderItem =  {
    id: string;
    maxOrder: number;
    price: number;
    quantity: number;
    title: string;
    updatedAt: Date; // or Date if you're using Date objects
  }

export type AccountType = {
    number: string | null;
    id: string;
    role: $Enums.MemberRole;
    email: string;
    facebook: string | null;
    createdAt: Date;
}

export type UpdateType = {
    item: {
        title: string;
    };
    title: string;
    imageSrc: string;
    price: number;
}

export type OrderType = {
    user: {
        imageUrl: string;
        email: string;
    };
    createdAt: Date;
    amount: number;
}

export type CategoryCount = {
    title: string;
    id: string;
    _count: {
        items: number;
    };
}

export type OrderCount = {
    id: string;
    status: $Enums.Status;
    items: Prisma.JsonValue[];
    amount: number;
    updatedAt: Date;
}

export type OrderChart = {
    items: number;
    id: string;
    status: $Enums.Status;
    amount: number;
    updatedAt: Date;
}
