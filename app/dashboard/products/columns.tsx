"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { modalStore } from "@/store/alertsStore";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProductVariant from "./ui/ProductVariant";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type ProductColumn = {
    title: string;
    price: number;
    // description: string;
    image: string;
    variants: VariantsWithImagesTags[];
    id: string;
    // created: string | null;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
            const idProduct = row.getValue('id') as string;
            return (
                <p className="line-clamp-1">{idProduct}</p>
            );
        }
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'variants',
        header: 'Variants',
        cell: ({ row }) => {
            const variants = row.getValue('variants') as VariantsWithImagesTags[];
            // console.log(variants);
            return (
                <div className="flex gap-2">
                    {variants.map((variant) => (
                        <div key={variant.id}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ProductVariant
                                            productId={variant.productId}
                                            variant={variant}
                                            editMode={true}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full`}
                                                style={{
                                                    backgroundColor: variant.color
                                                }}
                                                key={variant.id}
                                            />
                                        </ProductVariant>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{variant.productType}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild
                                className="flex justify-center w-full"
                            >
                                <span>
                                    <ProductVariant
                                        editMode={false}
                                        productId={row.original.id}
                                    >
                                        <PlusCircleIcon className="w-4 h-4" />
                                    </ProductVariant>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new product variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        }
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('es-PE', {
                currency: 'PEN',
                style: "currency",
            }).format(price);//https://hpneo.dev/2019/05/13/apis-internacionalizacion.html
            return (
                <div className="font-medium text-sm">
                    {formatted}
                </div>
            );
        },
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
            const cellImage = row.getValue('image') as string;
            const cellTitle = row.getValue('title') as string;
            return (
                <div className="h-14 w-14">
                    <img src={cellImage} alt={cellTitle} className="rounde-lg h-14 w-14 object-cover" />
                </div>
            );
        }
    },
    // {
    //     accessorKey: 'created',
    //     header: 'Creado',
    // },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const product = row.original;

            const openModal = modalStore(state => state.openModal);

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="h-8 w-8 bg-transparent" size={'icon'}>
                            <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem> */}
                        <DropdownMenuItem
                            className="dark:focus:bg-amber-500 focus:bg-amber-500/50 cursor-pointer"
                        >
                            <Link href={`/dashboard/addproduct?id=${product.id}`}>
                                Edit product
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
                            onClick={() => openModal(product.id)}
                        >
                            Delete product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            )
        }
    }
]


// id: "actions",
// cell: ({ row }) => {
//     const payment = row.original

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                     <span className="sr-only">Open menu</span>
//                     <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                     onClick={() => navigator.clipboard.writeText(payment.id)}
//                 >
//                     Copy payment ID
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>View customer</DropdownMenuItem>
//                 <DropdownMenuItem>View payment details</DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// },