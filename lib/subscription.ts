import { auth } from "@clerk/nextjs/server";
import { db } from "./db";


const DAY_IN_MS = 84_400_000

export const checkSubscription = async () => {
    const {orgId} = auth();

    if (!orgId) {
        return false;
    }

    const orgSubs = await db.orgSubscription.findUnique({
        where: {
            orgId,
        },
        select: {
            stripeSubscriptionId:true,
            stripeCurrentPeriodEnd:true,
            stripeCustomerId:true,
            stripePriceId:true
        }
    });

    if (!orgSubs) {
        return false;
    }

    const isValid = orgSubs.stripePriceId && orgSubs.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;

}