"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized!",
        }
    }

    const {title,image} = data;

    //image = 'imageId|imageThumb|imageFullUrl|imageLinkHTM|imageUsername
    const [imageId,imageThumbUrl,imageFullUrl,imageLinkHTML,imageUsername] = image.split('|');

    if (image.split('|').length !== 5) {
        return {
            error: "Failed to create Board, due to missing fields!"
        }
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                imageFullUrl,
                imageId,
                imageLinkHTML,
                imageThumbUrl,
                imageUsername,
                orgId
            }
        });

    } catch (error) {
        return {
            error: "Internal Error."
        }
    }

    revalidatePath(`/board/${board.id}`);
    return {
        data:board
    }

}

export const createBoard = createSafeAction(CreateBoard,handler);