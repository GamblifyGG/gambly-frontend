const CommunityCards = ({ cards = [], winnerCards = [] }) => {

  return (
    <div className="flex gap-2">
      {
        cards.map((x, i) => (
          <img
            key={i}
            className="relative w-[40px] h-auto"
            src={`/cards/set1/${x.id}.png`}
            alt="" 
          />
        ))
      }
    </div>
  )
}

export default CommunityCards;