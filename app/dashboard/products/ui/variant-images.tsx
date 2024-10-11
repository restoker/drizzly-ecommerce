import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { productVariantSchema } from '@/types/product-variant-schema';
import { useFieldArray, useFormContext } from 'react-hook-form'
import { UploadDropzone } from '@/app/api/uploadthing/upload';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';

const VariantImages = () => {
    const { getValues, control, setError } = useFormContext<z.infer<typeof productVariantSchema>>();
    const { fields, remove, append, update, move } = useFieldArray({
        control,
        name: 'variantImages'
    });
    return (
        <div>
            <FormField
                control={control}
                name="variantImages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <UploadDropzone
                                className='ut-allowed-content:text-amber-300 ut-label:text-amber-500 ut-upload-icon:text-amber-500/60 hover:bg-amber-500/10 transition-all duration-500 ease-in-out border-amber-500 ut-button:bg-amber-500/75 ut-button:ut-readying:bg-amber-400'
                                endpoint='variantUploader'
                                onUploadError={(error) => {
                                    setError('variantImages', {
                                        type: 'validate',
                                        message: error.message,
                                    })
                                    return;
                                }}
                                onBeforeUploadBegin={(files) => {
                                    files.map((file) => append({
                                        name: file.name,
                                        size: file.size,
                                        url: URL.createObjectURL(file),
                                    }));
                                    return files;
                                }}
                                onClientUploadComplete={(files) => {
                                    const images = getValues('variantImages');
                                    images.map((image, i) => {
                                        if (image.url.search('blob:') === 0) {
                                            const imagen = files.find((img) => img.name === image.name);
                                            if (imagen) {
                                                update(i, {
                                                    url: imagen.url,
                                                    name: imagen.name,
                                                    size: imagen.size,
                                                    key: imagen.key,
                                                })
                                            }
                                        }
                                    });
                                    return;
                                }}
                                config={{ mode: 'auto' }}
                                onUploadProgress={() => {
                                    console.log('cargando');
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='overflow-x-auto rounded-md'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                            {/* <TableHead className="text-right">Amount</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, i) => {
                            return (
                                <TableRow key={`key-${i}`} className={
                                    cn(field.url.search('blob:') === 0
                                        ?
                                        'animate-pulse transition-all'
                                        :
                                        '',
                                        'text-sm font-bold text-muted-foreground hover:text-amber-400'
                                    )
                                }
                                >
                                    <TableCell className='font-medium'>{i}</TableCell>
                                    <TableCell>{field.name}</TableCell>
                                    <TableCell>{(field.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-center'>
                                            <img
                                                className='rounded-lg w-20 h-20'
                                                src={field.url}
                                                alt={field.name}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant={'ghost'}
                                            className='rounded-full scale-110'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                remove(i);
                                            }}
                                        >
                                            <TrashIcon className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default VariantImages