function twoSum(arr, target) {
    let map = new Map()
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (map.has(target - element)) {
            return [i, map.get(target - element)]
        } else {
            map.set(element, i)
        }
    }
}

console.log(twoSum([5,1,3,4,2], 3))