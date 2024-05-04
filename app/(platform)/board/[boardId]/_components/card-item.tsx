import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client"



interface CardItemProps {
  card: Card;
  index: number;
}

const CardItem = (props: CardItemProps) => {

  const { card, index } = props;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} role="button" className="trancate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm">
          {
            card.title
          }
        </div>
      )}
    </Draggable>
  )
}

export default CardItem