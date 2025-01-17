"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define a base style using class-variance-authority (CVA)
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Create the Label component, forwarding the ref to LabelPrimitive.Root
const Label = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...rest}
    />
  );
});

// Set a display name for better debugging in React DevTools
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };