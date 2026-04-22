"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { 
        defaultValue?: string; 
        value?: string; 
        onValueChange?: (value: string) => void 
    }
>(({ className, defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState(controlledValue || defaultValue)

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            if (!controlledValue) setValue(newValue)
            onValueChange?.(newValue)
        },
        [controlledValue, onValueChange]
    )

    React.useEffect(() => {
        if (controlledValue !== undefined) setValue(controlledValue)
    }, [controlledValue])

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("w-full", className)} {...props} />
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
    const isSelected = selectedValue === value

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:bg-slate-50 hover:text-slate-900",
                className
            )}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext)
    if (selectedValue !== value) return null

    return (
        <div
            ref={ref}
            role="tabpanel"
            className={cn(
                "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
