function main() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let circles = [];
    let kdTree;

    function generateCircles(numCircles, radius) {
        circles = [];
        for (let i = 0; i < numCircles; i++) {
            circles.push(Circle.randomCircle(canvas.width, canvas.height, radius));
        }
        kdTree = new KDTree(circles);
    }

    function updateRay() {
        const originX = parseFloat(document.getElementById('originX').value);
        const originY = parseFloat(document.getElementById('originY').value);
        const directionX = parseFloat(document.getElementById('directionX').value);
        const directionY = parseFloat(document.getElementById('directionY').value);
        const ray = new Ray(originX, originY, directionX, directionY);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw circles
        circles.forEach(circle => circle.draw(context));

        // Draw KDTree
        kdTree.draw(context);

        // Draw the ray
        ray.draw(context);

        // Find circles intersected by the ray
        const intersectedCircles = kdTree.rayIntersect(ray);

        // Highlight intersected circles
        intersectedCircles.forEach(circle => {
            context.beginPath();
            context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#FF0000';
            context.stroke();
        });
    }

    // Attach input event listeners to sliders
    document.getElementById('originX').addEventListener('input', function() {
        document.getElementById('originXValue').textContent = this.value;
        updateRay();
    });
    document.getElementById('originY').addEventListener('input', function() {
        document.getElementById('originYValue').textContent = this.value;
        updateRay();
    });
    document.getElementById('directionX').addEventListener('input', function() {
        document.getElementById('directionXValue').textContent = this.value;
        updateRay();
    });
    document.getElementById('directionY').addEventListener('input', function() {
        document.getElementById('directionYValue').textContent = this.value;
        updateRay();
    });
    document.getElementById('numCircles').addEventListener('input', function() {
        document.getElementById('numCirclesValue').textContent = this.value;
        generateCircles(parseInt(this.value), 5);
        updateRay();
    });

    // Initial setup
    generateCircles(300, 5);
    updateRay();
}
main();