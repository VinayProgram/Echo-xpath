//@ts-nocheck
/**
 * Simple A* Pathfinding
 * Basic grid-based A* for demo purposes
 */

const SimpleAStar = (function () {
    'use strict';

    /**
     * Find path from start to goal avoiding obstacles
     * @param {Array<number>} start - [x, y, z] start position
     * @param {Array<number>} goal - [x, y, z] goal position
     * @param {Array<Object>} obstacles - [{pos: [x,y,z], radius: float}]
     * @param {Object} options - Grid options
     * @returns {Array<Array<number>>} Path waypoints
     */
    function findPath(start, goal, obstacles = [], options = {}) {
        const gridSize = options.gridSize || 1.0;
        const maxIterations = options.maxIterations || 10000;

        // Convert to grid coordinates
        const startGrid = worldToGrid(start, gridSize);
        const goalGrid = worldToGrid(goal, gridSize);

        // A* search
        const openSet = [startGrid];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(gridKey(startGrid), 0);
        fScore.set(gridKey(startGrid), heuristic(startGrid, goalGrid));

        let iterations = 0;

        while (openSet.length > 0 && iterations < maxIterations) {
            iterations++;

            // Get node with lowest fScore
            let currentIndex = 0;
            let lowestF = fScore.get(gridKey(openSet[0])) || Infinity;

            for (let i = 1; i < openSet.length; i++) {
                const f = fScore.get(gridKey(openSet[i])) || Infinity;
                if (f < lowestF) {
                    lowestF = f;
                    currentIndex = i;
                }
            }

            const current = openSet[currentIndex];

            // Reached goal?
            if (gridKey(current) === gridKey(goalGrid)) {
                return reconstructPath(cameFrom, current, gridSize);
            }

            // Move current from open to closed
            openSet.splice(currentIndex, 1);
            closedSet.add(gridKey(current));

            // Check neighbors
            const neighbors = getNeighbors(current);

            for (const neighbor of neighbors) {
                const neighborKey = gridKey(neighbor);

                if (closedSet.has(neighborKey)) continue;

                // Check if neighbor collides with obstacles
                const neighborWorld = gridToWorld(neighbor, gridSize);
                if (collidesWithObstacles(neighborWorld, obstacles)) {
                    closedSet.add(neighborKey);
                    continue;
                }

                const tentativeG = (gScore.get(gridKey(current)) || Infinity) +
                    heuristic(current, neighbor);

                if (!openSet.find(n => gridKey(n) === neighborKey)) {
                    openSet.push(neighbor);
                }

                if (tentativeG >= (gScore.get(neighborKey) || Infinity)) {
                    continue;
                }

                // This path is the best so far
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + heuristic(neighbor, goalGrid));
            }
        }

        // No path found - return direct line
        console.warn('[A*] No path found, returning direct line');
        return [start, goal];
    }

    /**
     * Reconstruct path from A* result
     */
    function reconstructPath(cameFrom, current, gridSize) {
        const path = [gridToWorld(current, gridSize)];

        while (cameFrom.has(gridKey(current))) {
            current = cameFrom.get(gridKey(current));
            path.unshift(gridToWorld(current, gridSize));
        }

        return path;
    }

    /**
     * Get 8-connected neighbors (4 cardinal + 4 diagonal)
     */
    function getNeighbors(node) {
        const [x, y, z] = node;
        return [
            [x + 1, y, z],     // Right
            [x - 1, y, z],     // Left
            [x, y, z + 1],     // Forward
            [x, y, z - 1],     // Back
            [x + 1, y, z + 1], // Diagonal
            [x + 1, y, z - 1],
            [x - 1, y, z + 1],
            [x - 1, y, z - 1]
        ];
    }

    /**
     * Manhattan + diagonal heuristic
     */
    function heuristic(a, b) {
        const dx = Math.abs(b[0] - a[0]);
        const dz = Math.abs(b[2] - a[2]);
        // Diagonal distance
        return (dx + dz) + (Math.SQRT2 - 2) * Math.min(dx, dz);
    }

    /**
     * Check if point collides with any obstacle
     */
    function collidesWithObstacles(point, obstacles) {
        for (const obstacle of obstacles) {
            const dx = point[0] - obstacle.pos[0];
            const dy = point[1] - obstacle.pos[1];
            const dz = point[2] - obstacle.pos[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < obstacle.radius) {
                return true;
            }
        }
        return false;
    }

    /**
     * Convert world position to grid coordinates
     */
    function worldToGrid(pos, gridSize) {
        return [
            Math.round(pos[0] / gridSize),
            Math.round(pos[1] / gridSize),
            Math.round(pos[2] / gridSize)
        ];
    }

    /**
     * Convert grid coordinates to world position
     */
    function gridToWorld(gridPos, gridSize) {
        return [
            gridPos[0] * gridSize,
            gridPos[1] * gridSize,
            gridPos[2] * gridSize
        ];
    }

    /**
     * Create unique key for grid position
     */
    function gridKey(pos) {
        return `${pos[0]},${pos[1]},${pos[2]}`;
    }

    // Public API
    return {
        findPath
    };

})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleAStar;
}

// Also attach to window for browser usage
if (typeof window !== 'undefined') {
    window.SimpleAStar = SimpleAStar;
}

export default SimpleAStar