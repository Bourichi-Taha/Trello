

interface BoardIdPageProps {
    params: {
      boardId: string;
    }
  }

const BoardIdPage = (props:BoardIdPageProps) => {

    const {boardId} = props.params;

  return (
    <div>BoardIdPage</div>
  )
}

export default BoardIdPage