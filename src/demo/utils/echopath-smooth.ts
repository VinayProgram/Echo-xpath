//@ts-nocheck

/**
 * EchoPath Smooth - Web Kit
 * Three.js/WebGL path smoothing module
 * 
 * @version 1.0.0
 * @author EchoPath XR
 * @license Indie tier - for Vinay Tandale partnership
 */

const EchoPath = (function () {
    'use strict';

    // Quality presets
    const QUALITY_PRESETS = {
        low: {
            density: 6,
            laplacianIterations: 20,
            laplacianAlpha: 0.30,
            repelIterations: 15,
            repelAlpha: 0.12,
            repelRadius: 8.0
        },
        medium: {
            density: 10,
            laplacianIterations: 30,
            laplacianAlpha: 0.38,
            repelIterations: 25,
            repelAlpha: 0.15,
            repelRadius: 10.0
        },
        high: {
            density: 12,
            laplacianIterations: 40,
            laplacianAlpha: 0.42,
            repelIterations: 36,
            repelAlpha: 0.18,
            repelRadius: 13.0
        },
        ultra: {
            density: 16,
            laplacianIterations: 50,
            laplacianAlpha: 0.45,
            repelIterations: 45,
            repelAlpha: 0.20,
            repelRadius: 15.0
        }
    };

    /**
     * Main smoothing function
     * @param {Array<Array<number>>} points - Input waypoints [[x,y,z], ...]
     * @param {Object} options - Smoothing options
     * @returns {Array<Array<number>>} Smoothed path points
     */
    function smooth(points, options = {}) {
        // Validate input
        if (!points || points.length < 2) {
            console.warn('[EchoPath] Need at least 2 points to smooth');
            return points;
        }

        // Parse options
        const opts = parseOptions(options);

        // Convert to 3D if needed
        const points3D = ensureThreeDimensional(points);

        // Step 1: Catmull-Rom spline interpolation
        let smoothed = catmullRomSpline(points3D, opts.density);

        // Step 2: Laplacian smoothing
        smoothed = laplacianSmooth(
            smoothed,
            opts.laplacianIterations,
            opts.laplacianAlpha
        );

        // Step 3: Obstacle repulsion (if obstacles provided)
        if (opts.obstacles && opts.obstacles.length > 0) {
            smoothed = repelFromObstacles(
                smoothed,
                opts.obstacles,
                opts.repelIterations,
                opts.repelAlpha,
                opts.repelRadius
            );
        }

        // Step 4: Final light smoothing
        smoothed = laplacianSmooth(smoothed, 18, 0.25);

        // Guarantee endpoints match exactly
        smoothed[0] = points3D[0].slice();
        smoothed[smoothed.length - 1] = points3D[points3D.length - 1].slice();

        // Convert back to 2D if input was 2D
        if (opts.smooth2D) {
            smoothed = smoothed.map(p => [p[0], p[2]]);
        }

        return smoothed;
    }

    /**
     * Parse and merge options with defaults
     */
    function parseOptions(options) {
        const quality = options.quality || 'high';
        const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.high;

        return {
            density: options.density || preset.density,
            laplacianIterations: options.laplacianIterations || preset.laplacianIterations,
            laplacianAlpha: options.laplacianAlpha || preset.laplacianAlpha,
            repelIterations: options.repelIterations || preset.repelIterations,
            repelAlpha: options.repelAlpha || preset.repelAlpha,
            repelRadius: options.repelRadius || preset.repelRadius,
            smooth2D: options.smooth2D || false,
            obstacles: options.obstacles || []
        };
    }

    /**
     * Ensure all points are 3D (add y=0 if needed)
     */
    function ensureThreeDimensional(points) {
        return points.map(p => {
            if (p.length === 2) return [p[0], 0, p[1]]; // 2D -> 3D
            return p.slice(); // Clone 3D point
        });
    }

    /**
     * Catmull-Rom spline interpolation
     */
    function catmullRomSpline(points, samplesPerSegment) {
        if (points.length < 2) return points;

        // Handle short paths
        if (points.length === 2) {
            return linearInterpolate(points[0], points[1], samplesPerSegment);
        }

        // Extend endpoints for proper curve behavior
        const extended = [
            points[0],
            ...points,
            points[points.length - 1]
        ];

        const result = [];

        // Guarantee start point
        result.push(points[0].slice());

        // Interpolate between each segment
        for (let i = 1; i < extended.length - 2; i++) {
            const p0 = extended[i - 1];
            const p1 = extended[i];
            const p2 = extended[i + 1];
            const p3 = extended[i + 2];

            // Generate samples (skip t=0 to avoid duplicates)
            for (let s = 1; s <= samplesPerSegment; s++) {
                const t = s / samplesPerSegment;
                const point = catmullRomPoint(p0, p1, p2, p3, t);
                result.push(point);
            }
        }

        // Guarantee end point
        result.push(points[points.length - 1].slice());

        return result;
    }

    /**
     * Calculate single point on Catmull-Rom curve
     */
    function catmullRomPoint(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;

        const result = [];
        for (let i = 0; i < 3; i++) {
            result[i] = 0.5 * (
                (2 * p1[i]) +
                (-p0[i] + p2[i]) * t +
                (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 +
                (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3
            );
        }

        return result;
    }

    /**
     * Linear interpolation between two points (for 2-point paths)
     */
    function linearInterpolate(p0, p1, samples) {
        const result = [p0.slice()];

        for (let i = 1; i <= samples; i++) {
            const t = i / (samples + 1);
            const point = [
                p0[0] + (p1[0] - p0[0]) * t,
                p0[1] + (p1[1] - p0[1]) * t,
                p0[2] + (p1[2] - p0[2]) * t
            ];
            result.push(point);
        }

        result.push(p1.slice());
        return result;
    }

    /**
     * Laplacian smoothing
     */
    function laplacianSmooth(points, iterations, alpha) {
        if (points.length < 3) return points;

        let smoothed = points.map(p => p.slice()); // Deep copy

        for (let iter = 0; iter < iterations; iter++) {
            const temp = smoothed.map(p => p.slice());

            // Keep endpoints fixed
            for (let i = 1; i < smoothed.length - 1; i++) {
                const prev = smoothed[i - 1];
                const next = smoothed[i + 1];
                const current = smoothed[i];

                // Average of neighbors
                const avg = [
                    (prev[0] + next[0]) * 0.5,
                    (prev[1] + next[1]) * 0.5,
                    (prev[2] + next[2]) * 0.5
                ];

                // Move toward average
                temp[i] = [
                    current[0] + alpha * (avg[0] - current[0]),
                    current[1] + alpha * (avg[1] - current[1]),
                    current[2] + alpha * (avg[2] - current[2])
                ];
            }

            smoothed = temp;
        }

        return smoothed;
    }

    /**
     * Repel path from obstacles
     */
    function repelFromObstacles(points, obstacles, iterations, alpha, influenceRadius) {
        if (obstacles.length === 0) return points;

        let repelled = points.map(p => p.slice());

        for (let iter = 0; iter < iterations; iter++) {
            // Keep endpoints fixed
            for (let i = 1; i < repelled.length - 1; i++) {
                const point = repelled[i];

                // Check each obstacle
                for (const obstacle of obstacles) {
                    const obs = obstacle.pos;
                    const radius = obstacle.radius;

                    // Vector from obstacle to point
                    const dx = point[0] - obs[0];
                    const dy = point[1] - obs[1];
                    const dz = point[2] - obs[2];
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    const threshold = radius + influenceRadius;

                    if (distance < threshold && distance > 0.0001) {
                        // Normalize direction
                        const dirX = dx / distance;
                        const dirY = dy / distance;
                        const dirZ = dz / distance;

                        // Push strength (stronger when closer)
                        const strength = (threshold - distance) / influenceRadius;

                        // Push point away from obstacle
                        repelled[i] = [
                            point[0] + dirX * strength * alpha,
                            point[1] + dirY * strength * alpha,
                            point[2] + dirZ * strength * alpha
                        ];
                    }
                }
            }
        }

        return repelled;
    }

    // Public API
    return {
        smooth,
        version: '1.0.0'
    };

})();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EchoPath;
}

// Also attach to window for browser usage
if (typeof window !== 'undefined') {
    window.EchoPath = EchoPath;
}

export default EchoPath;