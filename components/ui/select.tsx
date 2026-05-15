"use client"

import * as React from "react"
import * as SelectNamespace from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const {
  Root: SelectRoot,
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTriggerRaw,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItemRaw,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
} = SelectNamespace.Select

const Select = SelectRoot
const SelectGroupComp = SelectGroup
const SelectValueComp = SelectValue

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectTriggerRaw>,
  React.ComponentPropsWithoutRef<typeof SelectTriggerRaw>
>(({ className, children, ...props }, ref) => (
  <SelectTriggerRaw
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
    <SelectIcon>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTriggerRaw>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPopup>,
  React.ComponentPropsWithoutRef<typeof SelectPopup>
>(({ className, children, ...props }, ref) => (
  <SelectPortal>
    <SelectBackdrop />
    <SelectPositioner>
      <SelectPopup
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        <SelectList className="p-1">{children}</SelectList>
      </SelectPopup>
    </SelectPositioner>
  </SelectPortal>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectItemRaw>,
  React.ComponentPropsWithoutRef<typeof SelectItemRaw>
>(({ className, children, ...props }, ref) => (
  <SelectItemRaw
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check className="h-4 w-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>{children}</SelectItemText>
  </SelectItemRaw>
))
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectGroupComp as SelectGroup,
  SelectValueComp as SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
