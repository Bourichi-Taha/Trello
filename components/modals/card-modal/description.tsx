"use client";

import { updateCard } from "@/actions/update-card";
import FormSubmit from "@/components/form/form-submit";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEventHandler, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescreptionProps {
    card: CardWithList;
}


const Descreption = (props: DescreptionProps) => {

    const { card } = props;

    const params = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(card.description || "");

    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const queryClient = useQueryClient();

    const {execute,fieldErrors} = useAction(updateCard,{
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:["card",data.id]
            });
            queryClient.invalidateQueries({
                queryKey:["AuditLog",data.id]
            });
            toast.success(`Card "${data.title}" updated✨`);
            disableEditing();
            setDescription(data.description!);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    }

    const disableEditing = () => setIsEditing(false);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);

    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = formData.get("boardId") as string;
        const title = formData.get("title") as string;
        const id = formData.get("id") as string;
        
        execute({id,boardId,description,title});
    }


    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {
                    isEditing ? (
                        <form action={onSubmit} className="space-y-2" ref={formRef}>
                            <FormTextarea id="description" className="w-full mt-2" placeholder="Add a more detailed description👌." defaultValue={description||undefined} errors={fieldErrors} ref={textareaRef} onKeyDown={onTextAreaKeyDown}/>
                            <input hidden id="boardId" name="boardId" value={params.boardId}/>
                            <input hidden id="id" name="id" value={card.id}/>
                            <input hidden id="title" name="title" value={card.title}/>
                            <div className="flex items-center gap-x-2">
                                <FormSubmit variant="primary">
                                    Save
                                </FormSubmit>
                                <Button type="button" onClick={disableEditing} size={"sm"} variant={"ghost"}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div onClick={enableEditing} role="button" className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md">
                            {description || "Add a more detailed description👌."}
                        </div>
                    )
                }
            </div>
        </div >
    )
}

export default Descreption


Descreption.Skeleton = function DescreptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full ">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-[78px] bg-neutral-200" />
            </div>
        </div>
    )
}