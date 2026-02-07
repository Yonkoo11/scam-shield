"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex w-full border-4 border-[#0a0a0a] dark:border-[#333]",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 font-display text-sm tracking-widest uppercase transition-colors duration-150 bg-white dark:bg-[#1a1a1a] text-[#525252] dark:text-[#a3a3a3] border-r-4 border-[#0a0a0a] dark:border-[#333] last:border-r-0 hover:bg-[#f5f5f5] dark:hover:bg-[#222] data-[state=active]:bg-[#facc15] data-[state=active]:text-[#0a0a0a] data-[state=active]:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 space-y-4 focus-visible:outline-none animate-in fade-in-50 duration-200",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
