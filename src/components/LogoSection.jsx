import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Engine, World, Bodies, Body, Runner, Composite, Mouse, MouseConstraint } from 'matter-js';

const LETTERS = [
  { ch: 'G', color: '#4285F4' },
  { ch: 'o', color: '#EA4335' },
  { ch: 'o', color: '#FBBC05' },
  { ch: 'g', color: '#4285F4' },
  { ch: 'l', color: '#34A853' },
  { ch: 'e', color: '#EA4335' },
];

export default function LogoSection() {
  const containerRef = useRef(null);
  const [activated, setActivated] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [letterStates, setLetterStates] = useState([]); // x, y, angle
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const mouseConstraintRef = useRef(null);

  const fontSize = 92; // close to google.com homepage
  const letterPadding = 6;

  // Measure letter widths before activating physics to align like Google
  useEffect(() => {
    if (!containerRef.current) return;
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'pre';
    temp.style.fontWeight = '500';
    temp.style.fontFamily = 'Product Sans, Inter, system-ui, Arial, sans-serif';
    temp.style.fontSize = `${fontSize}px`;
    temp.style.lineHeight = '1';
    document.body.appendChild(temp);

    const newSizes = LETTERS.map((l) => {
      temp.textContent = l.ch;
      const rect = temp.getBoundingClientRect();
      return { width: rect.width };
    });

    document.body.removeChild(temp);
    setSizes(newSizes);
  }, []);

  const totalWidth = useMemo(() => {
    return sizes.reduce((sum, s) => sum + (s.width || 0) + letterPadding, 0);
  }, [sizes]);

  // Initialize physics when activated
  useEffect(() => {
    if (!activated || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const engine = Engine.create();
    engine.gravity.y = 1.1; // a bit heavier for playful effect
    const runner = Runner.create();

    // walls
    const wallThickness = 100;
    const floor = Bodies.rectangle(rect.width / 2, rect.height + wallThickness / 2 - 2, rect.width, wallThickness, { isStatic: true, restitution: 0.2, friction: 0.8 });
    const left = Bodies.rectangle(-wallThickness / 2, rect.height / 2, wallThickness, rect.height, { isStatic: true });
    const right = Bodies.rectangle(rect.width + wallThickness / 2, rect.height / 2, wallThickness, rect.height, { isStatic: true });

    World.add(engine.world, [floor, left, right]);

    // create letter bodies roughly matching text size
    const startX = rect.width / 2 - totalWidth / 2;
    let xCursor = startX;
    const baseY = rect.height * 0.35; // where the static logo sits initially

    const createdBodies = LETTERS.map((l, idx) => {
      const w = (sizes[idx]?.width || 60) + 6;
      const h = fontSize + 14;
      const body = Bodies.rectangle(xCursor + w / 2, baseY, w, h, {
        chamfer: { radius: 10 },
        restitution: 0.2,
        friction: 0.8,
        density: 0.0025,
      });
      xCursor += w + letterPadding;
      return body;
    });

    World.add(engine.world, createdBodies);

    // mouse drag
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);

    engineRef.current = engine;
    runnerRef.current = runner;
    bodiesRef.current = createdBodies;
    mouseConstraintRef.current = mouseConstraint;

    Runner.run(runner, engine);

    const update = () => {
      const states = bodiesRef.current.map((b) => ({ x: b.position.x, y: b.position.y, angle: b.angle }));
      setLetterStates(states);
      raf = requestAnimationFrame(update);
    };
    let raf = requestAnimationFrame(update);

    const handleResize = () => {
      // On resize, we rebuild the world roughly; simpler approach: reset positions and walls
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false);
      }
      setTimeout(() => {
        setActivated(false);
        setLetterStates([]);
      }, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false);
      }
      engineRef.current = null;
      runnerRef.current = null;
      bodiesRef.current = [];
      mouseConstraintRef.current = null;
    };
  }, [activated, totalWidth, sizes]);

  const handleActivate = () => {
    if (!activated) setActivated(true);
  };

  // positions for static layout
  const staticPositions = useMemo(() => {
    if (!containerRef.current || sizes.length !== LETTERS.length) return [];
    const rect = containerRef.current.getBoundingClientRect();
    const startX = rect.width / 2 - totalWidth / 2;
    let xCursor = startX;
    return LETTERS.map((l, idx) => {
      const w = sizes[idx]?.width || 60;
      const x = xCursor + w / 2;
      xCursor += w + letterPadding;
      return { x, y: rect.height * 0.35, angle: 0 };
    });
  }, [sizes, totalWidth]);

  const renderStates = activated ? letterStates : staticPositions;

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full" style={{ height: '52vh' }}>
      {/* Static clickable overlay to trigger physics */}
      {!activated && (
        <button aria-label="Activate logo physics" onClick={handleActivate} className="absolute inset-0 z-10 cursor-pointer" />
      )}
      {/* Letters */}
      <div className="absolute inset-0" aria-hidden>
        {LETTERS.map((l, idx) => {
          const state = renderStates[idx] || { x: 0, y: 0, angle: 0 };
          const style = {
            transform: `translate(-50%, -50%) translate(${state.x}px, ${state.y}px) rotate(${state.angle}rad)`,
            color: l.color,
            fontSize: `${fontSize}px`,
            fontWeight: 500,
            lineHeight: 1,
            fontFamily: 'Product Sans, Inter, system-ui, Arial, sans-serif',
            pointerEvents: 'none', // interactions handled by MouseConstraint not DOM
          };
          return (
            <div key={idx} className="absolute select-none will-change-transform" style={style}>
              {l.ch}
            </div>
          );
        })}
      </div>
    </div>
  );
}
