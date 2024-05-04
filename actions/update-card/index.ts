"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";

const handler = async (data: InputType):Promise<ReturnType> => {

    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {id,boardId,...rest} = data;

    let card;

    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board:{
                        id:boardId,
                        orgId
                    }
                }
            },
            data: {
                ...rest,
            }
        })
    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data:card
    }

}

export const updateCard = createSafeAction(UpdateCard,handler);