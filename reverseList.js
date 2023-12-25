var ListNode = /** @class */ (function () {
    function ListNode(value) {
        this.next = null;
        this.value = value;
    }
    return ListNode;
}());
var node1 = new ListNode(1);
var node2 = new ListNode(2);
var node3 = new ListNode(3);
var node4 = new ListNode(4);
var node5 = new ListNode(5);
node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;
node5.next = null;
function reverseList(head) {
    var prev = null;
    var curr = head;
    while (curr !== null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
function reverseListBetween(head, m, n) {
    var newNode = new ListNode(0);
    newNode.next = head;
    var prev = newNode;
    for (var i = 0; i < m - 1; i++) {
        prev = prev.next;
    }
    var curr = prev.next;
    for (var j = m; j < n; j++) {
        var next = curr.next;
        curr.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    return newNode.next;
}
console.log(reverseListBetween(node1, 2, 4));
