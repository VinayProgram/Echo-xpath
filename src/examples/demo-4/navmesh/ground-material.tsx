import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

/**
 * Futuristic sci-fi grid ground shader
 * Features: animated pulse grid, subtle glow, depth-fade edges
 */
const GroundShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new THREE.Color('#0a0a12'),    // Deep dark base
        uColor2: new THREE.Color('#0d1117'),    // Slightly lighter
        uGridColor: new THREE.Color('#00f3ff'),  // Cyan grid lines
        uGridColor2: new THREE.Color('#1a3a4a'), // Subtle secondary grid
        uPulseColor: new THREE.Color('#00f3ff'), // Pulse color
        uFadeRadius: 24.0,
    },
    // Vertex shader
    `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
    // Fragment shader
    `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uGridColor;
    uniform vec3 uGridColor2;
    uniform vec3 uPulseColor;
    uniform float uFadeRadius;
    
    varying vec2 vUv;
    varying vec3 vWorldPos;
    
    float grid(vec2 pos, float size, float thickness) {
      vec2 grid = abs(fract(pos / size - 0.5) - 0.5) / fwidth(pos / size);
      float line = min(grid.x, grid.y);
      return 1.0 - min(line, 1.0);
    }
    
    void main() {
      vec2 worldXZ = vWorldPos.xz;
      
      // Distance from center for edge fade
      float dist = length(worldXZ);
      float edgeFade = 1.0 - smoothstep(uFadeRadius * 0.6, uFadeRadius, dist);
      
      // Base color: subtle radial gradient
      float radialGrad = smoothstep(0.0, uFadeRadius, dist);
      vec3 baseColor = mix(uColor1, uColor2, radialGrad * 0.5);
      
      // Major grid (every 5 units)
      float majorGrid = grid(worldXZ, 5.0, 0.02);
      
      // Minor grid (every 1 unit)  
      float minorGrid = grid(worldXZ, 1.0, 0.01);
      
      // Micro grid (every 0.5 units) - very subtle
      float microGrid = grid(worldXZ, 0.5, 0.005);
      
      // Animated pulse ring expanding from center
      float pulseRing = abs(dist - mod(uTime * 4.0, uFadeRadius * 1.5));
      float pulse = smoothstep(1.5, 0.0, pulseRing) * 0.15;
      
      // Second slower pulse
      float pulseRing2 = abs(dist - mod(uTime * 2.0 + 12.0, uFadeRadius * 1.5));
      float pulse2 = smoothstep(2.0, 0.0, pulseRing2) * 0.08;
      
      // Compose grid layers
      vec3 color = baseColor;
      color = mix(color, uGridColor2, microGrid * 0.08 * edgeFade);
      color = mix(color, uGridColor2, minorGrid * 0.15 * edgeFade);
      color = mix(color, uGridColor, majorGrid * 0.35 * edgeFade);
      
      // Add pulse glow
      color += uPulseColor * pulse * edgeFade;
      color += uPulseColor * pulse2 * edgeFade;
      
      // Subtle center glow
      float centerGlow = exp(-dist * 0.08) * 0.06;
      color += uGridColor * centerGlow;
      
      // Final edge fade to black
      color *= edgeFade;
      
      // Alpha: visible in center, fades at edges
      float alpha = edgeFade * 0.95;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ GroundShaderMaterial })

// Type declaration for R3F JSX
declare module '@react-three/fiber' {
    interface ThreeElements {
        groundShaderMaterial: any
    }
}

export default GroundShaderMaterial
