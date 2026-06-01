import React, { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Home,
  Shield,
  Target,
  Eye,
  AlertTriangle,
  Server,
  Code,
  Terminal,
  Cpu,
  Settings,
  Bug,
  Lock,
  Skull,
  CheckCircle,
  TrendingDown,
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import './index.css';

// ── Memory Map Visualizer Sub-Component ───────────────────────────────────
const MemoryMap = ({ liveInput, crashed }) => {
  const BUFFER_SIZE = 6;
  const chars = liveInput.split('');
  const overflowing = chars.length > BUFFER_SIZE;

  // Build 14 cells: 6 buffer + 4 EBP + 4 EIP
  const cells = [];
  for (let i = 0; i < 14; i++) {
    if (i < BUFFER_SIZE) {
      cells.push({ region: 'BUFFER', idx: i, val: chars[i] ?? null });
    } else if (i < BUFFER_SIZE + 4) {
      const ebpIdx = i - BUFFER_SIZE;
      cells.push({ region: 'EBP', idx: ebpIdx, val: overflowing ? (chars[i] ?? null) : null });
    } else {
      const eipIdx = i - BUFFER_SIZE - 4;
      cells.push({ region: 'EIP', idx: eipIdx, val: overflowing ? (chars[i] ?? null) : null });
    }
  }

  const regionColor = (region, val) => {
    if (region === 'BUFFER') {
      if (val !== null) return 'border-[#64ffda] bg-[#64ffda]/15 text-[#64ffda]';
      return 'border-[#64ffda]/20 bg-[#112240]/40 text-[#8892b0]';
    }
    if (region === 'EBP') {
      if (val !== null) return 'border-orange-400 bg-orange-500/20 text-orange-300';
      return 'border-orange-500/20 bg-[#112240]/40 text-[#8892b0]';
    }
    // EIP
    if (crashed || val !== null) return 'border-[#ff6b6b] bg-red-950/40 text-[#ff6b6b] eip-hijack';
    return 'border-red-500/20 bg-[#112240]/40 text-[#8892b0]';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] font-mono uppercase tracking-widest text-[#64ffda] mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse"></span>
        Stack Frame (Live)
      </div>

      {/* EIP REGISTER */}
      <div className="mb-4">
        <div className={`text-[9px] font-mono tracking-widest mb-1.5 ${
          (crashed || cells.filter(c => c.region === 'EIP' && c.val).length > 0)
            ? 'text-[#ff6b6b] crash-text-blink' : 'text-[#ff6b6b]/50'
        }`}>⚡ EIP (Ret. Address)</div>
        <div className="grid grid-cols-4 gap-1">
          {cells.filter(c => c.region === 'EIP').map((cell, i) => (
            <div key={i} className={`h-8 border rounded flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${regionColor(cell.region, cell.val)} ${
              cell.val ? 'mem-cell-overflow' : ''
            } ${crashed ? 'eip-hijack' : ''}`}>
              {cell.val ? cell.val.charCodeAt(0).toString(16).toUpperCase() : '??'}
            </div>
          ))}
        </div>
      </div>

      {/* EBP REGISTER */}
      <div className="mb-4">
        <div className="text-[9px] font-mono tracking-widest text-orange-400/70 mb-1.5">📦 EBP (Base Pointer)</div>
        <div className="grid grid-cols-4 gap-1">
          {cells.filter(c => c.region === 'EBP').map((cell, i) => (
            <div key={i} className={`h-8 border rounded flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${regionColor(cell.region, cell.val)} ${
              cell.val ? 'mem-cell-overflow' : ''
            }`}>
              {cell.val ? cell.val.charCodeAt(0).toString(16).toUpperCase() : '--'}
            </div>
          ))}
        </div>
      </div>

      {/* BUFFER */}
      <div className="flex-grow">
        <div className="text-[9px] font-mono tracking-widest text-[#64ffda]/70 mb-1.5">🧠 buffer[6] (Safe Zone)</div>
        <div className="grid grid-cols-3 gap-1.5">
          {cells.filter(c => c.region === 'BUFFER').map((cell, i) => (
            <div key={i} className={`h-8 border rounded flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${regionColor(cell.region, cell.val)} ${
              cell.val ? 'mem-cell-safe' : ''
            }`}>
              {cell.val ? cell.val.charCodeAt(0).toString(16).toUpperCase() : '00'}
            </div>
          ))}
        </div>
      </div>

      {/* Overflow Gauge */}
      <div className="mt-4 border-t border-white/5 pt-3">
        <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1">
          <span>Buffer usage</span>
          <span className={chars.length > BUFFER_SIZE ? 'text-[#ff6b6b]' : 'text-[#64ffda]'}>
            {Math.min(chars.length, 14)}/14 bytes
          </span>
        </div>
        <div className="h-1.5 bg-[#112240] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              chars.length > BUFFER_SIZE ? 'bg-[#ff6b6b]' : 'bg-[#64ffda]'
            }`}
            style={{ width: `${Math.min((chars.length / 14) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
// ───────────────────────────────────────────────────────────────────────────

const PresentationApp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavOverlay, setShowNavOverlay] = useState(false);
  const [showCrashOverlay, setShowCrashOverlay] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Terminal demo state for Slide 7
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'input', text: './atm_login' },
    { type: 'system', text: '--- GLOBALBANK SECURITY GATE v1.0.4 ---' },
    { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [memoryInputPreview, setMemoryInputPreview] = useState('');
  const [isCrashed, setIsCrashed] = useState(false);
  const terminalBottomRef = useRef(null);

  const totalSlides = 10;

  // Slide content configuration
  const slides = [
    {
      id: 1,
      type: 'cover',
      title: 'Overflow Labs',
      subtitle: 'Ciberseguridad y DevSecOps - Caso de Éxito',
      text: 'Presentado por: Leonel Rosso (Auditor de Código y Pentester) & Juan Pablo Figueroa (Analista de Depuración y QA).',
    },
    {
      id: 2,
      type: 'about',
      title: 'Protegiendo Activos Críticos',
      mision: 'Erradicar vulnerabilidades de memoria en software de bajo nivel.',
      vision: 'Ser el estándar de confianza técnica para el sector financiero.',
    },
    {
      id: 3,
      type: 'problem',
      title: 'Caso "GlobalBank"',
      text: 'Un banco multinacional sufrió un ataque en sus cajeros automáticos.',
      falla: 'Los atacantes lograron evadir la pantalla de login.',
      riesgo: 'Pérdida millonaria por robo de efectivo y daño irreparable a la reputación.',
    },
    {
      id: 4,
      type: 'service',
      title: 'Auditoría de Código Seguro',
      text: 'Implementamos el enfoque DevSecOps para detectar fallas antes de que el software llegue a producción.',
      highlight: 'Nos enfocamos en vulnerabilidades de memoria (Desbordamiento de Búfer) en lenguaje C.',
    },
    {
      id: 5,
      type: 'tools',
      title: 'Nuestro Arsenal de Detección',
      tools: [
        {
          name: 'Cppcheck (Análisis Estático)',
          desc: 'Escanea el código fuente sin ejecutarlo para detectar funciones inseguras de forma temprana.'
        },
        {
          name: 'GDB (Depurador GNU)',
          desc: 'Analiza la memoria en tiempo real para rastrear el colapso del sistema (Segmentation Fault).'
        }
      ]
    },
    {
      id: 6,
      type: 'findings',
      title: 'El Sistema Vulnerable',
      findings: [
        { label: 'Uso de función insegura', desc: 'gets() que no verifica el tamaño del buffer.' },
        { label: 'Falta de límites', desc: 'Intentos de login infinitos (Fuerza Bruta).' },
        { label: 'Texto Plano', desc: 'Contraseñas expuestas en memoria sin cifrar.' }
      ]
    },
    {
      id: 7,
      type: 'attack',
      title: 'Explotando la Vulnerabilidad',
      text: 'Al inyectar una cadena de caracteres que supera el tamaño esperado (Buffer Overflow), la memoria colapsa, permitiendo al atacante ganar control y eludir la validación.'
    },
    {
      id: 8,
      type: 'remediation',
      title: 'Blindando el Sistema',
      fixes: [
        { label: 'Implementación de fgets()', desc: 'Para limitar la cantidad exacta de caracteres leídos.' },
        { label: 'Algoritmo djb2', desc: 'Almacenamiento de contraseñas mediante "hashes", nunca en texto plano.' },
        { label: 'Bloqueo de seguridad', desc: 'Límite estricto de 3 intentos fallidos.' }
      ]
    },
    {
      id: 9,
      type: 'market',
      title: 'El "Salto" Tecnológico',
      texts: [
        'En el entorno académico, un error de memoria (como olvidarse de un límite en C) solo rompe el programa local.',
        'En el mundo real, esa misma falla en un servidor cuesta millones en multas, demandas judiciales y robo de datos. Prevenir es siempre más económico.'
      ]
    },
    {
      id: 10,
      type: 'conclusion',
      title: 'Diagnóstico Final',
      text: 'La seguridad de una red multinacional puede depender enteramente de la elección de una sola función en C. Recomendamos auditorías de código preventivas antes de cada actualización de software que interactúe con el público.'
    }
  ];

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const handleGoTo = useCallback((index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setShowNavOverlay(false);
  }, [currentSlide]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey) || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowNavOverlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Fullscreen support
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Glitch effect when entering Slide 7 (index 6)
  const prevSlideRef = useRef(currentSlide);
  useEffect(() => {
    if (currentSlide === 6 && prevSlideRef.current !== 6) {
      setIsGlitching(true);
      const t = setTimeout(() => setIsGlitching(false), 400);
      return () => clearTimeout(t);
    }
    prevSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Slide-in/out animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 33 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 33 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 }
      }
    })
  };

  // Terminal actions for Slide 7
  const runTerminalCommand = (text) => {
    if (isCrashed) return;

    let outputLines = [];
    const command = text.trim();
    
    if (command.length > 6) {
      const hexDump = Array.from(command.substring(6))
        .map(c => c.charCodeAt(0).toString(16).toUpperCase())
        .join('')
        .padEnd(8, '0')
        .substring(0, 8);

      outputLines = [
        { type: 'input', text: `Ingrese su clave (6 caracteres): ${command}` },
        { type: 'error', text: '*** stack smashing detected ***: terminated' },
        { type: 'error', text: 'Aborted (core dumped)' },
        { type: 'system', text: `[!] Desbordamiento detectado. EIP sobrescrito con: 0x${hexDump}` },
        { type: 'hacked', text: '[!] Ejecutando payload...' },
        { type: 'hacked', text: 'root@globalbank-atm:~# whoami' },
        { type: 'hacked', text: 'root' },
        { type: 'hacked', text: 'root@globalbank-atm:~# cat /secret/bank_vault.key' },
        { type: 'hacked', text: '5f39a7b2184e902c61099238fed4d081' },
        { type: 'hacked', text: '[!] ELUDIDO EL LOGIN EXITOSAMENTE' }
      ];
      setIsCrashed(true);
      // Trigger crash overlay
      setShowCrashOverlay(true);
      setTimeout(() => setShowCrashOverlay(false), 3200);
    } else {
      outputLines = [
        { type: 'input', text: `Ingrese su clave (6 caracteres): ${command}` },
        { type: 'error', text: 'ERROR: Clave incorrecta' },
        { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
      ];
    }

    setTerminalOutput(prev => {
      const slice = prev.slice(0, prev.length - 1);
      return [...slice, ...outputLines];
    });
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput) return;
    runTerminalCommand(terminalInput);
    setTerminalInput('');
  };

  const resetTerminal = () => {
    setTerminalOutput([
      { type: 'input', text: './atm_login' },
      { type: 'system', text: '--- GLOBALBANK SECURITY GATE v1.0.4 ---' },
      { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
    ]);
    setIsCrashed(false);
    setTerminalInput('');
    setMemoryInputPreview('');
    setShowCrashOverlay(false);
  };

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  return (
    <div className="relative w-screen h-screen bg-[#020c1b] text-[#e6f1ff] font-sans overflow-hidden flex flex-col justify-between">

      {/* ── CRASH OVERLAY ── */}
      <AnimatePresence>
        {showCrashOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Red flash + scanline glitch overlay */}
            <div className="absolute inset-0 bg-red-900/40 crash-flash"></div>
            <div className="absolute inset-0 glitch-layer-1 bg-[#ff000015]"></div>
            <div className="absolute inset-0 glitch-layer-2 bg-[#00ff0010]"></div>
            {/* Central crash message */}
            <div className="relative text-center font-mono z-10">
              <div className="text-[#ff6b6b] text-4xl md:text-6xl font-extrabold tracking-widest crash-text-blink mb-4 [text-shadow:0_0_20px_#ff0000,0_0_40px_#ff0000]">
                CORE DUMPED
              </div>
              <div className="text-red-400/90 text-sm tracking-widest uppercase mb-2">*** stack smashing detected ***</div>
              <div className="text-orange-300 text-xs font-mono opacity-80">EIP → 0x4141414141 &bull; Segmentation Fault</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GLITCH TRANSITION OVERLAY (when entering slide 7) ── */}
      {isGlitching && (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          <div className="absolute inset-0 glitch-layer-1 bg-[#ff006630] glitch-skew"></div>
          <div className="absolute inset-0 glitch-layer-2 bg-[#00ffdd15]"></div>
        </div>
      )}

      {/* Sci-Fi Decorative Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a192f] via-[#020c1b] to-black opacity-90 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-5 bg-[linear-gradient(rgba(100,255,218,0.07)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(100,255,218,0.07)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>

      {/* Cyberpunk Scanline Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%]"></div>

      {/* Glow Orbs */}
      <div className="absolute -top-[10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-[#64ffda]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[10%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none"></div>

      {/* TOP HEADER */}
      <header className="relative z-30 flex items-center justify-between px-8 py-5 border-b border-[#64ffda]/10 bg-[#0a192f]/45 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded border border-[#64ffda]/30 bg-[#112240]">
            <Shield className="w-4 h-4 text-[#64ffda] animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-widest text-[#e6f1ff] font-outfit uppercase">
            Overflow <span className="text-[#64ffda]">Labs</span>
          </span>
        </div>
        
        {/* Active slide name helper */}
        <div className="hidden md:block text-xs font-mono text-[#8892b0] bg-[#112240]/60 px-4 py-1.5 rounded-full border border-[#64ffda]/10">
          Auditoría DevSecOps &bull; Caso GlobalBank
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNavOverlay(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono text-[#64ffda] hover:bg-[#64ffda]/10 border border-[#64ffda]/20 transition-all"
            title="Mostrar índice"
          >
            <span>Índice</span>
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded text-[#8892b0] hover:text-[#64ffda] hover:bg-white/5 transition-all"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href="./"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-white bg-[#112240] hover:bg-[#64ffda] hover:text-[#020c1b] transition-all border border-[#64ffda]/20 shadow-[0_0_15px_rgba(100,255,218,0.1)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Volver a la Web</span>
          </a>
        </div>
      </header>

      {/* MAIN CAROUSEL */}
      <main className="relative z-20 flex-grow w-full flex items-center justify-center px-6 md:px-12 py-4">
        <div className="w-full max-w-6xl h-full flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col justify-center items-center"
            >
              {/* SLIDE DECK TEMPLATE ROUTING */}
              
              {/* Slide 1: Portada */}
              {slides[currentSlide].type === 'cover' && (
                <div className="text-center flex flex-col items-center justify-center max-w-4xl p-6 relative">
                  <div className="absolute inset-0 -z-10 bg-radial-gradient from-cyan-500/5 to-transparent blur-3xl rounded-full"></div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#112240] border-2 border-[#64ffda] shadow-[0_0_30px_rgba(100,255,218,0.25)] mb-8"
                  >
                    <Shield className="w-12 h-12 text-[#64ffda]" />
                  </motion.div>

                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#e6f1ff] mb-4 font-outfit uppercase">
                    {slides[currentSlide].title}
                  </h1>
                  
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent mb-6"></div>

                  <p className="text-xl md:text-2xl font-medium text-blue-400 font-outfit tracking-wide max-w-3xl mb-12">
                    {slides[currentSlide].subtitle}
                  </p>

                  <div className="bg-[#112240]/60 backdrop-blur-md rounded-xl p-5 border border-[#64ffda]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-mono text-sm max-w-2xl text-left text-gray-300">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 text-[#64ffda]">
                      <Terminal className="w-4 h-4" />
                      <span>PRESENTADO POR:</span>
                    </div>
                    <div>
                      {slides[currentSlide].text}
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Nuestra Consultora */}
              {slides[currentSlide].type === 'about' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-[#64ffda]" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>
                  
                  <div className="h-1 bg-gradient-to-r from-[#64ffda] to-blue-500 w-24 mb-10 rounded-full"></div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <div className="group relative bg-[#112240]/60 backdrop-blur-md rounded-2xl border border-[#64ffda]/20 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-[#64ffda]/60">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#64ffda] to-blue-500 rounded-t-2xl"></div>
                      <div className="flex items-center gap-3 mb-4">
                        <Cpu className="w-6 h-6 text-[#64ffda]" />
                        <h3 className="text-2xl font-bold text-white font-outfit">Misión</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {slides[currentSlide].mision}
                      </p>
                    </div>

                    {/* Vision Card */}
                    <div className="group relative bg-[#112240]/60 backdrop-blur-md rounded-2xl border border-[#64ffda]/20 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-blue-400/60">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white font-outfit">Visión</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {slides[currentSlide].vision}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 3: El Cliente y El Problema */}
              {slides[currentSlide].type === 'problem' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-8 h-8 text-[#ff6b6b]" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>
                  
                  <div className="h-1 bg-[#ff6b6b] w-24 mb-8 rounded-full"></div>

                  <p className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
                    {slides[currentSlide].text}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Falla */}
                    <div className="bg-[#ff6b6b]/5 backdrop-blur-md border border-[#ff6b6b]/30 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-3 text-[#ff6b6b]">
                        <Bug className="w-5 h-5" />
                        <h3 className="font-bold font-outfit text-lg uppercase tracking-wide">Falla Técnica</h3>
                      </div>
                      <p className="text-gray-300">
                        {slides[currentSlide].falla}
                      </p>
                    </div>

                    {/* Riesgo */}
                    <div className="bg-red-950/10 backdrop-blur-md border border-red-500/20 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-3 text-red-400">
                        <Skull className="w-5 h-5" />
                        <h3 className="font-bold font-outfit text-lg uppercase tracking-wide">Impacto y Riesgo</h3>
                      </div>
                      <p className="text-gray-300">
                        {slides[currentSlide].riesgo}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 4: Nuestro Servicio (DevSecOps) */}
              {slides[currentSlide].type === 'service' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-8 h-8 text-[#64ffda] animate-spin" style={{ animationDuration: '8s' }} />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-[#64ffda] to-blue-500 w-24 mb-10 rounded-full"></div>

                  <div className="flex flex-col gap-6">
                    <div className="bg-[#112240]/40 backdrop-blur-md border border-[#64ffda]/10 rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] pointer-events-none"></div>
                      <p className="text-xl text-gray-200 leading-relaxed max-w-3xl">
                        {slides[currentSlide].text}
                      </p>
                    </div>

                    {/* Highlighting C Buffer Overflow */}
                    <div className="bg-gradient-to-r from-blue-950/30 to-[#112240]/60 backdrop-blur-md border-l-4 border-[#64ffda] border border-[#64ffda]/20 rounded-r-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-2 text-[#64ffda] font-mono text-xs uppercase tracking-widest">
                        <Code className="w-4 h-4" />
                        <span>Foco Crítico de Análisis</span>
                      </div>
                      <p className="text-lg font-medium text-white">
                        {slides[currentSlide].highlight}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 5: Herramientas Core */}
              {slides[currentSlide].type === 'tools' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-8 h-8 text-[#64ffda]" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-[#64ffda] to-blue-500 w-24 mb-10 rounded-full"></div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Tool 1 */}
                    <div className="group bg-[#112240]/70 backdrop-blur-md border border-[#64ffda]/10 hover:border-[#64ffda]/50 rounded-2xl p-8 shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#64ffda]/5 rounded-bl-[80px] group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="font-mono text-xs text-[#64ffda] border border-[#64ffda]/20 bg-[#64ffda]/5 px-3 py-1 rounded-full w-max mb-4">
                        Cppcheck
                      </div>
                      <h3 className="text-2xl font-bold text-white font-outfit mb-3">{slides[currentSlide].tools[0].name}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {slides[currentSlide].tools[0].desc}
                      </p>
                    </div>

                    {/* Tool 2 */}
                    <div className="group bg-[#112240]/70 backdrop-blur-md border border-[#64ffda]/10 hover:border-blue-400/50 rounded-2xl p-8 shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[80px] group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="font-mono text-xs text-blue-400 border border-blue-500/20 bg-blue-500/5 px-3 py-1 rounded-full w-max mb-4">
                        GDB
                      </div>
                      <h3 className="text-2xl font-bold text-white font-outfit mb-3">{slides[currentSlide].tools[1].name}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {slides[currentSlide].tools[1].desc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 6: Hallazgos de la Auditoría */}
              {slides[currentSlide].type === 'findings' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Bug className="w-8 h-8 text-[#ff6b6b]" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>

                  <div className="h-1 bg-[#ff6b6b] w-24 mb-10 rounded-full"></div>

                  <div className="flex flex-col gap-5">
                    {slides[currentSlide].findings.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#112240]/60 backdrop-blur-md border-l-4 border-red-500 border border-[#64ffda]/10 rounded-r-xl shadow-md"
                      >
                        <div className="flex items-start md:items-center gap-3">
                          <span className="font-mono text-xs px-2.5 py-1 bg-red-950/20 border border-red-500/30 text-[#ff6b6b] rounded-full uppercase tracking-wider">
                            Vulnerabilidad {index + 1}
                          </span>
                          <strong className="text-white font-outfit text-lg">{item.label}</strong>
                        </div>
                        <p className="text-gray-300 font-mono text-sm mt-2 md:mt-0 bg-[#0a192f] px-4 py-2 rounded border border-white/5">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 7: Demostración del Ataque (Terminal + Memory Map) */}
              {slides[currentSlide].type === 'attack' && (
                <div className="w-full max-w-6xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className={`w-8 h-8 ${isCrashed ? 'text-[#ff6b6b] animate-pulse' : 'text-[#ff6b6b]'}`} />
                    <h2 className="text-2xl md:text-4xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                    {isCrashed && (
                      <span className="ml-2 px-2 py-0.5 rounded font-mono text-[10px] bg-red-950/50 border border-[#ff6b6b]/50 text-[#ff6b6b] crash-text-blink uppercase tracking-widest">
                        SYSTEM COMPROMISED
                      </span>
                    )}
                  </div>

                  {/* 3-column layout: Explanation | Terminal | Memory Map */}
                  <div className="grid lg:grid-cols-7 gap-5 items-stretch">

                    {/* Col 1: Explanatory Text */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                      <div className="h-1 bg-[#ff6b6b] w-16 mb-4 rounded-full"></div>
                      <p className="text-gray-300 leading-relaxed text-sm mb-4">
                        {slides[currentSlide].text}
                      </p>
                      <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 p-3 rounded-xl flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#ff6b6b] mt-0.5 flex-shrink-0" />
                        <span className="text-[10px] text-gray-300 font-mono leading-relaxed">
                          Escribe una clave de <strong>&gt;6 chars</strong> (ej: <code className="text-[#ff6b6b]">AAAAAA1234</code>) y observa el mapa de memoria en tiempo real.
                        </span>
                      </div>
                    </div>

                    {/* Col 2: Interactive Mock Terminal */}
                    <div className={`lg:col-span-3 bg-[#020c1b] rounded-xl border shadow-lg flex flex-col overflow-hidden font-mono text-xs transition-all duration-500 ${
                      isCrashed ? 'border-[#ff6b6b]/60 shadow-[0_0_30px_rgba(255,107,107,0.25)]' : 'border-[#ff6b6b]/30 shadow-[0_10px_25px_rgba(255,107,107,0.1)]'
                    }`}>
                      {/* Terminal header */}
                      <div className="bg-[#112240] px-3 py-2 flex items-center justify-between border-b border-[#ff6b6b]/20">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        <span className="text-gray-400 text-[9px] uppercase tracking-widest">GDB / Stack Frame Audit</span>
                        {isCrashed && (
                          <button
                            onClick={resetTerminal}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] bg-red-950/40 border border-red-500/40 text-[#ff6b6b] hover:bg-[#ff6b6b]/20 transition-all"
                          >
                            <RotateCcw className="w-2 h-2" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>

                      {/* Terminal Body */}
                      <div className="p-3 bg-black/80 h-56 overflow-y-auto flex flex-col gap-0.5 text-gray-300">
                        {terminalOutput.map((line, idx) => (
                          <div key={idx} className={`leading-5 ${
                            line.type === 'error' ? 'text-[#ff6b6b] font-semibold' :
                            line.type === 'system' ? 'text-[#56b6c2]' :
                            line.type === 'hacked' ? 'text-[#c678dd] font-bold' :
                            line.type === 'input' ? 'text-gray-400' : 'text-gray-200'
                          }`}>
                            {line.type === 'input' && <span className="text-[#64ffda] font-bold">$ </span>}
                            {line.type === 'prompt' && <span className="text-[#64ffda] font-bold">&gt; </span>}
                            {line.text}
                          </div>
                        ))}
                        <div ref={terminalBottomRef} />
                      </div>

                      {/* Terminal input form */}
                      <form onSubmit={handleTerminalSubmit} className="flex border-t border-[#ff6b6b]/20 bg-[#112240]/80">
                        <span className="px-3 py-2.5 text-[#64ffda] font-bold text-xs">&gt;</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => {
                            setTerminalInput(e.target.value);
                            setMemoryInputPreview(e.target.value);
                          }}
                          placeholder={isCrashed ? 'core dumped...' : 'Ingresa clave aquí...'}
                          disabled={isCrashed}
                          className="flex-grow bg-transparent border-none outline-none text-[#e6f1ff] py-2.5 pr-3 font-mono text-xs disabled:opacity-40"
                          autoComplete="off"
                          spellCheck="false"
                        />
                        {!isCrashed && (
                          <button type="submit" className="px-3 bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border-l border-[#ff6b6b]/20 transition-all font-sans text-[10px]">
                            EXEC
                          </button>
                        )}
                      </form>
                    </div>

                    {/* Col 3: Memory Map Visualizer */}
                    <div className={`lg:col-span-2 rounded-xl border p-4 font-mono flex flex-col transition-all duration-500 ${
                      isCrashed
                        ? 'bg-red-950/10 border-[#ff6b6b]/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]'
                        : 'bg-[#112240]/50 border-[#64ffda]/15'
                    }`}>
                      <MemoryMap liveInput={isCrashed ? terminalInput : memoryInputPreview} crashed={isCrashed} />
                    </div>

                  </div>
                </div>
              )}

              {/* Slide 8: Remediación (El Código Seguro) */}
              {slides[currentSlide].type === 'remediation' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-[#64ffda] animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-[#64ffda] to-blue-500 w-24 mb-10 rounded-full"></div>

                  <div className="grid gap-4">
                    {slides[currentSlide].fixes.map((fix, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-[#112240]/60 backdrop-blur-md border border-[#64ffda]/20 rounded-xl shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#64ffda]"></div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white font-outfit text-lg mb-1">{fix.label}</h3>
                          <p className="text-gray-300 font-mono text-sm bg-[#0a192f]/50 px-2 py-1 rounded w-fit border border-white/5">{fix.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 9: Del Aula al Mercado */}
              {slides[currentSlide].type === 'market' && (
                <div className="w-full max-w-4xl flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Server className="w-8 h-8 text-[#64ffda]" />
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-[#e6f1ff] tracking-tight">{slides[currentSlide].title}</h2>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-[#64ffda] to-blue-500 w-24 mb-10 rounded-full"></div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Academic block */}
                    <div className="bg-[#112240]/55 border border-[#8892b0]/25 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-4 text-[#8892b0] font-mono text-xs uppercase tracking-wider">
                          <Code className="w-4 h-4" />
                          <span>Entorno Académico</span>
                        </div>
                        <p className="text-gray-200 text-lg leading-relaxed mb-6 font-outfit">
                          {slides[currentSlide].texts[0]}
                        </p>
                      </div>
                      <div className="bg-[#0a192f] p-3.5 rounded border border-white/5 text-xs text-[#ff6b6b] font-mono flex items-center gap-2">
                        <Bug className="w-4 h-4 flex-shrink-0" />
                        <span>Prog. colapsa localmente (Segfault). Sin consecuencias financieras.</span>
                      </div>
                    </div>

                    {/* Commercial block */}
                    <div className="bg-gradient-to-br from-[#112240]/80 to-blue-950/20 border-2 border-[#64ffda]/30 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_15px_30px_rgba(0,112,243,0.15)]">
                      <div>
                        <div className="flex items-center gap-2 mb-4 text-[#64ffda] font-mono text-xs uppercase tracking-wider">
                          <TrendingDown className="w-4 h-4" />
                          <span>Mundo Real / Mercado</span>
                        </div>
                        <p className="text-white text-lg leading-relaxed mb-6 font-outfit">
                          {slides[currentSlide].texts[1]}
                        </p>
                      </div>
                      <div className="bg-[#0a192f] p-3.5 rounded border border-[#64ffda]/20 text-xs text-[#64ffda] font-mono flex items-center gap-2">
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        <span>Prevenir vulnerabilidades ahorra reputación y pérdidas financieras.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 10: Conclusión */}
              {slides[currentSlide].type === 'conclusion' && (
                <div className="text-center flex flex-col items-center justify-center max-w-4xl p-6 relative">
                  <div className="absolute inset-0 -z-10 bg-radial-gradient from-cyan-500/5 to-transparent blur-3xl rounded-full"></div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#112240] border border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.2)] mb-8"
                  >
                    <Sparkles className="w-10 h-10 text-[#64ffda]" />
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl font-bold font-outfit text-[#e6f1ff] mb-4 tracking-tight">
                    {slides[currentSlide].title}
                  </h2>

                  <div className="h-1 w-20 bg-[#64ffda] mb-8 rounded-full"></div>

                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mb-12">
                    {slides[currentSlide].text}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={resetTerminal}
                      className="px-6 py-3 rounded font-mono text-xs bg-[#112240] hover:bg-[#112240]/80 text-[#8892b0] border border-[#8892b0]/20 transition-all"
                    >
                      Auditoría Overflow Labs v1.0
                    </button>
                    <a
                      href="/"
                      className="px-8 py-3 rounded font-outfit font-semibold text-[#020c1b] bg-[#64ffda] hover:bg-[#64ffda]/80 shadow-[0_0_25px_rgba(100,255,218,0.3)] transition-all flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Volver al Inicio</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM FOOTER NAVIGATION */}
      <footer className="relative z-30 flex flex-col md:flex-row items-center justify-between px-8 py-4 border-t border-[#64ffda]/10 bg-[#0a192f]/45 backdrop-blur-md gap-4">
        {/* Indicators */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm tracking-widest text-[#64ffda] font-bold">
            {String(currentSlide + 1).padStart(2, '0')} <span className="text-[#8892b0] font-normal">/</span> {String(totalSlides).padStart(2, '0')}
          </span>
          <div className="hidden sm:block text-xs font-mono text-[#8892b0] uppercase tracking-wider">
            {slides[currentSlide].title}
          </div>
        </div>

        {/* Thick progress bar */}
        <div className="flex-grow max-w-md mx-6 h-1.5 bg-[#112240] rounded-full overflow-hidden relative border border-[#64ffda]/5">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-[#64ffda] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-2.5 rounded bg-[#112240] hover:bg-[#64ffda]/10 border border-[#64ffda]/20 hover:border-[#64ffda] text-gray-300 hover:text-[#64ffda] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:hover:border-transparent transition-all flex items-center justify-center"
            title="Diapositiva Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className="px-6 py-2.5 rounded bg-[#112240] hover:bg-[#64ffda] border border-[#64ffda]/20 hover:border-[#64ffda] text-[#64ffda] hover:text-[#020c1b] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#64ffda] disabled:hover:border-transparent transition-all font-semibold font-outfit text-sm flex items-center gap-1 shadow-[0_0_20px_rgba(100,255,218,0.05)] hover:shadow-[0_0_25px_rgba(100,255,218,0.2)]"
            title="Siguiente Diapositiva"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* QUICK JUMP NAVIGATION DRAWER / OVERLAY */}
      <AnimatePresence>
        {showNavOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#020c1b]/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-3xl bg-[#0a192f] rounded-2xl border border-[#64ffda]/20 p-8 shadow-2xl relative">
              <button
                onClick={() => setShowNavOverlay(false)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded font-mono text-xs text-[#ff6b6b] hover:bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 transition-all"
              >
                Cerrar [ESC]
              </button>
              
              <h3 className="text-2xl font-bold font-outfit text-[#e6f1ff] mb-2">Índice de Diapositivas</h3>
              <p className="text-sm text-[#8892b0] mb-6">Selecciona una diapositiva para saltar directamente a ella.</p>

              <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => handleGoTo(idx)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      idx === currentSlide
                        ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]'
                        : 'bg-[#112240] border-[#64ffda]/10 hover:border-[#64ffda]/40 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold opacity-60">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-outfit font-semibold text-sm">
                      {slide.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresentationApp;
