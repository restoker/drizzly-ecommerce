'use client'

import { Toggle } from '@/components/Toggle'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'

const Tiptap = ({ value, setValue }: { value: string, setValue: UseFormSetValue<any> }) => {
    // const { setValue } = useFormContext();
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-4'
                    }
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-4'
                    }
                },
            })
        ],
        editorProps: {
            attributes: {
                class: 'block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:py-1.5 sm:text-sm sm:leading-6 bg-transparent dark:text-gray-200 px-4'
            }
        },
        content: value,
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            setValue('description', content, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        },
    });

    useEffect(() => {
        if (editor?.isEmpty) editor.commands.setContent(value);
    }, [value]);


    return (
        <div className='flex flex-col gap-2'>
            {editor ?
                <div className='border rounded-md border-opacity-20 dark:bg-transparent'>
                    <Toggle
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        size={'sm'}
                        aria-label="Toggle bold"

                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        size={'sm'}
                        aria-label="Toggle italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive('strike')}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        size={'sm'}
                    // aria-label="Toggle bold"

                    >
                        <Strikethrough className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        style={{}}
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        size={'sm'}
                    // aria-label="Toggle bold"

                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        size={'sm'}
                    // aria-label="Toggle bold"

                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                </div>
                : null}
            <EditorContent editor={editor} />
        </div>
    );
}

export default Tiptap