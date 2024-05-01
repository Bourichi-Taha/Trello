import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";
import { auth } from "@clerk/nextjs/server";


interface BoardIdPageProps {
    params: {
      boardId: string;
    }
  }

const BoardIdPage = async(props:BoardIdPageProps) => {

    const {boardId} = props.params;
    const {userId,orgId} = auth();

    if (!userId || !orgId) {
      return redirect("/select-org");
    }

    const lists = await db.list.findMany({
      where:{
        boardId,
        board: {
          orgId,
        }
      },
      orderBy:{
        order: "asc",
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          }
        },
      },
    });



  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} lists={lists} />
    </div>
  )
}

export default BoardIdPage