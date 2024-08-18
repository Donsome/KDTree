class KDTree {
    constructor(circles = [], bucketSize = 10, depth = 0) {
        this.axis = depth % 2;
        this.bucketSize = bucketSize;

        if (circles.length <= bucketSize) {
            this.isLeaf = true;
            this.circles = circles;
            this.left = null;
            this.right = null;
        } else {
            this.isLeaf = false;
            circles.sort((a, b) => a[this.axis === 0 ? 'x' : 'y'] - b[this.axis === 0 ? 'x' : 'y']);
            
            
            const medianIndex = this.nthElement(circles, 0, circles.length - 1, Math.floor(circles.length / 2), this.axis);
            this.node = circles[medianIndex];

            const leftCircles = [];
            const rightCircles = [];
            const splitValue = this.node[this.axis === 0 ? 'x' : 'y'];

            for (const circle of circles) {
                if (circle[this.axis === 0 ? 'x' : 'y'] < splitValue - circle.radius) {
                    leftCircles.push(circle);
                } else if (circle[this.axis === 0 ? 'x' : 'y'] > splitValue + circle.radius) {
                    rightCircles.push(circle);
                } else {
                    leftCircles.push(circle);
                    rightCircles.push(circle);
                }
            }
            this.left = new KDTree(leftCircles, bucketSize, depth + 1);
            this.right = new KDTree(rightCircles, bucketSize, depth + 1);
        }
    }

    rayIntersect(ray, found = [], bounds = new Bounds()) {
        if (!ray.intersectsBounds(bounds)) {
            return found;
        }

        if (this.isLeaf) {
            for (const circle of this.circles) {
                if (ray.intersectsCircle(circle)) {
                    found.push(circle);
                }
            }
            return found;
        }

        const { leftBounds, rightBounds } = bounds.split(this.axis, this.node[this.axis === 0 ? 'x' : 'y']);

        if (ray[this.axis === 0 ? 'directionX' : 'directionY'] >= 0) {
            if (this.left) {
                this.left.rayIntersect(ray, found, leftBounds);
            }
            if (this.right) {
                this.right.rayIntersect(ray, found, rightBounds);
            }
        } else {
            if (this.right) {
                this.right.rayIntersect(ray, found, rightBounds);
            }
            if (this.left) {
                this.left.rayIntersect(ray, found, leftBounds);
            }
        }

        return found;
    }

    draw(context, bounds = new Bounds()) {
        if (this.isLeaf) {
            return;
        }

        context.beginPath();
        if (this.axis === 0) {
            context.moveTo(this.node.x, bounds.minY);
            context.lineTo(this.node.x, bounds.maxY);
        } else {
            context.moveTo(bounds.minX, this.node.y);
            context.lineTo(bounds.maxX, this.node.y);
        }
        context.strokeStyle = 'green';
        context.lineWidth = 1;
        context.stroke();

        const { leftBounds, rightBounds } = bounds.split(this.axis, this.node[this.axis === 0 ? 'x' : 'y']);

        if (this.left) {
            this.left.draw(context, leftBounds);
        }

        if (this.right) {
            this.right.draw(context, rightBounds);
        }
    }

    nthElement(circles, low, high, k, axis) {
        while (low < high) {
            const pivotIndex = this.partition(circles, low, high, axis);
            if (pivotIndex === k) {
                return pivotIndex;
            } else if (pivotIndex < k) {
                low = pivotIndex + 1;
            } else {
                high = pivotIndex - 1;
            }
        }
        return low;
    }


    partition(circles, low, high, axis) {
        const pivot = circles[low];
        while (low < high) {
            while (low < high && circles[high][axis==0?'x':'y'] >= pivot[axis==0?'x':'y']) high--;
            circles[low] = circles[high];
            while (low < high && circles[low][axis==0?'x':'y'] <= pivot[axis==0?'x':'y']) low++;
            circles[high] = circles[low];
        }
        circles[low] = pivot;
        return low;
    }
}