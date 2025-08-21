"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { IconSidebar } from "./ui/icons";

export function Sidebar({ children }) {
  return (
    <Sheet>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="group -ml-2 flex h-9 w-9 items-center justify-center p-0"
          aria-label="Open chat history sidebar"
        >
          <IconSidebar className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent
        className="
          inset-y-0 
          flex 
          h-auto 
          w-[300px] 
          flex-col 
          border-r 
          bg-background 
          p-0 
          shadow-lg 
          transition-transform
          data-[state=open]:animate-in
          data-[state=open]:slide-in-from-left
          data-[state=closed]:animate-out
          data-[state=closed]:slide-out-to-left
        "
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-base font-semibold leading-none tracking-tight">
            Sidebar
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-4 pb-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}