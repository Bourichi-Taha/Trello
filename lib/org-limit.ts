import { auth } from "@clerk/nextjs/server"
import { db } from "./db";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { checkSubscription } from "./subscription";


export const incrementAvailabeCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized!");
    }

    const isPro = await checkSubscription();

    if (isPro) {
        return;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId,
        }
    });

    if (orgLimit) {
        await db.orgLimit.update({
            where: {
                orgId,
            },
            data: {
                count: orgLimit.count + 1,
            },
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                count: 1
            },
        });
    }

}

export const decrementAvailabeCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized!");
    }

    const isPro = await checkSubscription();

    if (isPro) {
        return;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId,
        }
    });

    if (orgLimit) {
        await db.orgLimit.update({
            where: {
                orgId,
            },
            data: {
                count: Math.max(orgLimit.count - 1, 0),
            },
        });
    } else {
        await db.orgLimit.create({
            data: {
                orgId,
                count: 0
            },
        });
    }

}

export const hasAvailableCount = async () => {
    const {orgId} = auth();

    if (!orgId) {
        throw new Error("Unauthorized!");
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId,
        }
    });

    const isPro = await checkSubscription();


    if (isPro || !orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
        return true;
    }

    return false;

}

export const getAvailableCount = async () => {
    const {orgId} = auth();

    if (!orgId) {
        return 0;
    }

    const orgLimit = await db.orgLimit.findUnique({
        where: {
            orgId,
        }
    });

    if (!orgLimit) {
        return 0;
    }
    
    return orgLimit.count;

}