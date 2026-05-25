import { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  baseX: number; // percentage (0 - 100)
  baseY: number; // percentage (0 - 100)
  size: number;
  type: 'dot' | 'plus' | 'dash' | 'square';
  speedX: number;
  speedY: number;
  mass: number;
  displacementY: number;
  velocityOfDisplacement: number;
  opacity: number;
}

export default function PhysicsParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Generate 18 distinct high-end editorial decorative elements
    const count = 18;
    const types: ('dot' | 'plus' | 'dash' | 'square')[] = ['dot', 'plus', 'dash', 'square'];
    
    const initialParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      return {
        id: i,
        baseX: Math.random() * 100,
        baseY: Math.random() * 100,
        size: Math.random() * 8 + 6, // sizes between 6px and 14px
        type: types[i % types.length],
        speedX: (Math.random() - 0.5) * 0.04, // extremely slow drifting
        speedY: (Math.random() - 0.5) * 0.04,
        mass: Math.random() * 2.5 + 1.2, // higher mass means heavier pressure and more lag
        displacementY: 0,
        velocityOfDisplacement: 0,
        opacity: Math.random() * 0.12 + 0.05, // subtle editorial branding opacity
      };
    });

    particlesRef.current = initialParticles;
    elementRefs.current = elementRefs.current.slice(0, count);

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothedVelocity = 0;
    let rAFId: number;

    const updatePhysics = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate scroll speed
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Inertia smoothing over velocity
      smoothedVelocity += (scrollVelocity - smoothedVelocity) * 0.12;

      // Update position & spring mechanics for each of the 18 particles
      particlesRef.current.forEach((p, idx) => {
        const el = elementRefs.current[idx];
        if (!el) return;

        // Slow horizontal and vertical drift
        p.baseX += p.speedX;
        p.baseY += p.speedY;

        // Wrap around the viewport boundary safely
        if (p.baseX < -5) p.baseX = 105;
        if (p.baseX > 105) p.baseX = -5;
        if (p.baseY < -5) p.baseY = 105;
        if (p.baseY > 105) p.baseY = -5;

        // --- Physics Engine Simulation ---
        // Scroll velocity acts as a downward force when scrolling down (positive load)
        const scrollForce = smoothedVelocity * 0.38; 
        
        // Elastic spring force pulling the element back to its float orbit baseY: F = -k * x
        const springForce = -0.038 * p.displacementY;

        // Net acceleration = F_net / mass
        const acceleration = (scrollForce + springForce) / p.mass;

        // Velocity accumulates acceleration with high damping friction
        p.velocityOfDisplacement += acceleration;
        p.velocityOfDisplacement *= 0.88; // viscous resistance

        // Displacement accumulates velocity updates
        p.displacementY += p.velocityOfDisplacement;

        // Visual coordinates mapping
        const currentX = p.baseX;
        const currentY = p.baseY + (p.displacementY / window.innerHeight) * 100;

        // Fast GPU performance styling using transform3d
        el.style.transform = `translate3d(${currentX}vw, ${currentY}vh, 0px) rotate(${p.displacementY * 0.12}deg)`;
      });

      rAFId = requestAnimationFrame(updatePhysics);
    };

    rAFId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="global-physics-particles"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[1] transition-opacity duration-1000"
    >
      {Array.from({ length: 18 }).map((_, idx) => {
        // We'll let the ref array populate in the loop
        return (
          <div
            key={idx}
            ref={(el) => { elementRefs.current[idx] = el; }}
            className="absolute top-0 left-0 flex items-center justify-center text-neutral-900/15 dark:text-white/15"
            style={{
              width: 16,
              height: 16,
              opacity: particlesRef.current[idx]?.opacity ?? 0.1,
            }}
          >
            {renderParticleShape(idx % 4)}
          </div>
        );
      })}
    </div>
  );
}

// Render dynamic abstract shapes inspired by editorial typographic grids
function renderParticleShape(typeIdx: number) {
  switch (typeIdx) {
    case 0:
      // Dot
      return <div className="w-1.5 h-1.5 rounded-full bg-current" />;
    case 1:
      // Plus sign
      return <span className="font-mono text-sm leading-none font-bold select-none">+</span>;
    case 2:
      // Dash
      return <div className="w-3 h-[1px] bg-current" />;
    case 3:
    default:
      // Tiny hollow square block
      return <div className="w-2 h-2 border border-current bg-transparent" />;
  }
}
