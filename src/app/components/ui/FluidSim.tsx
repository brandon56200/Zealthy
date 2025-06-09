'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec2 Rot(vec2 p, float t) {
    float c = cos(t); float s = sin(t);
    return vec2(p.x*c+p.y*s, -p.x*s+p.y*c);
  }

  vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    r = r-0.5;
    float t = -uTime*.5;
    r.xy = Rot(r.xy,t);
    return r;
  }

  const float F3 = 0.3333333;
  const float G3 = 0.1666667;

  float noise(vec3 p) {
    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));
    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e*(1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);
    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;
    vec4 w, d;
    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);
    w = max(0.6 - w, 0.0);
    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);
    w *= w;
    w *= w;
    d *= w;
    return dot(d, vec4(52.0));
  }

  float pot(vec2 pos) {
    float t = uTime * 0.0005;
    vec3 p = vec3(pos + vec2(uTime * 0.002, 0.0), t);
    float n = noise(p);
    n += 0.5 * noise(p * 2.13);
    n += 2.0 * noise(vec3(pos * 0.333, t));
    return n;
  }

  vec2 field(vec2 pos) {
    float s = 1.0;
    pos *= s;
    float n = pot(pos);
    float e = 0.1;
    float nx = pot(vec2(pos + vec2(e, 0.0)));
    float ny = pot(vec2(pos + vec2(0.0, e)));
    return vec2(-(ny-n), nx-n) / e;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centeredUv = uv * 2.0 - 1.0;
    float mouseDist = length(vUv - uMouse);
    float mouseInfluence = smoothstep(0.25, 0.0, mouseDist);
    float squiggle = 0.12 * sin(centeredUv.x * 4.0 + uTime * 0.175 + noise(vec3(centeredUv.x * 2.0, centeredUv.y * 2.0, uTime * 0.025)) * 2.0);
    float squigglyY = centeredUv.y + squiggle;
    float bandNoise = noise(vec3(centeredUv * 2.0, uTime * 0.005));
    float bandPos = (centeredUv.y + bandNoise * 0.5) * 4.0;
    float bandFrac = fract(bandPos);
    float bandIdx = floor(bandPos);
    float blend = smoothstep(0.35, 0.5, bandFrac) * (1.0 - smoothstep(0.5, 0.65, bandFrac));
    vec3 colorA = mod(bandIdx, 3.0) == 0.0 ? 
      vec3(0.95, 0.98, 0.95) :
      mod(bandIdx, 3.0) == 1.0 ?
        vec3(0.68, 0.96, 0.69) :
        vec3(0.56, 0.84, 0.65);
    vec3 colorB = mod(bandIdx + 1.0, 3.0) == 0.0 ? 
      vec3(0.95, 0.98, 0.95) :
      mod(bandIdx + 1.0, 3.0) == 1.0 ?
        vec3(0.68, 0.96, 0.69) :
        vec3(0.56, 0.84, 0.65);
    vec3 baseColor = mix(colorA, colorB, blend);
    vec2 flow = field(centeredUv * 2.0) * (0.004 + 0.0225 * mouseInfluence);
    float swirlStrength = 0.03 + 0.09 * mouseInfluence;
    float swirl = sin(centeredUv.x * 2.0 + uTime * 0.175) * swirlStrength;
    vec2 swirlFlow = vec2(-centeredUv.y, centeredUv.x) * swirl;
    float dist = length(centeredUv);
    float angle = atan(centeredUv.y, centeredUv.x);
    float radialNoise = noise(vec3(angle * 2.0, dist * 2.0, uTime * 0.005));
    vec2 radialFlow = vec2(cos(angle), sin(angle)) * radialNoise * (0.002 + 0.01125 * mouseInfluence);
    vec2 distortedUV = centeredUv + flow + swirlFlow + radialFlow;
    float distortedBandNoise = noise(vec3(distortedUV * 2.0, uTime * 0.005));
    float distortedBandPos = (distortedUV.y + distortedBandNoise * 0.5) * 4.0;
    float distortedBandIdx = floor(distortedBandPos);
    bool isMainWhite = mod(distortedBandIdx, 3.0) == 0.0;
    bool isLightGreen = mod(distortedBandIdx, 3.0) == 1.0;
    bool isDarkGreen = mod(distortedBandIdx, 3.0) == 2.0;
    float stripePattern = mod(distortedBandPos * 4.0, 1.0);
    bool isStripe = stripePattern < 0.15;
    vec3 finalColor = isMainWhite ? vec3(0.95, 0.98, 0.95) :
      (isLightGreen || isDarkGreen) && isStripe ? vec3(0.95, 0.98, 0.95) :
      isLightGreen ? vec3(0.68, 0.96, 0.69) :
      vec3(0.56, 0.84, 0.65);
    finalColor += vec3(0.0, length(flow) * 0.1, 0.0);
    finalColor = clamp(finalColor, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Add type for FluidPlane props
interface FluidPlaneProps {
  mouse: React.RefObject<THREE.Vector2>;
  materialRef: React.RefObject<THREE.ShaderMaterial | null>;
}

function FluidPlane({ mouse, materialRef }: FluidPlaneProps) {
  const { viewport } = useThree();
  const lerpedMouse = useRef(new THREE.Vector2(0.5, 0.5));
  
  // Create the material with useMemo to prevent recreations
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Update the ref
  useEffect(() => {
    materialRef.current = material;
  }, [material, materialRef]);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update uniforms directly
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    lerpedMouse.current.lerp(mouse.current, 0.05);
    materialRef.current.uniforms.uMouse.value = lerpedMouse.current;
    
    // Mark material as needing update
    materialRef.current.needsUpdate = true;
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive object={material} />
    </mesh>
  );
}

export default function FluidSim() {
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const [isMounted, setIsMounted] = useState(false);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    // Set mounted state
    setIsMounted(true);
    clockRef.current.start();

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - (e.clientY / window.innerHeight);
      mouse.current.set(x, y);
    };

    // Handle window resize
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clockRef.current.getElapsedTime();
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      setIsMounted(false);
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
    };
  }, []); // Remove pathname dependency

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <FluidPlane mouse={mouse} materialRef={materialRef} />
      </Canvas>
    </div>
  );
} 