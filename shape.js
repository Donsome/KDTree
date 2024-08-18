class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue'; 
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';  
        context.stroke();
    }

    static randomCircle(maxWidth, maxHeight, radius) {
        const x = Math.random() * (maxWidth - radius * 2) + radius;
        const y = Math.random() * (maxHeight - radius * 2) + radius;
        return new Circle(x, y, radius);
    }
}


class Ray {
    constructor(originX, originY, directionX, directionY) {
        this.originX = originX;
        this.originY = originY;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = directionX / magnitude;
        this.directionY = directionY / magnitude;
    }

    intersectsCircle(circle) {
        const { originX, originY, directionX, directionY } = this;
        const { x: cx, y: cy, radius: r } = circle;

        const fx = originX - cx;
        const fy = originY - cy;

        const a = directionX * directionX + directionY * directionY;
        const b = 2 * (fx * directionX + fy * directionY);
        const c = (fx * fx + fy * fy) - r * r;

        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return false;
        }

        discriminant = Math.sqrt(discriminant);

        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);

        return t1 >= 0 || t2 >= 0;
    }

    intersectsBounds(bounds) {
        const { originX, originY, directionX, directionY } = this;
        const { minX, maxX, minY, maxY } = bounds;

        const tMin = (minX - originX) / directionX;
        const tMax = (maxX - originX) / directionX;
        const t1 = Math.min(tMin, tMax);
        const t2 = Math.max(tMin, tMax);

        const tMinY = (minY - originY) / directionY;
        const tMaxY = (maxY - originY) / directionY;
        const t3 = Math.min(tMinY, tMaxY);
        const t4 = Math.max(tMinY, tMaxY);

        const tStart = Math.max(t1, t3);
        const tEnd = Math.min(t2, t4);

        return tEnd >= tStart && tEnd >= 0;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.originX, this.originY);
        context.lineTo(this.originX + this.directionX * 2000, this.originY + this.directionY * 2000);
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.stroke();
    }
}


class Bounds {
    constructor(minX = 0, minY = 0, maxX = 1000, maxY = 1000) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    split(axis, value) {
        const leftBounds = new Bounds(this.minX, this.minY, this.maxX, this.maxY);
        const rightBounds = new Bounds(this.minX, this.minY, this.maxX, this.maxY);

        if (axis === 0) { // Vertical split
            leftBounds.maxX = value;
            rightBounds.minX = value;
        } else { // Horizontal split
            leftBounds.maxY = value;
            rightBounds.minY = value;
        }

        return { leftBounds, rightBounds };
    }
}