class ListNode { 
    value: number
    next: ListNode | null = null
    constructor(value) {
        this.value = value
    }
    
}
let node1 = new ListNode(1)
let node2 = new ListNode(2)
let node3 = new ListNode(3)
let node4 = new ListNode(4)
let node5 = new ListNode(5)

node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node5
node5.next = null


function reverseList(head: ListNode): ListNode | null {
    let prev: ListNode | null = null
    let curr: ListNode | null = head

    while (curr !== null) {
        let next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
}

function reverseListBetween(head: ListNode, m: number, n: number): ListNode {
    let newNode : ListNode | null = new ListNode(0)
    newNode.next = head

    let prev = newNode
    for (let i = 0; i < m - 1; i++) {
        prev = prev.next
    }
    let curr = prev.next

    for (let j = m; j < n; j++) {
        let next = curr.next
        curr.next = next.next
        next.next = prev.next
        prev.next = next
    }
    return newNode.next

}


console.log(reverseListBetween(node1, 2, 4))
