import Hint from "@/components/common/hint"
import FormPopover from "@/components/form/form-popover"
import { HelpCircle, User2 } from "lucide-react"




const BoardList = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-neutral-700 text-lg">
                <User2 className={"h-6 w-6 mr-2"} />
                Your boards
            </div>
            <FormPopover sideOffset={10} side="bottom" align="start">
                <div role="button" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
                        <p className="text-sm">Create new board</p>
                        <span className="text-xs">5 remaining</span>
                        <Hint description={`Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.`} sideOffset={40} >
                            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                </div>
            </FormPopover>
        </div>
    )
}

export default BoardList