import { filter, forIn, groupBy, includes, isEqual, isNumber, isString, max, maxBy, minBy, orderBy, range, reduce, shuffle, slice, sortBy, uniq } from "lodash"
class Card {
    public suit;
    public rank;
    constructor(suit: Suit, rank: Rank) {
        this.suit = suit;
        this.rank = rank;
    }
}
enum Suit {
   HEART,
   SPADE,
   DIAMOND,
   CLUB 
}

enum Rank {
    TWO = 2,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    QUEEN,
    KING,
    ACE
}
const HIGHCARD      = 1 << 21
const ONEPAIR       = 1 << 22
const TWOPAIR       = 1 << 23
const THREECARD     = 1 << 24
const STRAIGHT      = 1 << 25 
const FLUSH         = 1 << 26
const FULLHOUSE     = 1 << 27
const FOURCARD      = 1 << 28
const STRAIGHTFLUSH = 1 << 29

var card1 = new Card(Suit.HEART, Rank.ACE)
var card2 = new Card(Suit.DIAMOND, Rank.KING)
var card3 = new Card(Suit.SPADE, Rank.QUEEN)
var card4 = new Card(Suit.DIAMOND, Rank.JACK)
var card5 = new Card(Suit.SPADE, Rank.JACK)

function calc_hand_info_flag(hole: Card[], publicCards: Card[]) {
    let cards = hole.concat(publicCards)
    if (isStraightFlush(cards)) {
        console.log("isStraightFlush")
        return STRAIGHTFLUSH | eval_straightFlush(cards)
    }
    if (isFourCards(cards)) {
        console.log("isFourCards")

        return FOURCARD | __eval_fourcard(cards)
    }
    if (isFullHouse(cards)) {
        console.log("isFullHouse")

        return FULLHOUSE | eval_fullhouse(cards)
    }
    if (isFlush(cards)) {
        console.log("isFlush")

        return FLUSH | eval_flush(cards)
    }
    if (isStraight(cards)) {
        console.log("isStraight")
        return STRAIGHT | eval_straight(cards)
    }
    if (isThreeCard(cards)) {
        console.log("isThreeCard")

        return THREECARD | eval_threeCard(cards)
    }
    if (isTwoPairs(cards)) {
        console.log("isTwoPairs")

        return TWOPAIR | eval_twopairs(cards)
    }
    if (isOnePair(cards)) {
        console.log("isOnePair")

        return ONEPAIR | eval_onePair(cards)
    }
    console.log("HIGHCARD")

    return HIGHCARD | eval_highcard(cards)
}

function isStraightFlush(cards: Card[]) {
   return search_straightFlush(cards) !== -1
}

function eval_straightFlush(cards: Card[]) {
    return search_straightFlush(cards) << 4
}

function search_straightFlush(cards: Card[]) {
    let flush_cards: Card[] = []
    forIn(groupBy(sortBy(cards, 'suit'), 'suit'), (group_obj, suit) => {
        if (group_obj.length >= 5) {
            flush_cards = group_obj
        }
    })
    return search_straight(flush_cards)
}

function isFourCards(cards: Card[]) {
    return __search_fourcard(cards)[0] !== -1
}

function __eval_fourcard(cards: Card[]) {
    var [key1, key2] = __search_fourcard(cards)
    console.log(key1, key2)
    return key1 << 4 | key2
}

function __search_fourcard(cards: Card[]) {
    var res = -1
    forIn(groupBy(cards, 'rank'), (value, key) => {
        if (value.length >= 4) {
            res = parseInt(key)
        }
    })
    let ordered = orderBy(cards, 'rank' , 'desc')
    // console.log(ordered)
    return [res, ordered.filter(item => item.rank !== res)[0].rank]
}

function isFullHouse(cards: Card[]) {
    const [three_card_ranks, two_pair_ranks] =  searchFullHouse(cards)

    return !!(three_card_ranks && two_pair_ranks)
}

function eval_fullhouse(cards: Card[]) {
    const [three_card_ranks, two_pair_ranks] =  searchFullHouse(cards)
    return three_card_ranks?.rank << 4 | two_pair_ranks?.rank
}

