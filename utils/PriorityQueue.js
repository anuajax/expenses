class PriorityQueue {
    constructor(comparator = (a, b) => a.runAt < b.runAt) {
        this.heap = [];
        this.comparator = comparator;
    }

    parent(idx) { return Math.floor((idx - 1) / 2); }
    leftChild(idx) { return idx * 2 + 1; }
    rightChild(idx) { return idx * 2 + 2; }
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    compare(i, j) {
        return this.comparator(this.heap[i], this.heap[j]);
    }

    heapifyUp() {
        let nodeIdx = this.heap.length - 1;
        while (nodeIdx > 0 && this.compare(nodeIdx, this.parent(nodeIdx))) {
            this.swap(nodeIdx, this.parent(nodeIdx));
            nodeIdx = this.parent(nodeIdx);
        }
    }

    heapifyDown() {
        let nodeIdx = 0;
        while (
            (this.leftChild(nodeIdx) < this.heap.length && this.compare(this.leftChild(nodeIdx), nodeIdx)) ||
            (this.rightChild(nodeIdx) < this.heap.length && this.compare(this.rightChild(nodeIdx), nodeIdx))
        ) {
            const greaterChildIdx = (this.rightChild(nodeIdx) < this.heap.length && this.compare(this.rightChild(nodeIdx), this.leftChild(nodeIdx))) 
                ? this.rightChild(nodeIdx) 
                : this.leftChild(nodeIdx);
            this.swap(nodeIdx, greaterChildIdx);
            nodeIdx = greaterChildIdx;
        }
    }

    push(item) {
        this.heap.push(item);
        this.heapifyUp();
    }

    pop() {
        if (this.size() === 0) return null;
        if (this.size() === 1) return this.heap.pop();

        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return top;
    }

    peek() {
        return this.heap[0] || null;
    }

    size() {
        return this.heap.length;
    }
}
