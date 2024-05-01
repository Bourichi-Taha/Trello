"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

const FormSubmit = (props:FormSubmitProps) => {
    const {children,className,disabled,variant} = props;
    const {pending} = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={disabled || pending} size={"sm"} className={cn("",className)}>
        {
            children
        }
    </Button>
  )
}

export default FormSubmit