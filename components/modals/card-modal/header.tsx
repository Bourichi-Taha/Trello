"use client";

import { updateCard } from "@/actions/update-card";
import FormInput from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
    card:CardWithList;
}

const Header = (props:HeaderProps) => {

    const {card} = props;
    const [title,setTitle] = useState(card.title);
    const queryClient = useQueryClient();
    const params = useParams();
    const inputRef = useRef<ElementRef<"input">>(null);

    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();
    };

    const {execute,fieldErrors,isLoading} = useAction(updateCard,{
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:["card",data.id]
            });
            queryClient.invalidateQueries({
                queryKey:["AuditLog",data.id]
            });
            toast.success(`Card "${data.title}" renamed✨`);
            setTitle(data.title);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData:FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        const id = formData.get("id") as string;

        execute({title,id,boardId});

    }


  return (
    <div className="flex items-center gap-x-3 mb-6 w-full ">
        <Layout className="h-5 w-5 mt-1 text-neutral-700" />
        <div className="w-full">
            <form action={onSubmit} className="">
                <FormInput id="title" disabled={isLoading} ref={inputRef} errors={fieldErrors} defaultValue={title} onBlur={onBlur} className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate" />
                <input hidden value={card.id} name="id" id="id" />
                <input hidden value={params.boardId} name="boardId" id="boardId" />
            </form>
            <p className="text-sm text-muted-foreground">
                In list <span className="underline">{card.list.title}</span>
            </p>
        </div>
    </div>
  )
}

export default Header

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-center gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200"/>
            <div className="">
                <Skeleton className="w-24 h-6 mb-1 bg-neutral-200"/>
                <Skeleton className="w-12 h-4 bg-neutral-200"/>
            </div>
        </div>
    )
}