import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


interface HintProps {
    children: React.ReactNode;
    description: string;
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}

const Hint = (props: HintProps) => {

    const { children, description, side="bottom", sideOffset=0, } = props;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} sideOffset={sideOffset} className="text-xs max-w-[220px] break-words">
                    {description}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
  )
}

export default Hint