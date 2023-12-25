import { filter, forIn, groupBy, includes, max, maxBy, minBy, orderBy, range, reduce, sortBy, uniq } from "lodash"
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
const HIGHCARD      = 1 << 7
const ONEPAIR       = 1 << 8
const TWOPAIR       = 1 << 9
const THREECARD     = 1 << 10
const STRAIGHT      = 1 << 11 
const FLUSH         = 1 << 12
const FULLHOUSE     = 1 << 13
const FOURCARD      = 1 << 14
const STRAIGHTFLUSH = 1 << 15

var card1 = new Card(Suit.HEART, Rank.SIX)
var card2 = new Card(Suit.HEART, Rank.SEVEN)
var card3 = new Card(Suit.HEART, Rank.EIGHT)
var card4 = new Card(Suit.SPADE, Rank.KING)
var card5 = new Card(Suit.HEART, Rank.NINE)

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

    return HIGHCARD | eval_holecard(hole)
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
    return __eval_fourcard(cards)
}

function __eval_fourcard(cards: Card[]) {
    var rank = __search_fourcard(cards)
    return rank << 4
}

function __search_fourcard(cards: Card[]) {
    var res = 0
    forIn(groupBy(cards, 'rank'), (value, key) => {
        if (value.length >= 4) {
            res = parseInt(key)
        }
    })
    return res
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
    forIn(groupBy(sortBy(cards, 'rank') , 'rank'), (value, key) => {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value)
        }
        if (value.length >= 2) {
            two_pair_ranks = two_pair_ranks.concat(value)
        } 
    })
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

function isFlush(cards: Card[]) {
   return search_flush(cards) !== -1
}

function eval_flush(cards: Card[]) {
    return search_flush(cards) << 4
}

function search_flush(cards: Card[]) {
    var best_suit_rank = -1
   
    forIn(groupBy(sortBy(cards, 'suit') , 'suit'), (value, key) => {
        if (value.length >= 5) {
            var max_rank_card = maxBy(value,'rank')
            best_suit_rank = Math.max(best_suit_rank, max_rank_card!!.rank)
        }
    })
    return best_suit_rank
}

function isStraight(cards: Card[]) {
    return search_straight(cards) != -1
}

function eval_straight(cards: Card[]) {
    return search_straight(cards) << 4
}

function search_straight(cards: Card[]) {
    let bit_memo = reduce(cards, (memo, card) => {
        return memo | 1 << card.rank
    }, 0)

    let rank = -1;
    forIn(range(2,15), function (r)  {
        let straight_check = (acc, i) => acc & (bit_memo >> (r + i) & 1)
        if (reduce(range(0, 5), straight_check, true)) {
            rank = r as number
        }
    })

    return rank
}

function isThreeCard(cards: Card[]) {
    return search_threeCard(cards) != null
}

function eval_threeCard(cards: Card[]) {
    return search_threeCard(cards)?.rank << 4
}

function search_threeCard(cards:Card[]) {
    var three_card_ranks: Card[] = [] 
    var two_pair_ranks: Card[]  = []
    forIn(groupBy(sortBy(cards, 'rank') , 'rank'), (value, key) => {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value)
        }
    })
    two_pair_ranks = filter(two_pair_ranks, rank => !includes(three_card_ranks, rank));
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push(minBy(three_card_ranks, 'rank')!!)
    }
    return max_rank(three_card_ranks)
}

function isTwoPairs(cards: Card[]) {
    return search_twopairs(cards).length === 2
}

function eval_twopairs(cards: Card[]) {
    return orderBy(search_twopairs(cards), undefined, 'desc')[0] << 4 | orderBy(search_twopairs(cards), undefined, 'desc')[1] 
} 

function search_twopairs(cards: Card[]) {
    let ranks: number[] = []
    let memo = 0
    cards.forEach(card => {
        let mask = 1 << card.rank
        if ((memo & mask) != 0) {
            ranks.push(card.rank)
        }
        memo |= mask
    })
    return uniq(ranks)
}

function isOnePair(cards: Card[]) {
    return eval_onePair(cards) !== 0
}

function eval_onePair(cards: Card[]) {
    let rank = 0
    let memo = 0  // bit memo
    cards.forEach(card => {
        let mask = 1 << card.rank
        if ((memo & mask) != 0) {
            rank = Math.max(rank, card.rank)
        }
        memo |= mask
    }) 
    return rank << 4
}

function eval_holecard(hole: Card[]) {
    let ranks = orderBy(hole, 'rank', 'desc')
    console.log(ranks)
    return ranks[0].rank << 4 | ranks[1].rank
}
const hand1 = new Card(Suit.HEART, Rank.NINE)
const hand2 = new Card(Suit.HEART, Rank.TEN)

const hand3 = new Card(Suit.HEART, Rank.TEN)
const hand4 = new Card(Suit.HEART, Rank.JACK)

console.log(calc_hand_info_flag([hand1, hand2],[card1,card2,card3, card4,card5]))
console.log(calc_hand_info_flag([hand3, hand4],[card1,card2,card3, card4,card5]))
