"use client"

import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


type SelectProps = {
    options: Array<{ value: string, label: string }>,
    placeholder: string,
    emptyOptionMessage?: string,
    searchPlaceholder?: string,
    onChange: (value: string) => void,
    defaultValue?: string,
}

export function Select({
    options,
    placeholder,
    emptyOptionMessage,
    searchPlaceholder,
    onChange,
    defaultValue
}: SelectProps) {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(defaultValue || '')


    React.useEffect(() => {
        setValue(defaultValue || "")
    }, [ defaultValue ])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : (placeholder || "Select option...")}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 shrink-0 opacity-50"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder || "Search option..."} />
                    <CommandEmpty>{emptyOptionMessage || 'No option found.'}</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    onChange(currentValue)
                                    setOpen(false)
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}