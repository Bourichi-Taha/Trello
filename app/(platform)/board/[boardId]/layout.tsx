import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startCase } from "lodash";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/board-navbar";

export async function generateMetadata({params}:{params:{boardId:string;}}) {
    const {orgId} = auth();
    if (!orgId) {
        return {
            title:"Board",
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    return {
        title: startCase(board?.title || "organization"),
    };
};

const BoardIdLayout = async ({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: {
        boardId: string;
    };
}>) => {

    const { orgId } = auth();

    if (!orgId) {
        return redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    if (!board) {
        notFound();
    }


    return (
        <div className="relative bg-no-repeat h-full bg-cover bg-center " style={{backgroundImage:`url(${board.imageFullUrl})`}}>
            <BoardNavbar id={params.boardId} board={board} />
            <div className="absolute inset-0 bg-black/10"/>
            <main className="pt-28 relative h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout