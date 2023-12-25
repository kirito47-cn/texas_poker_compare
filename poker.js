"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var Card = /** @class */ (function () {
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    return Card;
}());
var Suit;
(function (Suit) {
    Suit[Suit["HEART"] = 0] = "HEART";
    Suit[Suit["SPADE"] = 1] = "SPADE";
    Suit[Suit["DIAMOND"] = 2] = "DIAMOND";
    Suit[Suit["CLUB"] = 3] = "CLUB";
})(Suit || (Suit = {}));
var Rank;
(function (Rank) {
    Rank[Rank["TWO"] = 2] = "TWO";
    Rank[Rank["THREE"] = 3] = "THREE";
    Rank[Rank["FOUR"] = 4] = "FOUR";
    Rank[Rank["FIVE"] = 5] = "FIVE";
    Rank[Rank["SIX"] = 6] = "SIX";
    Rank[Rank["SEVEN"] = 7] = "SEVEN";
    Rank[Rank["EIGHT"] = 8] = "EIGHT";
    Rank[Rank["NINE"] = 9] = "NINE";
    Rank[Rank["TEN"] = 10] = "TEN";
    Rank[Rank["JACK"] = 11] = "JACK";
    Rank[Rank["QUEEN"] = 12] = "QUEEN";
    Rank[Rank["KING"] = 13] = "KING";
    Rank[Rank["ACE"] = 14] = "ACE";
})(Rank || (Rank = {}));
var HIGHCARD = 1 << 7;
var ONEPAIR = 1 << 8;
var TWOPAIR = 1 << 9;
var THREECARD = 1 << 10;
var STRAIGHT = 1 << 11;
var FLUSH = 1 << 12;
var FULLHOUSE = 1 << 13;
var FOURCARD = 1 << 14;
var STRAIGHTFLUSH = 1 << 15;
var card1 = new Card(Suit.HEART, Rank.SIX);
var card2 = new Card(Suit.HEART, Rank.SEVEN);
var card3 = new Card(Suit.HEART, Rank.EIGHT);
var card4 = new Card(Suit.SPADE, Rank.KING);
var card5 = new Card(Suit.HEART, Rank.NINE);
function calc_hand_info_flag(hole, publicCards) {
    var cards = hole.concat(publicCards);
    if (isStraightFlush(cards)) {
        console.log("isStraightFlush");
        return STRAIGHTFLUSH | eval_straightFlush(cards);
    }
    if (isFourCards(cards)) {
        console.log("isFourCards");
        return FOURCARD | __eval_fourcard(cards);
    }
    if (isFullHouse(cards)) {
        console.log("isFullHouse");
        return FULLHOUSE | eval_fullhouse(cards);
    }
    if (isFlush(cards)) {
        console.log("isFlush");
        return FLUSH | eval_flush(cards);
    }
    if (isStraight(cards)) {
        console.log("isStraight");
        return STRAIGHT | eval_straight(cards);
    }
    if (isThreeCard(cards)) {
        console.log("isThreeCard");
        return THREECARD | eval_threeCard(cards);
    }
    if (isTwoPairs(cards)) {
        console.log("isTwoPairs");
        return TWOPAIR | eval_twopairs(cards);
    }
    if (isOnePair(cards)) {
        console.log("isOnePair");
        return ONEPAIR | eval_onePair(cards);
    }
    console.log("HIGHCARD");
    return HIGHCARD | eval_holecard(hole);
}
function isStraightFlush(cards) {
    return search_straightFlush(cards) !== -1;
}
function eval_straightFlush(cards) {
    return search_straightFlush(cards) << 4;
}
function search_straightFlush(cards) {
    var flush_cards = [];
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.sortBy)(cards, 'suit'), 'suit'), function (group_obj, suit) {
        if (group_obj.length >= 5) {
            flush_cards = group_obj;
        }
    });
    return search_straight(flush_cards);
}
function isFourCards(cards) {
    return __eval_fourcard(cards);
}
function __eval_fourcard(cards) {
    var rank = __search_fourcard(cards);
    return rank << 4;
}
function __search_fourcard(cards) {
    var res = 0;
    (0, lodash_1.forIn)((0, lodash_1.groupBy)(cards, 'rank'), function (value, key) {
        if (value.length >= 4) {
            res = parseInt(key);
        }
    });
    return res;
}
function isFullHouse(cards) {
    var _a = searchFullHouse(cards), three_card_ranks = _a[0], two_pair_ranks = _a[1];
    return !!(three_card_ranks && two_pair_ranks);
}
function eval_fullhouse(cards) {
    var _a = searchFullHouse(cards), three_card_ranks = _a[0], two_pair_ranks = _a[1];
    return (three_card_ranks === null || three_card_ranks === void 0 ? void 0 : three_card_ranks.rank) << 4 | (two_pair_ranks === null || two_pair_ranks === void 0 ? void 0 : two_pair_ranks.rank);
}
function searchFullHouse(cards) {
    var three_card_ranks = [];
    var two_pair_ranks = [];
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.sortBy)(cards, 'rank'), 'rank'), function (value, key) {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value);
        }
        if (value.length >= 2) {
            two_pair_ranks = two_pair_ranks.concat(value);
        }
    });
    two_pair_ranks = (0, lodash_1.filter)(two_pair_ranks, function (rank) { return !(0, lodash_1.includes)(three_card_ranks, rank); });
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push((0, lodash_1.minBy)(three_card_ranks, 'rank'));
    }
    return [max_rank(three_card_ranks), max_rank(two_pair_ranks)];
}
function max_rank(cards) {
    if (cards.length == 0) {
        return null;
    }
    else {
        return (0, lodash_1.maxBy)(cards, 'rank');
    }
}
function isFlush(cards) {
    return search_flush(cards) !== -1;
}
function eval_flush(cards) {
    return search_flush(cards) << 4;
}
function search_flush(cards) {
    var best_suit_rank = -1;
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.sortBy)(cards, 'suit'), 'suit'), function (value, key) {
        if (value.length >= 5) {
            var max_rank_card = (0, lodash_1.maxBy)(value, 'rank');
            best_suit_rank = Math.max(best_suit_rank, max_rank_card.rank);
        }
    });
    return best_suit_rank;
}
function isStraight(cards) {
    return search_straight(cards) != -1;
}
function eval_straight(cards) {
    return search_straight(cards) << 4;
}
function search_straight(cards) {
    var bit_memo = (0, lodash_1.reduce)(cards, function (memo, card) {
        return memo | 1 << card.rank;
    }, 0);
    var rank = -1;
    (0, lodash_1.forIn)((0, lodash_1.range)(2, 15), function (r) {
        var straight_check = function (acc, i) { return acc & (bit_memo >> (r + i) & 1); };
        if ((0, lodash_1.reduce)((0, lodash_1.range)(0, 5), straight_check, true)) {
            rank = r;
        }
    });
    return rank;
}
function isThreeCard(cards) {
    return search_threeCard(cards) != null;
}
function eval_threeCard(cards) {
    var _a;
    return ((_a = search_threeCard(cards)) === null || _a === void 0 ? void 0 : _a.rank) << 4;
}
function search_threeCard(cards) {
    var three_card_ranks = [];
    var two_pair_ranks = [];
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.sortBy)(cards, 'rank'), 'rank'), function (value, key) {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value);
        }
    });
    two_pair_ranks = (0, lodash_1.filter)(two_pair_ranks, function (rank) { return !(0, lodash_1.includes)(three_card_ranks, rank); });
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push((0, lodash_1.minBy)(three_card_ranks, 'rank'));
    }
    return max_rank(three_card_ranks);
}
function isTwoPairs(cards) {
    return search_twopairs(cards).length === 2;
}
function eval_twopairs(cards) {
    return (0, lodash_1.orderBy)(search_twopairs(cards), undefined, 'desc')[0] << 4 | (0, lodash_1.orderBy)(search_twopairs(cards), undefined, 'desc')[1];
}
function search_twopairs(cards) {
    var ranks = [];
    var memo = 0;
    cards.forEach(function (card) {
        var mask = 1 << card.rank;
        if ((memo & mask) != 0) {
            ranks.push(card.rank);
        }
        memo |= mask;
    });
    return (0, lodash_1.uniq)(ranks);
}
function isOnePair(cards) {
    return eval_onePair(cards) !== 0;
}
function eval_onePair(cards) {
    var rank = 0;
    var memo = 0; // bit memo
    cards.forEach(function (card) {
        var mask = 1 << card.rank;
        if ((memo & mask) != 0) {
            rank = Math.max(rank, card.rank);
        }
        memo |= mask;
    });
    return rank << 4;
}
function eval_holecard(hole) {
    var ranks = (0, lodash_1.orderBy)(hole, 'rank', 'desc');
    console.log(ranks);
    return ranks[0].rank << 4 | ranks[1].rank;
}
var hand1 = new Card(Suit.HEART, Rank.NINE);
var hand2 = new Card(Suit.HEART, Rank.TEN);
var hand3 = new Card(Suit.HEART, Rank.TEN);
var hand4 = new Card(Suit.HEART, Rank.JACK);
console.log(calc_hand_info_flag([hand1, hand2], [card1, card2, card3, card4, card5]));
console.log(calc_hand_info_flag([hand3, hand4], [card1, card2, card3, card4, card5]));
