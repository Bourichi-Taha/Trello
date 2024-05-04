"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPro:boolean;
}

const SubscriptionButton = (props:SubscriptionButtonProps) => {

    const {isPro} = props;

    const {execute,isLoading} = useAction(stripeRedirect,{
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        }
    });

  return (
    <Button onClick={()=>execute({})} disabled={isLoading} variant={"primary"} >
        {
            isPro ? "Manage subscription" : "Upgrade to pro"
        }
    </Button>
  )
}

export default SubscriptionButton