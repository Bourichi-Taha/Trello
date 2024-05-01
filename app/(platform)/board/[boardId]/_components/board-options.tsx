"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BoardOptionsProps{
    id: string;
}

const BoardOptions = (props:BoardOptionsProps) => {

    const {id} = props;
    const router = useRouter();
    const {orgId} = useAuth();

    const {execute,isLoading} = useAction(deleteBoard,{
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" deleted✨`);
            router.push(`/organisation/${orgId}`);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClick = () => {
        execute({id});
    }

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button className="h-auto w-auto p-2" variant={"transparent"}>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                Board actions
            </div>
            <PopoverClose asChild>
                <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant={"ghost"}>
                    <X className="h-4 w-4" />
                </Button>
            </PopoverClose>
            <Button disabled={isLoading} variant={"ghost"} onClick={onClick} className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:bg-rose-500/20 hover:text-rose-500 transition">
                <Trash className="h-4 w-4 mr-2 " />
                Delete this board
            </Button>
        </PopoverContent>
    </Popover>
  )
}

export default BoardOptions