import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion'

interface InputProps {
    value: string[];
    onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputProps>(({ onChange, value, ...props }, ref) => {
    const [pendingDatePoint, setPendingDatePoint] = useState('');
    const [focused, setFocused] = useState(false);

    const addPendingDataPoint = () => {
        if (pendingDatePoint) {
            const newDataPoint = new Set([...value, pendingDatePoint]);
            onChange(Array.from(newDataPoint));
            setPendingDatePoint('');
        }
    };

    const { setFocus } = useFormContext();
    return (
        <div
            className={cn("flex min-h-[20px] w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50", focused ? "ring-offset-1 outline-none ring-ring ring-1" : "ring-offset-0 outline-none ring-ring ring-0")}
            onClick={() => setFocus('tags')}
        >
            <motion.div className='rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center'>
                <AnimatePresence>
                    {value.map((tag, i) => (
                        <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} exit={{ scale: 0 }} key={`key-${i}`}>
                            <span className="inline-flex items-center gap-x-0.5 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                                {tag}
                                <button
                                    type="button"
                                    className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-indigo-600/20"
                                    onClick={() => {
                                        value.splice(i, 1)
                                        onChange(value);
                                    }}
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-indigo-700/50 group-hover:stroke-indigo-700/75">
                                        <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                </button>
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            <div className='flex'>
                <Input
                    className='placeholder:text-gray-400 focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                    placeholder='tag here'
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addPendingDataPoint();
                        }
                        if (e.key === "Backspace" && !pendingDatePoint && value.length > 0) {
                            e.preventDefault();
                            const newValue = [...value];
                            newValue.pop();
                            onChange(newValue);
                        }
                    }}
                    value={pendingDatePoint}
                    onFocus={(e) => setFocused(true)}
                    onBlurCapture={(e) => setFocused(false)}
                    onChange={(e) => setPendingDatePoint(e.target.value)}
                    {...props}
                />
            </div>
        </div>
    )
})
InputTags.displayName = "InputTags"