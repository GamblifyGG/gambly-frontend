// TWO PAIR.

function findTwoPairs(cards) {
    // Create a map to count occurrences of each rank
    const rankCount = {};
    cards.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank].push(card);
        } else {
            rankCount[card.rank] = [card];
        }
    });

    // Filter ranks that have exactly 2 occurrences (pairs)
    const pairs = Object.values(rankCount).filter(rankCards => rankCards.length === 2);

    // Assuming we always have two pairs in the input for "TWO_PAIR" scenario,
    // flatten the array of pairs to get the exact cards
    return pairs.flat();
}
function findHighCard(cards) {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    // Sort cards by their rank, based on the predefined ranks order
    cards.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
    // The last card in the sorted array is the highest
    return cards[cards.length - 1];
}
function findPair(cards) {
    const rankCount = {};
    cards.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank].push(card);
        } else {
            rankCount[card.rank] = [card];
        }
    });

    // Find the first rank that appears exactly twice
    for (let rank in rankCount) {
        if (rankCount[rank].length === 2) {
            return rankCount[rank]; // Return the pair of cards
        }
    }
    return null; // Return null if no pair is found
}
function findThreeOfAKind(cards) {
    const rankCount = {};
    cards.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank].push(card);
        } else {
            rankCount[card.rank] = [card];
        }
    });

    // Find the first rank that appears exactly three times
    for (let rank in rankCount) {
        if (rankCount[rank].length === 3) {
            return rankCount[rank]; // Return the three cards
        }
    }
    return null; // Return null if no three-of-a-kind is found
}

// // Example usage with the provided card objects
// const cards = [
//     { rank: "T", suit: "diamonds" },
//     { rank: "T", suit: "clubs" },
//     { rank: "2", suit: "clubs" },
//     { rank: "2", suit: "hearts" },
//     { rank: "K", suit: "diamonds" }
// ];

// console.log(findTwoPairs(cards));