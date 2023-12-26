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
var HIGHCARD = 1 << 21;
var ONEPAIR = 1 << 22;
var TWOPAIR = 1 << 23;
var THREECARD = 1 << 24;
var STRAIGHT = 1 << 25;
var FLUSH = 1 << 26;
var FULLHOUSE = 1 << 27;
var FOURCARD = 1 << 28;
var STRAIGHTFLUSH = 1 << 29;
var card1 = new Card(Suit.HEART, Rank.ACE);
var card2 = new Card(Suit.DIAMOND, Rank.KING);
var card3 = new Card(Suit.SPADE, Rank.QUEEN);
var card4 = new Card(Suit.DIAMOND, Rank.JACK);
var card5 = new Card(Suit.SPADE, Rank.JACK);
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
    return HIGHCARD | eval_highcard(cards);
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
    return __search_fourcard(cards)[0] !== -1;
}
function __eval_fourcard(cards) {
    var _a = __search_fourcard(cards), key1 = _a[0], key2 = _a[1];
    console.log(key1, key2);
    return key1 << 4 | key2;
}
function __search_fourcard(cards) {
    var res = -1;
    (0, lodash_1.forIn)((0, lodash_1.groupBy)(cards, 'rank'), function (value, key) {
        if (value.length >= 4) {
            res = parseInt(key);
        }
    });
    var ordered = (0, lodash_1.orderBy)(cards, 'rank', 'desc');
    // console.log(ordered)
    return [res, ordered.filter(function (item) { return item.rank !== res; })[0].rank];
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
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.orderBy)(cards, 'rank', 'desc'), 'rank'), function (value, key) {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value);
        }
        if (value.length >= 2) {
            two_pair_ranks = two_pair_ranks.concat(value);
        }
    });
    if (two_pair_ranks.length === 6) {
        return [max_rank(three_card_ranks), min_rank(two_pair_ranks)];
    }
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
function min_rank(cards) {
    if (cards.length == 0) {
        return null;
    }
    else {
        return (0, lodash_1.minBy)(cards, 'rank');
    }
}
function isFlush(cards) {
    return search_flush(cards).length !== 0;
}
function eval_flush(cards) {
    var res = 0;
    search_flush(cards).forEach(function (item, index) {
        res |= item << index * 4;
    });
    return res;
}
function search_flush(cards) {
    var best_suit_rank = -1;
    var suited_cards_rank = [];
    (0, lodash_1.forIn)((0, lodash_1.groupBy)((0, lodash_1.sortBy)(cards, 'suit'), 'suit'), function (value, key) {
        if (value.length >= 5) {
            var max_rank_card = (0, lodash_1.maxBy)(value, 'rank');
            best_suit_rank = Math.max(best_suit_rank, max_rank_card.rank);
            suited_cards_rank = value.map(function (item) { return item.rank; });
        }
    });
    suited_cards_rank = (0, lodash_1.sortBy)(suited_cards_rank);
    return (0, lodash_1.slice)(suited_cards_rank, -5);
}
function isStraight(cards) {
    return search_straight(cards) != -1;
}
function eval_straight(cards) {
    return search_straight(cards) << 4;
}
function search_straight(cards) {
    var sortedCards = (0, lodash_1.uniq)((0, lodash_1.sortBy)(cards, 'rank').map(function (item) { return item.rank; }));
    // let bit_memo = reduce(sortBy(cards, 'rank'), (memo, card) => {
    //     return memo | 1 << card.rank
    // }, 0)
    // console.log(sortedCards, 'sortedCards')
    // TODO: check A2345
    var rank = -1;
    // 检查顺子条件：至少有五张牌是连续递增的
    for (var i = 0; i <= sortedCards.length - 5; i++) {
        var isValidStraight = true;
        for (var j = i; j < i + 4; j++) {
            if (sortedCards[j + 1] - sortedCards[j] !== 1) {
                isValidStraight = false;
                break;
            }
        }
        if (isValidStraight) {
            rank = sortedCards[i + 4];
        }
    }
    return rank;
}
function isThreeCard(cards) {
    return !!search_threeCard(cards)[0];
}
function eval_threeCard(cards) {
    var _a, _b, _c;
    var key1 = (_a = search_threeCard(cards)[0]) === null || _a === void 0 ? void 0 : _a.rank;
    var key2 = (_b = search_threeCard(cards)[1]) === null || _b === void 0 ? void 0 : _b.rank;
    var key3 = (_c = search_threeCard(cards)[2]) === null || _c === void 0 ? void 0 : _c.rank;
    return key1 << 8 | key2 << 4 | key3;
}
function search_threeCard(cards) {
    var three_card_ranks = [];
    var two_pair_ranks = [];
    var sortedCards = (0, lodash_1.orderBy)(cards, 'rank', 'desc');
    (0, lodash_1.forIn)((0, lodash_1.groupBy)(sortedCards, 'rank'), function (value, key) {
        if (value.length >= 3) {
            three_card_ranks = three_card_ranks.concat(value);
        }
    });
    two_pair_ranks = (0, lodash_1.filter)(two_pair_ranks, function (rank) { return !(0, lodash_1.includes)(three_card_ranks, rank); });
    if (three_card_ranks.length === 2) {
        two_pair_ranks.push((0, lodash_1.minBy)(three_card_ranks, 'rank'));
    }
    var threeCardKey = max_rank(three_card_ranks);
    var cards_remove_threecards = (0, lodash_1.uniq)((0, lodash_1.filter)(sortedCards, function (rank) { return !(0, lodash_1.includes)(three_card_ranks, rank); }));
    var key1 = cards_remove_threecards[0];
    var key2 = cards_remove_threecards[1];
    return [threeCardKey, key1, key2];
}
function isTwoPairs(cards) {
    var twoPairsCards = search_twopairs(cards)[0];
    return twoPairsCards.length === 2;
}
function eval_twopairs(cards) {
    var searchResult = search_twopairs(cards);
    var key1 = searchResult[0][0];
    var key2 = searchResult[0][1];
    var key3 = searchResult[1];
    return key1 << 8 | key2 << 4 | key3;
}
function search_twopairs(cards) {
    var ranks = [];
    var memo = 0;
    var orderCards = (0, lodash_1.orderBy)(cards, 'rank', 'desc');
    orderCards.forEach(function (card) {
        var mask = 1 << card.rank;
        if ((memo & mask) != 0) {
            ranks.push(card.rank);
        }
        memo |= mask;
    });
    var filteredCards = (0, lodash_1.filter)(orderCards, function (card) {
        return !ranks.includes(card.rank);
    });
    return [(0, lodash_1.uniq)(ranks), filteredCards[0].rank];
}
function isOnePair(cards) {
    return search_onePair(cards)[0] !== 0;
}
function eval_onePair(cards) {
    var searchResult = search_onePair(cards);
    var key1 = searchResult[0];
    var key2 = searchResult[1];
    var key3 = searchResult[2];
    var key4 = searchResult[3];
    return key1 << 16 | key2 << 8 | key3 << 4 | key4;
}
function search_onePair(cards) {
    var rank = 0;
    var memo = 0; // bit memo
    var orderCards = (0, lodash_1.orderBy)(cards, 'rank', 'desc');
    cards.forEach(function (card) {
        var mask = 1 << card.rank;
        if ((memo & mask) != 0) {
            rank = Math.max(rank, card.rank);
        }
        memo |= mask;
    });
    var filteredCards = (0, lodash_1.filter)(orderCards, function (card) {
        return card.rank !== rank;
    });
    return [rank, filteredCards[0].rank, filteredCards[1].rank, filteredCards[2].rank];
}
function eval_highcard(cards) {
    var orderCards = (0, lodash_1.slice)((0, lodash_1.sortBy)(cards, 'rank'), -5);
    var res = 0;
    orderCards.forEach(function (card, index) {
        res |= card.rank << (index * 4);
    });
    return res;
}
var hand1 = new Card(Suit.DIAMOND, Rank.NINE);
var hand2 = new Card(Suit.DIAMOND, Rank.EIGHT);
var hand3 = new Card(Suit.DIAMOND, Rank.EIGHT);
var hand4 = new Card(Suit.DIAMOND, Rank.SEVEN);
console.log(calc_hand_info_flag([hand1, hand2], [card1, card2, card3, card4, card5]));
console.log(calc_hand_info_flag([hand3, hand4], [card1, card2, card3, card4, card5]));
function generateDecks() {
    var decks = [];
    (0, lodash_1.forIn)(Suit, function (suit) {
        (0, lodash_1.forIn)(Rank, function (rank) {
            if ((0, lodash_1.isNumber)(rank) && (0, lodash_1.isString)(suit)) {
                decks.push(new Card(suit, rank));
            }
        });
    });
    return (0, lodash_1.shuffle)(decks);
}
var Player = /** @class */ (function () {
    function Player(name) {
        this.name = name;
    }
    Player.prototype.dealHands = function (decks) {
        var _this = this;
        this.hands = decks.splice(0, 2);
        this.hands.forEach(function (item) {
            console.log(_this.name + "hands: " + item.rank + ", " + item.suit);
        });
    };
    Player.prototype.logPoker = function (publicCards) {
        // console.log(`${this.name}: hands: ${this.hands}, final: ${calc_hand_info_flag(this.hands, publicCards)}`)
    };
    Player.prototype.calc_poker = function (publicCards) {
        return calc_hand_info_flag(this.hands, publicCards);
    };
    return Player;
}());
var playerlist = [];
for (var i = 0; i < 10; i++) {
    playerlist.push(new Player("player" + i));
}
function start() {
    var decks = generateDecks();
    playerlist.forEach(function (player) {
        player.dealHands(decks);
    });
    var all = [];
    var publicCards = (0, lodash_1.slice)(decks, 0, 5);
    console.log(publicCards, 'publicCards');
    playerlist.forEach(function (player) {
        all.push({ name: player.name, pw: player.calc_poker(publicCards) });
    });
    console.log((0, lodash_1.maxBy)(all, 'pw').name, "won");
}
// start()
