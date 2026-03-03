//@ts-nocheck
/**
 * Path Metrics Utilities
 * Calculate curvature, jerk, and other path quality metrics
 */

const PathMetrics = (function () {
    'use strict';

    /**
     * Calculate mean curvature along path
     * @param {Array<Array<number>>} path - Path points
     * @returns {number} Average curvature in degrees
     */
    function meanCurvature(path) {
        if (path.length < 3) return 0;

        let totalCurvature = 0;
        let count = 0;

        for (let i = 1; i < path.length - 1; i++) {
            const p0 = path[i - 1];
            const p1 = path[i];
            const p2 = path[i + 1];

            // Vectors
            const v1 = normalize(subtract(p1, p0));
            const v2 = normalize(subtract(p2, p1));

            // Angle between vectors
            const dot = Math.max(-1, Math.min(1, dotProduct(v1, v2)));
            const angle = Math.acos(dot) * (180 / Math.PI);

            totalCurvature += angle;
            count++;
        }

        return count > 0 ? totalCurvature / count : 0;
    }

    /**
     * Calculate jerk proxy (sum of acceleration changes)
     * @param {Array<Array<number>>} path - Path points
     * @returns {number} Jerk magnitude
     */
    function jerkProxy(path) {
        if (path.length < 4) return 0;

        // Calculate velocities (first derivative)
        const velocities = [];
        for (let i = 0; i < path.length - 1; i++) {
            velocities.push(subtract(path[i + 1], path[i]));
        }

        // Calculate accelerations (second derivative)
        const accelerations = [];
        for (let i = 0; i < velocities.length - 1; i++) {
            accelerations.push(subtract(velocities[i + 1], velocities[i]));
        }

        // Calculate jerks (third derivative)
        let totalJerk = 0;
        for (let i = 0; i < accelerations.length - 1; i++) {
            const jerk = subtract(accelerations[i + 1], accelerations[i]);
            totalJerk += magnitude(jerk);
        }

        return totalJerk;
    }

    /**
     * Calculate total path length
     * @param {Array<Array<number>>} path - Path points
     * @returns {number} Total length
     */
    function pathLength(path) {
        let length = 0;

        for (let i = 0; i < path.length - 1; i++) {
            length += distance(path[i], path[i + 1]);
        }

        return length;
    }

    /**
     * Calculate path statistics
     * @param {Array<Array<number>>} path - Path points
     * @returns {Object} Statistics object
     */
    function analyze(path) {
        return {
            points: path.length,
            length: pathLength(path),
            curvature: meanCurvature(path),
            jerk: jerkProxy(path)
        };
    }

    /**
     * Compare two paths
     * @param {Array<Array<number>>} rawPath - Raw path
     * @param {Array<Array<number>>} smoothPath - Smooth path
     * @returns {Object} Comparison object
     */
    function compare(rawPath, smoothPath) {
        const rawStats = analyze(rawPath);
        const smoothStats = analyze(smoothPath);

        return {
            raw: rawStats,
            smooth: smoothStats,
            improvement: {
                curvatureReduction: ((rawStats.curvature - smoothStats.curvature) / rawStats.curvature * 100).toFixed(1) + '%',
                jerkReduction: ((rawStats.jerk - smoothStats.jerk) / rawStats.jerk * 100).toFixed(1) + '%',
                densityIncrease: ((smoothStats.points - rawStats.points) / rawStats.points * 100).toFixed(0) + '%'
            }
        };
    }

    // Vector helper functions
    function subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    function magnitude(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }

    function normalize(v) {
        const mag = magnitude(v);
        return mag > 0 ? [v[0] / mag, v[1] / mag, v[2] / mag] : [0, 0, 0];
    }

    function dotProduct(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function distance(a, b) {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const dz = b[2] - a[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Public API
    return {
        meanCurvature,
        jerkProxy,
        pathLength,
        analyze,
        compare
    };

})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathMetrics;
}

// Also attach to window for browser usage
if (typeof window !== 'undefined') {
    window.PathMetrics = PathMetrics;
}

export default PathMetrics