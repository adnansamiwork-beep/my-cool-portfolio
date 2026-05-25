import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, ArrowLeft, RotateCcw, Volume2, VolumeX, Award, Zap, Sparkles } from 'lucide-react';

interface GameScreenProps {
  isDarkMode: boolean;
  onBackToHome: () => void;
}

interface Obstacle {
  id: number;
  lane: number; // -1 = Left, 0 = Center, 1 = Right
  x: number; // target x offset (-0.5, 0, 0.5)
  currentX: number; // actual horizontal position (smooth transition)
  z: number; // distance from horizon (0 to 1.2)
  speed: number; // base speed of traffic car in relative units
  width: number;
  height: number;
  color: string;
  type: 'sports' | 'sedan' | 'truck';
  overtaken: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function GameScreen({ isDarkMode, onBackToHome }: GameScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('sami_game_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [playerSpeed, setPlayerSpeed] = useState(0); // in km/h representing gameplay feel
  const [distance, setDistance] = useState(0); // theoretical survival distance
  const [nearMissCount, setNearMissCount] = useState(0); // triggers near misses
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNearMissNotification, setShowNearMissNotification] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ref container for continuous gameplay variables to avoid React render lag
  const stateRef = useRef({
    playerX: 0, // from -1.0 (left curb) to 1.0 (right curb)
    targetPlayerX: 0, 
    speed: 3.5, // scrolling speed coefficient (starting slower)
    maxSpeed: 10.0, // max speed is lower for manageable speed feel
    obstacles: [] as Obstacle[],
    stars: [] as Star[],
    nextObstacleId: 1,
    spawnTimer: 0,
    score: 0,
    distance: 0,
    nearMisses: 0,
    isCrashing: false,
    crashAnimationProgress: 0,
    steeringAngle: 0, // visual rotation of player's car
    keysPressed: {} as Record<string, boolean>,
    roadOffset: 0,
  });

  const requestRef = useRef<number>(0);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'a', 'd', 'A', 'D'];
      if (keys.includes(e.code) || keys.includes(e.key)) {
        e.preventDefault();
      }
      stateRef.current.keysPressed[e.code] = true;
      stateRef.current.keysPressed[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keysPressed[e.code] = false;
      stateRef.current.keysPressed[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Sync highscore
  const updateHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('sami_game_highscore', newScore.toString());
    }
  };