function searchFullHouse(cards: Card[]) {
    var three_card_ranks: Card[] = [] 
    var two_pair_ranks: Card[]  = []
    forIn(groupBy(orderBy(cards, 'rank', 'desc') , 'rank'), (value, key) => {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value)
        }
        if (value.length >= 2) {
            two_pair_ranks = two_pair_ranks.concat(value)
        } 
    })
    if (two_pair_ranks.length === 6) {
        return [max_rank(three_card_ranks), min_rank(two_pair_ranks)]
    }
    two_pair_ranks = filter(two_pair_ranks, rank => !includes(three_card_ranks, rank));
    
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push(minBy(three_card_ranks, 'rank')!!)
    }
    return [max_rank(three_card_ranks), max_rank(two_pair_ranks)]
}

function max_rank (cards: Card[]) {
    if (cards.length == 0) {
        return null
    } else {
        return maxBy(cards, 'rank')
    }
}

function min_rank(cards: Card[]) {
    if (cards.length == 0) {
        return null
    } else {
        return minBy(cards, 'rank')
    }
}

function isFlush(cards: Card[]) {
   return search_flush(cards).length !== 0
}

function eval_flush(cards: Card[]) {
    let res = 0;
    search_flush(cards).forEach((item, index) => {
        res |= item << index * 4
    })
    return res
}

function search_flush(cards: Card[]) {
    var best_suit_rank = -1
    var suited_cards_rank: number[] = []
   
    forIn(groupBy(sortBy(cards, 'suit') , 'suit'), (value, key) => {
        if (value.length >= 5) {
            var max_rank_card = maxBy(value,'rank')
            best_suit_rank = Math.max(best_suit_rank, max_rank_card!!.rank)
            suited_cards_rank = value.map(item => item.rank)
        }
    })
    suited_cards_rank = sortBy(suited_cards_rank)  
    return slice(suited_cards_rank, -5)
}

function isStraight(cards: Card[]) {
    return search_straight(cards) != -1
}

function eval_straight(cards: Card[]) {
    return search_straight(cards) << 4
}

function search_straight(cards: Card[]) {
    const sortedCards = uniq(sortBy(cards, 'rank').map(item => item.rank))
    // let bit_memo = reduce(sortBy(cards, 'rank'), (memo, card) => {
    //     return memo | 1 << card.rank
    // }, 0)
    // console.log(sortedCards, 'sortedCards')
    

    // TODO: check A2345

    let rank = -1;

      // 检查顺子条件：至少有五张牌是连续递增的
    for (let i = 0; i <= sortedCards.length - 5; i++) {
        let isValidStraight = true;
        for (let j = i; j < i + 4; j++) {
        if (sortedCards[j + 1] - sortedCards[j] !== 1) {
            isValidStraight = false;
            break;
        }
        }
        if (isValidStraight) {
            rank = sortedCards[i+4];
        }
    }
    return rank
}

function isThreeCard(cards: Card[]) {
    return !!search_threeCard(cards)[0]
}

function eval_threeCard(cards: Card[]) {
    const key1 = search_threeCard(cards)[0]?.rank
    const key2 = search_threeCard(cards)[1]?.rank
    const key3 = search_threeCard(cards)[2]?.rank
    return key1 << 8 | key2 << 4 | key3
}

function search_threeCard(cards:Card[]) {
    var three_card_ranks: Card[] = [] 
    var two_pair_ranks: Card[]  = []
    const sortedCards = orderBy(cards, 'rank', 'desc')
    forIn(groupBy(sortedCards , 'rank'), (value, key) => {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value)
        }
    })
    two_pair_ranks = filter(two_pair_ranks, rank => !includes(three_card_ranks, rank));
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push(minBy(three_card_ranks, 'rank')!!)
    }
    const threeCardKey = max_rank(three_card_ranks)
    const cards_remove_threecards = uniq(filter(sortedCards, rank => !includes(three_card_ranks, rank)))
    const key1 = cards_remove_threecards[0]
    const key2 = cards_remove_threecards[1]

    return [threeCardKey, key1, key2]
}

