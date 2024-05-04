"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import FormErrors from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?:string;
    required?:boolean;
    disabled?:boolean;
    errors?: Record<string,string[] | undefined> ;
    className?:string;
    defaultValue?:string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
}


const FormTextarea = forwardRef<HTMLTextAreaElement,FormTextareaProps>((props,ref) => {

    const {id,className,defaultValue,disabled,errors,label,onBlur,onClick,onKeyDown,placeholder,required,} = props;

    const {pending} = useFormStatus();


  return (
    <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
            {
                label && (
                    <Label htmlFor={id} className="text-xs font-semibold text-neutral-700">
                        {label}
                    </Label>
                ) 
            }
            <Textarea onKeyDown={onKeyDown} onBlur={onBlur} onClick={onClick} ref={ref} required={required} placeholder={placeholder} name={id} id={id} disabled={disabled || pending} className={cn("resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm ",className)} aria-describedby={`${id}-error`} defaultValue={defaultValue} />
            
        </div>
        <FormErrors errors={errors} id={id} />
    </div>
  )
})

export default FormTextarea

FormTextarea.displayName = "FormTextarea";