  // Sound triggering safely with web audio synthesized sound effects (no loads needed!)
  const playSoundEffect = (type: 'overtake' | 'crash' | 'nearmiss' | 'steer') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'steer') {
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'overtake') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'nearmiss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'crash') {
        // Red noise synthesis
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      console.warn('Audio Context creation failed or blocked', e);
    }
  };

  // Helper trigger to handle left/right commands directly
  const moveCarLeft = () => {
    stateRef.current.targetPlayerX = Math.max(-0.75, stateRef.current.targetPlayerX - 0.45);
    playSoundEffect('steer');
  };

  const moveCarRight = () => {
    stateRef.current.targetPlayerX = Math.min(0.75, stateRef.current.targetPlayerX + 0.45);
    playSoundEffect('steer');
  };

  // Reset core states on play trigger
  const startGame = () => {
    const s = stateRef.current;
    s.playerX = 0;
    s.targetPlayerX = 0;
    s.speed = 3.5; // Starting slower
    s.obstacles = [];
    s.nextObstacleId = 1;
    s.spawnTimer = 0;
    s.score = 0;
    s.distance = 0;
    s.nearMisses = 0;
    s.isCrashing = false;
    s.crashAnimationProgress = 0;
    s.steeringAngle = 0;
    s.roadOffset = 0;

    // Prefill stars
    s.stars = Array.from({ length: 48 }).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 70, // strictly under the horizon limit
      size: Math.random() * 1.8 + 0.5,
      speed: Math.random() * 0.15 + 0.05
    }));

    setScore(0);
    setDistance(0);
    setNearMissCount(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Frame simulation and projection cycle
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set pixel density correctly for retina screens
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 750;
    let height = canvas.height = 420;

    const resizeHandler = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 750;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', resizeHandler);

    // Animation variables
    let frameCount = 0;

    const updateLoop = () => {
      frameCount++;
      const s = stateRef.current;

      // Handle key inputs for steering
      let horizontalInput = 0;
      if (s.keysPressed['ArrowLeft'] || s.keysPressed['KeyA'] || s.keysPressed['a'] || s.keysPressed['A']) {
        horizontalInput = -1;
      }
      if (s.keysPressed['ArrowRight'] || s.keysPressed['KeyD'] || s.keysPressed['d'] || s.keysPressed['D']) {
        horizontalInput = 1;
      }

      // Smooth steering & rotation mechanics
      if (horizontalInput !== 0) {
        s.targetPlayerX += horizontalInput * 0.045;
        s.targetPlayerX = Math.max(-0.85, Math.min(0.85, s.targetPlayerX));
        s.steeringAngle += (horizontalInput * 15 - s.steeringAngle) * 0.2;
      } else {
        s.steeringAngle += (0 - s.steeringAngle) * 0.15;
      }

      // Move player coordinates towards target destination smoothly
      s.playerX += (s.targetPlayerX - s.playerX) * 0.18;

      if (!s.isCrashing) {
        // Accelerate car slowly as time moves on
        s.speed = Math.min(s.maxSpeed, s.speed + 0.0006); // much slower build-up
        
        // Calculate dynamic HUD speed representation
        const currentSpeedKmh = Math.floor(s.speed * 10 + 35);
        setPlayerSpeed(currentSpeedKmh);

        // Core score accumulator base
        s.distance += s.speed * 0.02;
        setDistance(Math.floor(s.distance));

        // Score accumulates based on speed and time
        s.score += Math.floor(s.speed * 0.08);
        setScore(Math.floor(s.score));

        // Background / road line animation cycle
        s.roadOffset += s.speed;
        if (s.roadOffset >= 200) {
          s.roadOffset = 0;
        }

        // Spawn traffic objects
        s.spawnTimer -= 1;
        if (s.spawnTimer <= 0) {
          s.spawnTimer = Math.max(40, 90 - Math.floor(s.speed * 2.0)); // slower and more spaced out spawns
          
          // Decide dynamic configuration of incoming speeds & types
          const id = s.nextObstacleId++;
          
          // Lane selections (-1 = Left, 0 = Center, 1 = Right)
          const possibleLanes = [-1, 0, 1];
          // Ensure we don't block all lanes immediately
          const activeLanesPresent = s.obstacles.filter(o => o.z < 0.2).map(o => o.lane);
          
          let availableLanes = possibleLanes.filter(l => !activeLanesPresent.includes(l));
          if (availableLanes.length === 0) {
            availableLanes = possibleLanes;
          }
          const chosenLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

          // Random specs
          const types: ('sports' | 'sedan' | 'truck')[] = ['sports', 'sedan', 'truck'];
          const colors = [
            'rgb(239, 68, 68)',   // Scarlet Red
            'rgb(59, 130, 246)',  // Cobalt Blue
            'rgb(245, 158, 11)',  // Amber Yellow
            'rgb(168, 85, 247)',  // Violet purple
            'rgb(16, 185, 129)',  // Emerald Green
          ];

          const trafficCarType = types[Math.floor(Math.random() * types.length)];
          const trafficCarColor = colors[Math.floor(Math.random() * colors.length)];
          
          // Relative slower traffic speed. It wanders forward but player overtakes it.
          const trafficSpeed = s.speed * (0.35 + Math.random() * 0.15); 

          s.obstacles.push({
            id,
            lane: chosenLane,
            x: chosenLane * 0.5, // matches lane coordinate
            currentX: chosenLane * 0.5,
            z: 0.02, // starts at the tiny horizon line
            speed: trafficSpeed,
            width: trafficCarType === 'truck' ? 0.35 : 0.28,
            height: trafficCarType === 'truck' ? 0.14 : 0.12,
            color: trafficCarColor,
            type: trafficCarType,
            overtaken: false,
          });
        }

        // Update traffic objects progression
        s.obstacles.forEach((obstacle) => {
          // Obstacle moves downwards in relative speed context
          // Since the player car speed is speed coefficient S, traffic crawls down at rates:
          const relSpeedFactor = (s.speed - obstacle.speed) * 0.0035; // slower approached speed
          obstacle.z += relSpeedFactor;

          // Smoothly align obstacle to its designated lane
          obstacle.currentX += (obstacle.x - obstacle.currentX) * 0.05;

          // ⚠️ COLLISION MECHANIC CHECK
          // Player car resides at z = 0.82 to 0.90
          const PLAYER_Z_MIN = 0.81;
          const PLAYER_Z_MAX = 0.92;

          if (obstacle.z >= PLAYER_Z_MIN && obstacle.z <= PLAYER_Z_MAX) {
            const hDist = Math.abs(s.playerX - obstacle.currentX);
            // Check cross overlap
            if (hDist < 0.28) {
              s.isCrashing = true;
              playSoundEffect('crash');
            } else if (hDist < 0.42 && !obstacle.overtaken) {
              // 😎 NEAR MISS BONUS (Very close split-second overtake)
              s.score += 250;
              s.nearMisses += 1;
              setNearMissCount(s.nearMisses);
              playSoundEffect('nearmiss');
              
              const now = Date.now();
              if (now - lastNotificationTime > 1000) {
                setShowNearMissNotification(true);
                setLastNotificationTime(now);
                setTimeout(() => setShowNearMissNotification(false), 900);
              }
            }
          }

          // 🏁 OVERTAKE SUCCESS SCORE INCREMENT
          if (obstacle.z > 0.93 && !obstacle.overtaken) {
            obstacle.overtaken = true;
            s.score += 550; // Big bonus for clear overtaking
            playSoundEffect('overtake');
          }
        });

        // Filter out completed/overtaken traffic that has passed behind the view
        s.obstacles = s.obstacles.filter(o => o.z <= 1.25);
      } else {
        // Crash sequence animation progression dynamics
        s.crashAnimationProgress += 0.04;
        s.speed = Math.max(0, s.speed * 0.9); // screech to absolute halt
        setPlayerSpeed(Math.floor(s.speed * 12 + 80));

        if (s.crashAnimationProgress >= 1.0) {
          setIsGameOver(true);
          updateHighScore(s.score);
        }
      }

      // Draw standard retro Horizon, Sky & Mountain backgrounds
      ctx.fillStyle = isDarkMode ? '#050505' : '#f0f0f0';
      ctx.fillRect(0, 0, width, height);

      // Starry particles drifting for Dark mode, speed lines for Light mode
      if (isDarkMode) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        s.stars.forEach(star => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          // subtle horizontal drift depending on steering rotation
          star.x = (star.x - s.steeringAngle * 0.05 + width) % width;
        });
      }

      const HORIZON_Y = height * 0.18; // Horizon ceiling (lower value to stretch height of the road and see further)

      // Outrun style distant mountains
      ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Draw 3 distinct polygon ranges
      for (let m = 0; m < width; m += 40) {
        const hVal = Math.sin(m * 0.03) * 18 + HORIZON_Y - 25;
        if (m === 0) ctx.moveTo(m, hVal);
        else ctx.lineTo(m, hVal);
      }
      ctx.lineTo(width, HORIZON_Y);
      ctx.lineTo(0, HORIZON_Y);
      ctx.fill();

      // Horizon separator lines
      ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, HORIZON_Y);
      ctx.lineTo(width, HORIZON_Y);
      ctx.stroke();

      // --- PERSPECTIVE PSEUDO 3D ROAD DRAWING ---
      const bottomRoadWidth = width * 0.72;
      const topRoadWidth = width * 0.08;
      
      const bottomXLeft = (width - bottomRoadWidth) / 2;
      const bottomXRight = bottomXLeft + bottomRoadWidth;
      const topXLeft = (width - topRoadWidth) / 2;
      const topXRight = topXLeft + topRoadWidth;

      // Project grid point onto screen function helper
      const getRoadCoordinates = (z: number, laneOffset: number) => {
        // Perspective curve interpolation
        const yCurved = HORIZON_Y + (height - HORIZON_Y) * Math.pow(z, 2.5);
        const roadW = topRoadWidth + (bottomRoadWidth - topRoadWidth) * z;
        const centerX = width / 2 - (s.playerX * (bottomRoadWidth - topRoadWidth) * 0.45 * z); // relative curve pan
        
        const xScreen = centerX + (laneOffset * roadW);
        return { x: xScreen, y: yCurved, width: roadW };
      };

      // Draw Asphalt Base polygon
      const topLeft = getRoadCoordinates(0, -0.5);
      const topRight = getRoadCoordinates(0, 0.5);
      const bottomLeft = getRoadCoordinates(1.0, -0.5);
      const bottomRight = getRoadCoordinates(1.0, 0.5);

      ctx.fillStyle = isDarkMode ? '#111' : '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(topLeft.x, topLeft.y);
      ctx.lineTo(topRight.x, topRight.y);
      ctx.lineTo(bottomRight.x, bottomRight.y);
      ctx.lineTo(bottomLeft.x, bottomLeft.y);
      ctx.fill();

      // Side Curbs / Shunning rumble lines
      const rumbleSegments = 16;
      for (let r = 0; r < rumbleSegments; r++) {
        const segZStart = (r / rumbleSegments);
        const segZEnd = ((r + 1) / rumbleSegments);

        // Scrolling motion offsets
        const displayZStart = (segZStart + s.roadOffset * 0.005) % 1.0;
        const displayZEnd = (segZEnd + s.roadOffset * 0.005) % 1.0;

        if (displayZEnd > displayZStart) {
          const lStart = getRoadCoordinates(displayZStart, -0.5);
          const lEnd = getRoadCoordinates(displayZEnd, -0.5);
          const rStart = getRoadCoordinates(displayZStart, 0.5);
          const rEnd = getRoadCoordinates(displayZEnd, 0.5);

          // alternating vibrant neon segments for visual feedback
          const isEven = r % 2 === 0;
          ctx.strokeStyle = isEven 
            ? isDarkMode ? '#fff' : '#000' 
            : isDarkMode ? '#f43f5e' : '#cbd5e1';
          
          ctx.lineWidth = 1 + displayZStart * 8; // thicker blocks as they reach close

          // Left Curb segment
          ctx.beginPath();
          ctx.moveTo(lStart.x, lStart.y);
          ctx.lineTo(lEnd.x, lEnd.y);
          ctx.stroke();

          // Right Curb segment
          ctx.beginPath();
          ctx.moveTo(rStart.x, rStart.y);
          ctx.lineTo(rEnd.x, rEnd.y);
          ctx.stroke();
        }
      }

      // Scrolling white lane dividers (divide 3 lanes: Left lane, Center lane, Right lane)
      ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
      const dashSegments = 8;
      for (let d = 0; d < dashSegments; d++) {
        const dZStart = (d / dashSegments);
        const dZEnd = ((d + 0.5) / dashSegments);

        // scroll translation
        const drawZStart = (dZStart + s.roadOffset * 0.008) % 1.0;
        const drawZEnd = (dZEnd + s.roadOffset * 0.008) % 1.0;

        if (drawZEnd > drawZStart) {
          // Lane border 1: Left -0.16 width offset
          const lb1Start = getRoadCoordinates(drawZStart, -0.16);
          const lb1End = getRoadCoordinates(drawZEnd, -0.16);

          // Lane border 2: Right 0.16 width offset
          const lb2Start = getRoadCoordinates(drawZStart, 0.16);
          const lb2End = getRoadCoordinates(drawZEnd, 0.16);

          ctx.lineWidth = 1 + drawZStart * 3.5;
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.moveTo(lb1Start.x, lb1Start.y);
          ctx.lineTo(lb1End.x, lb1End.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(lb2Start.x, lb2Start.y);
          ctx.lineTo(lb2End.x, lb2End.y);
          ctx.stroke();
        }
      }

      // --- DRAW TRAFFIC OBJECTS ---
      s.obstacles.forEach((obstacle) => {
        const coords = getRoadCoordinates(obstacle.z, obstacle.currentX);
        if (obstacle.z < 0.04 || coords.y < HORIZON_Y) return;

        // scale based on physical distance projection z
        const curScale = 1.0 * Math.pow(obstacle.z, 2.0);
        const carW = obstacle.width * coords.width;
        const carH = obstacle.height * coords.width * 0.5;

        const leftSide = coords.x - carW / 2;
        const topSide = coords.y - carH;

        ctx.save();
        
        // Add subtle shadow beneath the vehicle
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(coords.x, coords.y, carW * 0.55, carH * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw vehicle hull / chassis
        ctx.fillStyle = obstacle.color;
        ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)';
        ctx.lineWidth = Math.max(1, curScale * 2);

        // Sports, Truck or Sedan designs
        if (obstacle.type === 'truck') {
          // Robust boxy outline
          ctx.beginPath();
          ctx.roundRect(leftSide, topSide - carH * 0.5, carW, carH * 1.5, Math.max(1, curScale * 4));
          ctx.fill();
          ctx.stroke();

          // Rear hatch windows
          ctx.fillStyle = '#000';
          ctx.fillRect(leftSide + carW * 0.1, topSide - carH * 0.2, carW * 0.8, carH * 0.3);
        } else {
          // Sleek passenger car shape
          ctx.beginPath();
          ctx.roundRect(leftSide, topSide, carW, carH, Math.max(1, curScale * 5));
          ctx.fill();
          ctx.stroke();

          // Cabin glass
          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.roundRect(leftSide + carW * 0.15, topSide + carH * 0.15, carW * 0.7, carH * 0.45, Math.max(1, curScale * 2));
          ctx.fill();

          // Bright safety brake taillights
          ctx.fillStyle = 'rgb(239, 68, 68)';
          ctx.fillRect(leftSide + carW * 0.06, coords.y - carH * 0.25, carW * 0.15, carH * 0.18);
          ctx.fillRect(leftSide + carW * 0.79, coords.y - carH * 0.25, carW * 0.15, carH * 0.18);
        }

        ctx.restore();
      });

      // --- DRAW PLAYER VEHICLE ---
      // Player is fixed at z = 0.85 near bottom-center of road coordinate system
      {
        const PLAYER_Z_DRAW = 0.85;
        // Dynamic wiggle offsets if crashing
        let driftX = 0;
        let driftY = 0;
        let scaleShake = 0;

        if (s.isCrashing) {
          driftX = (Math.random() - 0.5) * s.crashAnimationProgress * 45;
          driftY = (Math.random() - 0.5) * s.crashAnimationProgress * 45;
          scaleShake = s.crashAnimationProgress * 0.3;
        }

        const pCoords = getRoadCoordinates(PLAYER_Z_DRAW, s.playerX);
        const pCarW = 0.32 * pCoords.width;
        const pCarH = 0.14 * pCoords.width * 0.5;

        const pLeft = pCoords.x - pCarW / 2 + driftX;
        const pTop = height - pCarH - 25 + driftY;

        ctx.save();
        
        // Translate context to center of car for rotation drift visual effects
        ctx.translate(pCoords.x + driftX, pTop + pCarH / 2 + driftY);
        ctx.rotate((s.steeringAngle * Math.PI) / 180);

        // 🚗 Exhaust fire particle simulation
        if (s.speed > 8.0 && !s.isCrashing && frameCount % 2 === 0) {
          ctx.fillStyle = frameCount % 4 === 0 ? '#ff9f1c' : '#ff4757';
          ctx.beginPath();
          ctx.arc(-pCarW * 0.18, pCarH * 0.55 + Math.random() * 8, Math.random() * 4 + 2, 0, Math.PI * 2);
          ctx.arc(pCarW * 0.18, pCarH * 0.55 + Math.random() * 8, Math.random() * 4 + 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drop shadow
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.beginPath();
        ctx.ellipse(0, pCarH * 0.35, pCarW * 0.58, pCarH * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Premium Main Car Body: Vibrant Emerald / Cyan / White depending on dark/light
        ctx.fillStyle = isDarkMode ? 'rgb(16, 185, 129)' : 'rgb(5, 150, 105)';
        ctx.strokeStyle = isDarkMode ? '#ffffff' : '#042f1a';
        ctx.lineWidth = 3.5;

        ctx.beginPath();
        // sports aerodynamic structure
        ctx.roundRect(-pCarW / 2, -pCarH / 2, pCarW, pCarH, 12);
        ctx.fill();
        ctx.stroke();

        // Sleek cabin layer
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.roundRect(-pCarW * 0.35, -pCarH * 0.35, pCarW * 0.7, pCarH * 0.55, 6);
        ctx.fill();

        // Steering cockpit line decoration
        ctx.strokeStyle = isDarkMode ? '#34d399' : '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-pCarW * 0.3, -pCarH * 0.1);
        ctx.lineTo(pCarW * 0.3, -pCarH * 0.1);
        ctx.stroke();

        // Headlights glow beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-pCarW * 0.36, -pCarH * 0.4, 6, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(pCarW * 0.36, -pCarH * 0.4, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rear glowing Brake Taillights
        ctx.fillStyle = s.keysPressed['ArrowLeft'] || s.keysPressed['ArrowRight'] ? '#fb7185' : '#f43f5e';
        ctx.fillRect(-pCarW * 0.44, pCarH * 0.28, pCarW * 0.16, pCarH * 0.16);
        ctx.fillRect(pCarW * 0.28, pCarH * 0.28, pCarW * 0.16, pCarH * 0.16);

        // Crash explosion clouds
        if (s.isCrashing) {
          ctx.fillStyle = frameCount % 3 === 0 ? '#ef4444' : '#f59e0b';
          for (let pCloud = 0; pCloud < 15; pCloud++) {
            ctx.beginPath();
            ctx.arc(
              (Math.random() - 0.5) * pCarW * 1.5,
              (Math.random() - 0.5) * pCarH * 1.5,
              Math.random() * (pCarW * 0.5) * s.crashAnimationProgress,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Loop frame recursively
      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isPlaying, isGameOver, isDarkMode, soundEnabled]);

  // Handle crash cleanups
  const handleExitGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    onBackToHome();
  };

  const hudLabelClass = isDarkMode ? 'text-neutral-400' : 'text-neutral-600';
  const hudValueClass = isDarkMode ? 'text-white font-black' : 'text-neutral-950 font-black';

  return (
    <div 
      id="arcade-game-mode"
      className={`min-h-[calc(100vh-4rem)] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-center items-center transition-colors duration-500 overflow-hidden ${
        isDarkMode ? 'bg-[#030303] text-white' : 'bg-[#f4f4f4] text-neutral-950'
      }`}
    >
      <div className="max-w-4xl w-full flex flex-col gap-8 z-10 select-none">
        
        {/* Game Headers and Quick Control HUD */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-current/10">
          <div className="flex items-center gap-4">
            <button
              id="game-btn-back"
              onClick={handleExitGame}
              className={`flex items-center gap-2 p-3 font-bold text-xs uppercase tracking-widest border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'border-white/10 hover:border-white text-white/75 hover:text-white bg-white/5' 
                  : 'border-black/10 hover:border-black text-neutral-700 hover:text-black bg-black/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </button>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-semibold block">ARCADE SIMULATOR</span>
              <h1 className="text-xl md:text-2xl font-sans font-black uppercase tracking-tighter">Sami Speedster</h1>
            </div>
          </div>

          {/* Highscore & Sound switches */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 border flex items-center gap-2 font-mono text-xs uppercase font-medium tracking-wide ${
              isDarkMode ? 'border-white/10 bg-neutral-950/40 text-neutral-300' : 'border-black/10 bg-white/40 text-neutral-700'
            }`}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>BEST SHOT:</span>
              <span className="font-bold font-sans text-amber-500">{highScore}</span>
            </div>

            <button
              id="game-btn-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 border rounded-none transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'border-white/10 hover:border-white bg-neutral-950 hover:bg-neutral-900 text-white' 
                  : 'border-black/10 hover:border-black bg-white hover:bg-neutral-100 text-black'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
            </button>
          </div>
        </div>

        {/* Dynamic Canvas Container overlay */}
        <div className={`relative border p-1 rounded-none shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-[#0f0f0f] border-white/15' : 'bg-white border-black/15'
        }`}>
          {!isPlaying ? (
            // INTRO / WELCOME SCREEN SCREEN
            <div className="relative h-[420px] w-full flex flex-col items-center justify-center p-6 text-center z-20">
              <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.04),transparent_70%)]'}`} />
              
              <div className={`w-16 h-16 border rounded-none flex items-center justify-center font-semibold mb-6 animate-pulse ${
                isDarkMode ? 'border-white/15 bg-neutral-900/50 text-emerald-400' : 'border-black/10 bg-white text-emerald-600'
              }`}>
                <Gamepad2 className="w-9 h-9" />
              </div>

              <h2 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tighter mb-3 leading-none">
                Sami Highway Speedster
              </h2>
              <p className={`text-xs max-w-sm leading-relaxed mb-8 ${isDarkMode ? 'text-neutral-400 font-light' : 'text-neutral-600 font-light'}`}>
                Navigate a high-speed vector highway. Overtake slower corporate cars moving in the same direction, rack up high points, and dodge collision disasters.
              </p>

              {/* Instructions Row */}
              <div className="flex gap-10 text-[10px] font-mono tracking-widest uppercase mb-10 text-neutral-500 font-bold max-w-md flex-wrap justify-center">
                <div className="flex items-center gap-1.5 bg-current/5 px-2.5 py-1">
                  <span>LEFT:</span>
                  <span className={isDarkMode ? 'text-white' : 'text-black'}>← / A</span>
                </div>
                <div className="flex items-center gap-1.5 bg-current/5 px-2.5 py-1">
                  <span>RIGHT:</span>
                  <span className={isDarkMode ? 'text-white' : 'text-black'}>→ / D</span>
                </div>
                <div className="flex items-center gap-1.5 bg-current/5 px-2.5 py-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Dodge limit to earn Near Miss Bonus</span>
                </div>
              </div>

              <button
                id="game-btn-start"
                onClick={startGame}
                className={`px-10 py-4 font-black uppercase text-xs tracking-widest shadow-lg cursor-pointer transition-all border ${
                  isDarkMode 
                    ? 'bg-white text-black hover:bg-neutral-900 hover:text-white border-transparent' 
                    : 'bg-black text-white hover:bg-white hover:text-black border-transparent'
                }`}
              >
                INITIALIZE ENGINES
              </button>
            </div>
          ) : isGameOver ? (
            // GAME OVER SCREEN OVERLAY
            <div className="relative h-[420px] w-full flex flex-col items-center justify-center p-6 text-center z-20">
              {/* Score breakdown metrics */}
              <div className="grid grid-cols-3 gap-6 max-w-md w-full mb-10 mx-auto">
                <div className={`p-4 border rounded-none ${isDarkMode ? 'bg-neutral-950 border-white/5' : 'bg-white border-black/5'}`}>
                  <span className={`text-[9px] font-mono uppercase tracking-widest block mb-1 ${hudLabelClass}`}>TOTAL SCORE</span>
                  <span className="text-xl font-black text-rose-500">{score}</span>
                </div>
                <div className={`p-4 border rounded-none ${isDarkMode ? 'bg-neutral-950 border-white/5' : 'bg-white border-black/5'}`}>
                  <span className={`text-[9px] font-mono uppercase tracking-widest block mb-1 ${hudLabelClass}`}>DISTANCE</span>
                  <span className={`text-xl ${hudValueClass}`}>{distance}m</span>
                </div>
                <div className={`p-4 border rounded-none ${isDarkMode ? 'bg-neutral-950 border-white/5' : 'bg-white border-black/5'}`}>
                  <span className={`text-[9px] font-mono uppercase tracking-widest block mb-1 ${hudLabelClass}`}>NEAR MISSES</span>
                  <span className="text-xl font-black text-emerald-500">{nearMissCount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  id="game-btn-retry"
                  onClick={startGame}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold uppercase tracking-widest text-[10px] cursor-pointer shadow-md transition-colors border ${
                    isDarkMode 
                      ? 'bg-white text-black hover:bg-neutral-900 hover:text-white border-transparent' 
                      : 'bg-black text-white hover:bg-white hover:text-black border-transparent'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>
                <button
                  id="game-btn-exit"
                  onClick={handleExitGame}
                  className={`px-8 py-3.5 font-bold uppercase tracking-widest text-[10px] cursor-pointer transition-colors border ${
                    isDarkMode 
                      ? 'border-white/10 text-white/80 hover:border-white bg-white/5' 
                      : 'border-black/10 text-neutral-700 hover:border-black bg-black/5'
                  }`}
                >
                  HOMEPAGE DIRECTORY
                </button>
              </div>
            </div>
          ) : (
            // GAME ACTIVE STATE SCREEN
            <div className="relative">
              {/* Dynamic responsive Canvas graphics rendering */}
              <canvas 
                ref={canvasRef} 
                className="w-full h-[420px] block cursor-crosshair relative z-10"
              />

              {/* HUD / Indicators floating on Canvas */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none select-none">
                <div className="flex gap-4">
                  <div className="bg-black/85 text-white px-3 py-1.5 border border-white/15 backdrop-blur-md">
                    <span className="text-[8px] font-mono tracking-widest text-neutral-400 block pb-0.5">SCORE</span>
                    <span className="font-mono text-sm font-black text-emerald-400 tracking-wider">
                      {String(score).padStart(6, '0')}
                    </span>
                  </div>

                  <div className="bg-black/85 text-white px-3 py-1.5 border border-white/15 backdrop-blur-md">
                    <span className="text-[8px] font-mono tracking-widest text-neutral-400 block pb-0.5">SPEED</span>
                    <span className="font-mono text-sm font-black text-amber-400 tracking-wider flex items-baseline gap-0.5">
                      <span>{playerSpeed}</span>
                      <span className="text-[9px] uppercase font-light text-neutral-500">KM/H</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="bg-black/85 text-white px-3 py-1.5 border border-white/15 backdrop-blur-md">
                    <span className="text-[8px] font-mono tracking-widest text-neutral-400 block pb-0.5">DISTANCE</span>
                    <span className="font-mono text-sm font-black text-white tracking-wider">
                      {distance}m
                    </span>
                  </div>

                  {nearMissCount > 0 && (
                    <div className="bg-emerald-500/15 text-emerald-400 px-2.5 py-1 border border-emerald-500/35 backdrop-blur-md flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider font-bold">
                      <Zap className="w-3.5 h-3.5 animate-bounce fill-emerald-400/20" />
                      <span>NEAR MISS x{nearMissCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Near Miss On-Screen Dramatic Impact Alert */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex justify-center items-center">
                {showNearMissNotification && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [1, 1, 0] }}
                    transition={{ duration: 0.8 }}
                    className="bg-amber-400 text-black px-6 py-2 border-2 border-white font-mono text-xs uppercase font-extrabold tracking-widest shadow-2xl skew-x-[-12deg]"
                  >
                    ⚡ NEAR MISS BONUS! +250 ⚡
                  </motion.div>
                )}
              </div>

              {/* Tactical Click buttons overlay for mobile users */}
              <div className="absolute bottom-4 left-0 right-0 z-20 px-8 flex justify-between pointer-events-none select-none">
                <button
                  id="game-mobile-btn-left"
                  onMouseDown={moveCarLeft}
                  onTouchStart={(e) => { e.preventDefault(); moveCarLeft(); }}
                  className="pointer-events-auto w-14 h-14 bg-black/75 hover:bg-black border border-white/20 hover:border-white font-mono font-black text-white active:scale-90 flex items-center justify-center select-none text-lg shadow-xl cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                >
                  ←
                </button>
                <button
                  id="game-mobile-btn-right"
                  onMouseDown={moveCarRight}
                  onTouchStart={(e) => { e.preventDefault(); moveCarRight(); }}
                  className="pointer-events-auto w-14 h-14 bg-black/75 hover:bg-black border border-white/20 hover:border-white font-mono font-black text-white active:scale-90 flex items-center justify-center select-none text-lg shadow-xl cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Footer Advice indicator */}
        <div className={`text-center transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'} text-[10px] font-mono tracking-widest uppercase`}>
          <span>Controls: Use keyboard Left/Right arrows or A/D keys on PC, or tap arrows on screen.</span>
        </div>

      </div>
    </div>
  );
}