function isTwoPairs(cards: Card[]) {
    const twoPairsCards = search_twopairs(cards)[0] as number[]
    return twoPairsCards.length === 2
}

function eval_twopairs(cards: Card[]) {
    const searchResult = search_twopairs(cards)
    const key1 = searchResult[0][0]
    const key2 = searchResult[0][1]
    const key3 = searchResult[1]
    return key1 << 8 | key2 << 4 | key3
} 

function search_twopairs(cards: Card[]) {
    let ranks: number[] = []
    let memo = 0
    const orderCards = orderBy(cards, 'rank', 'desc')
    orderCards.forEach(card => {
        let mask = 1 << card.rank
        if ((memo & mask) != 0) {
            ranks.push(card.rank)
        }
        memo |= mask
    })
    const filteredCards = filter(orderCards, card => {
        return !ranks.includes((card as Card).rank)
    } )
    return [uniq(ranks), filteredCards[0].rank]
}

function isOnePair(cards: Card[]) {
    return search_onePair(cards)[0] !== 0
}

function eval_onePair(cards: Card[]) {
    const searchResult = search_onePair(cards)
    const key1 = searchResult[0]
    const key2 = searchResult[1]
    const key3 = searchResult[2]
    const key4 = searchResult[3]

    return key1 << 16 | key2 << 8 | key3 << 4 | key4
}

function search_onePair(cards: Card[]) {
    let rank = 0
    let memo = 0  // bit memo
    const orderCards = orderBy(cards, 'rank', 'desc')
    cards.forEach(card => {
        let mask = 1 << card.rank
        if ((memo & mask) != 0) {
            rank = Math.max(rank, card.rank)
        }
        memo |= mask
    }) 
    const filteredCards = filter(orderCards, card => {
        return (card as Card).rank !== rank
    } )
    return [rank, filteredCards[0].rank, filteredCards[1].rank, filteredCards[2].rank]
}

function eval_highcard(cards: Card[]) {
    let orderCards = slice(sortBy(cards, 'rank'), -5)
    let res = 0
    orderCards.forEach((card, index) => {
        res |= card.rank << (index * 4) 
    })
    return res
}
const hand1 = new Card(Suit.DIAMOND, Rank.NINE)
const hand2 = new Card(Suit.DIAMOND, Rank.EIGHT)

const hand3 = new Card(Suit.DIAMOND, Rank.EIGHT)
const hand4 = new Card(Suit.DIAMOND, Rank.SEVEN)

console.log(calc_hand_info_flag([hand1, hand2],[card1,card2,card3,card4,card5]))
console.log(calc_hand_info_flag([hand3, hand4],[card1,card2,card3,card4,card5]))

function generateDecks() {
    const decks: Card[] = []
    forIn(Suit, (suit) => {
        forIn(Rank, (rank) => {
            if (isNumber(rank) && isString(suit)) {
                decks.push(new Card(suit, rank))
            }
        })
    })
    return shuffle(decks)
}

class Player {
    hands: Card[]
    name: string
    constructor(name: string) {
        this.name = name
    }
    dealHands(decks: Card[]) {
        this.hands = decks.splice(0, 2)
        this.hands.forEach(item => {
            console.log(`${this.name}hands: ${item.rank}, ${item.suit}`)
        })
    }

    logPoker(publicCards: Card[]) {
        // console.log(`${this.name}: hands: ${this.hands}, final: ${calc_hand_info_flag(this.hands, publicCards)}`)
    }

    calc_poker(publicCards: Card[]) {
        return calc_hand_info_flag(this.hands, publicCards)
    }
}
const playerlist:Player[] = []
for (let i = 0; i < 10; i++) {
    playerlist.push(new Player("player" + i))
}



function start() {
    const decks = generateDecks()
    playerlist.forEach(player => {
        player.dealHands(decks)
    })

    const all: any[] = []

    const publicCards = slice(decks, 0,5)
    console.log(publicCards, 'publicCards')
    playerlist.forEach(player => {
        all.push({name: player.name, pw: player.calc_poker(publicCards)})
    })

    console.log(maxBy(all, 'pw').name, "won")
}

// start()