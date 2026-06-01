import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import codigoClienteRaw from './archivos/codigo_cliente.c?raw';
import codigoSeguroRaw from './archivos/codigo_overflow_labs.c?raw';
import leonelImg from './assets/Leonel.jpg';
import {
  Shield,
  Terminal,
  Code,
  Bug,
  ChevronRight,
  Menu,
  X,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
  User,
  Play,
  Crosshair,
  FlaskConical,
  ShieldCheck,
  Search
} from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ASCII_ART = [
  "     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     ",
  "    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     ",
  "    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     ",
  "    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     ",
  "    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗",
  "     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝",
  "             B A N K I N G   S Y S T E M S            "
];

const getInitialOutput = (newMode) => {
  return [
    { type: 'system', text: newMode === 'vulnerable' ? '$ ./demo.exe' : '$ ./seguro.exe' },
    { type: 'ascii', text: '' },
    ...ASCII_ART.map(line => ({ type: 'ascii', text: line })),
    { type: 'ascii', text: '' },
    { type: 'prompt_with_input', text: 'Ingrese su numero de cuenta: 1000' },
    { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
  ];
};

const TerminalDemo = () => {
  const [mode, setMode] = useState('vulnerable');
  const [output, setOutput] = useState(getInitialOutput('vulnerable'));
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [output]);

  const resetTerminal = (newMode) => {
    setMode(newMode);
    setOutput(getInitialOutput(newMode));
    setInput('');
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    const isHackedState = output.some(o => o.text && o.text.includes('root@globalbank-atm:~#'));

    if (isHackedState) {
      setOutput(prev => [
        ...prev,
        { type: 'hacked_input', text: `root@globalbank-atm:~# ${currentInput}` },
        { type: 'hacked', text: `bash: ${currentInput}: command not found` }
      ]);
      setIsProcessing(false);
      return;
    }

    setOutput(prev => [
      ...prev.slice(0, prev.length - 1),
      { type: 'prompt_with_input', text: `Ingrese su clave (6 caracteres): ${currentInput}` }
    ]);

    await new Promise(r => setTimeout(r, 600));

    if (mode === 'vulnerable') {
      if (currentInput.length > 6) {
        const overflow = currentInput.substring(6);
        const hexDump = Array.from(overflow).map(c => c.charCodeAt(0).toString(16)).join('').toUpperCase().padEnd(8, '0').substring(0,8);
        setOutput(prev => [
          ...prev,
          { type: 'error', text: `*** stack smashing detected ***: terminated` },
          { type: 'error', text: `Aborted (core dumped)` },
          { type: 'system', text: ' ' },
          { type: 'hacked', text: `[!] Registro EIP sobrescrito con: 0x${hexDump}` },
          { type: 'hacked', text: `[!] Ejecutando shellcode...` },
          { type: 'system', text: ' ' },
          { type: 'hacked', text: `root@globalbank-atm:~# id` },
          { type: 'hacked', text: `uid=0(root) gid=0(root) groups=0(root)` },
          { type: 'system', text: ' ' },
          { type: 'error', text: 'SISTEMA COMPROMETIDO. CONTROL TOTAL OBTENIDO.' }
        ]);
      } else {
        setOutput(prev => [
          ...prev,
          { type: 'success', text: '✓ Acceso concedido.' },
          { type: 'system', text: ' ' },
          { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
        ]);
      }
    } else {
      if (currentInput.length > 6) {
        setOutput(prev => [
          ...prev,
          { type: 'warning', text: 'Advertencia: Entrada excedió límite de buffer (6 chars). Truncando a 6...' },
          { type: 'error', text: '✖ Error: clave incorrecta.' },
          { type: 'system', text: ' ' },
          { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
        ]);
      } else {
         setOutput(prev => [
          ...prev,
          { type: 'success', text: '✓ Acceso concedido.' },
          { type: 'system', text: ' ' },
          { type: 'prompt', text: 'Ingrese su clave (6 caracteres): ' }
        ]);
      }
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-[#112240] rounded-xl border border-[#64ffda]/20 p-6 flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
           <h3 className="text-xl font-bold text-[#e6f1ff] mb-4 relative z-10">Panel de Control</h3>
           <p className="text-gray-400 text-sm mb-6 relative z-10">Seleccione el modo de ejecución para probar cómo reacciona el sistema ante entradas maliciosas.</p>
           
           <div className="flex flex-col gap-4 relative z-10">
             <button 
                onClick={() => resetTerminal('vulnerable')}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${mode === 'vulnerable' ? 'bg-[#ff6b6b]/10 border-[#ff6b6b] text-[#ff6b6b]' : 'bg-[#0a192f] border-[#ff6b6b]/30 text-gray-400 hover:border-[#ff6b6b]/60'}`}
             >
                <Bug className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-bold">Modo Vulnerable</div>
                  <div className="text-xs opacity-80">Usa función gets()</div>
                </div>
             </button>

             <button 
                onClick={() => resetTerminal('secure')}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${mode === 'secure' ? 'bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]' : 'bg-[#0a192f] border-[#64ffda]/30 text-gray-400 hover:border-[#64ffda]/60'}`}
             >
                <Shield className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-bold">Modo Seguro</div>
                  <div className="text-xs opacity-80">Usa función fgets()</div>
                </div>
             </button>
           </div>
           
           <div className="mt-8 relative z-10">
             <h4 className="text-sm font-semibold text-[#e6f1ff] mb-2">Instrucciones:</h4>
             <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
               <li>Intente ingresar una clave normal (ej: 123456)</li>
               <li>Intente ingresar una clave larga (ej: AAAAAAAAAA)</li>
             </ul>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col bg-[#0a192f] rounded-xl border border-[#64ffda]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-sm relative">
        <div className="bg-[#112240] px-4 py-3 flex items-center justify-between border-b border-[#64ffda]/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[#8892b0] text-xs">
            {mode === 'vulnerable' ? 'root@globalbank-server:~ (Vulnerable)' : 'root@globalbank-server:~ (Seguro)'}
          </span>
          <Terminal className="w-4 h-4 text-[#8892b0]" />
        </div>

        <div ref={terminalContainerRef} className="p-4 flex-grow overflow-y-auto h-[400px] bg-[#020c1b] text-gray-300">
          {output.map((line, i) => (
            <div key={i} className={`mb-1 ${
              line.type === 'error' ? 'text-[#ff6b6b]' : 
              line.type === 'success' ? 'text-[#64ffda]' : 
              line.type === 'warning' ? 'text-[#ffbd2e]' :
              line.type === 'hacked' ? 'text-[#c678dd] font-bold' :
              line.type === 'hacked_input' ? 'text-gray-300' :
              line.type === 'system' ? 'text-[#56b6c2]' : 
              line.type === 'ascii' ? 'text-[#64ffda] font-bold whitespace-pre' :
              line.type === 'prompt_with_input' ? 'text-gray-300' :
              line.type === 'prompt' ? 'text-[#64ffda] font-bold' : ''
            }`}>
              {line.type.startsWith('prompt') ? (
                <>
                  <span className="text-[#64ffda] font-bold">  ▶ </span>
                  <span className={line.type === 'prompt' ? 'text-gray-300' : 'text-gray-300'}>{line.text}</span>
                </>
              ) : line.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex border-t border-[#64ffda]/20 bg-[#112240] relative">
          <span className="px-4 py-3 text-[#64ffda] font-bold whitespace-pre">
            {output.some(o => o.text && o.text.includes('root@globalbank-atm:~#')) ? 'root@globalbank-atm:~#' : '  ▶ '}
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-grow bg-transparent border-none outline-none text-[#e6f1ff] py-3 pr-4 font-mono disabled:opacity-50"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#020c1b] text-[#8892b0] font-sans selection:bg-[#64ffda] selection:text-[#020c1b] flex flex-col relative overflow-hidden">

      {/* Dynamic Animated Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#64ffda]/10 blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[#0a192f] blur-[120px]"
        />
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed w-full top-0 z-50 bg-[#0a192f]/70 backdrop-blur-xl border-b border-[#64ffda]/10"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#64ffda] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
              <img src="/logo.png" alt="Overflow Labs Logo" className="w-auto h-12 relative z-10 rounded" />
            </div>
            <span className="text-xl font-bold text-[#e6f1ff] tracking-wider ml-2">
              OVERFLOW <span className="text-[#64ffda]">LABS</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Nosotros', 'Caso de Estudio', 'Demo', 'Herramientas', 'Presentación', 'Equipo'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                whileHover={{ y: -2, color: '#64ffda' }}
                className="text-sm font-medium text-[#e6f1ff] transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#e6f1ff] hover:text-[#64ffda] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-20 left-0 w-full bg-[#112240]/95 backdrop-blur-xl border-b border-[#64ffda]/10 px-6 py-4 flex flex-col gap-4 overflow-hidden"
            >
              {['Nosotros', 'Caso de Estudio', 'Demo', 'Herramientas', 'Presentación', 'Equipo'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-[#e6f1ff] hover:text-[#64ffda]"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-grow z-10 pt-20">

        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono mb-8 border border-[#64ffda]/20 backdrop-blur-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Ciberseguridad de Nivel Empresarial</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-[#e6f1ff] leading-tight mb-6"
            >
              Protegemos sus activos digitales <span className="text-[#64ffda] glow-text inline-block">más críticos.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-[#8892b0]"
            >
              Especialistas en Auditoría de Código Seguro y prevención de Desbordamientos de Búfer para el sector financiero en América Latina.
            </motion.p>

            <motion.a
              href="#demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-[#020c1b] bg-[#64ffda] rounded overflow-hidden shadow-[0_0_20px_rgba(100,255,218,0.4)] hover:shadow-[0_0_40px_rgba(100,255,218,0.6)] transition-shadow duration-300"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-2">
                Ver Demo Técnica
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </span>
            </motion.a>
          </div>
        </section>

        {/* About Us */}
        <motion.section
          id="nosotros"
          className="py-24 bg-[#0a192f]/50 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-6 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-[#64ffda]" />
                  Nuestra Misión y Visión
                </h2>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-1 bg-[#64ffda] mb-8 rounded-full"
                ></motion.div>
                <p className="text-lg leading-relaxed mb-6">
                  En Overflow Labs, nos dedicamos incansablemente a erradicar vulnerabilidades de memoria en software de bajo nivel, especialmente en lenguajes como C y C++.
                </p>
                <p className="text-lg leading-relaxed">
                  Nuestra misión es garantizar la máxima seguridad operativa para infraestructuras críticas, blindando sistemas financieros contra ataques de ejecución de código arbitrario y explotación de memoria.
                </p>
              </div>
              <motion.div
                whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }}
                className="w-full md:w-1/2 perspective-1000"
              >
                <div className="relative rounded-xl overflow-hidden border border-[#64ffda]/20 bg-[#112240]/80 backdrop-blur-md p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent opacity-50"></div>
                  <pre className="font-mono text-sm text-[#8892b0] overflow-x-auto">
                    <code>
                      <span className="text-gray-500">// Misión de Seguridad</span>{"\n"}
                      <span className="text-[#c678dd]">int</span> <span className="text-[#61afef]">secure_system</span>() {"{"}{"\n"}
                      {"  "}<span className="text-[#c678dd]">while</span>(threats_exist) {"{"}{"\n"}
                      {"    "}<motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[#56b6c2]">audit_code</motion.span>();{"\n"}
                      {"    "}<span className="text-[#56b6c2]">patch_vulnerabilities</span>();{"\n"}
                      {"  "}{"}"}{"\n"}
                      {"  "}<span className="text-[#c678dd]">return</span> <span className="text-[#d19a66]">MAXIMUM_SECURITY</span>;{"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Case Study */}
        <motion.section
          id="caso-de-estudio"
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4">El Problema y la Solución</h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-[#64ffda] mx-auto mb-6 rounded-full"
              ></motion.div>
              <p className="text-lg max-w-2xl mx-auto">Cómo salvamos a una institución financiera de un ataque crítico de día cero.</p>
            </div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#112240]/60 backdrop-blur-lg rounded-2xl border border-[#64ffda]/20 overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#64ffda]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-full lg:w-1/2 p-10 border-b lg:border-b-0 lg:border-r border-[#64ffda]/10 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-[#64ffda]" />
                  <h3 className="text-2xl font-bold text-[#e6f1ff]">Banco "GlobalBank"</h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-start gap-3 text-[#ff6b6b] mb-2">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
                    </motion.div>
                    <h4 className="text-xl font-semibold">El Problema Crítico</h4>
                  </div>
                  <p className="pl-8 text-gray-300">
                    Hackers lograron evadir las pantallas de inicio de sesión de los cajeros automáticos explotando un <strong className="text-[#ff6b6b]">Desbordamiento de Búfer</strong>. La vulnerabilidad permitía la ejecución de código remoto.
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 p-10 bg-[#0a192f]/80 flex flex-col justify-center relative z-10">
                <div className="mb-6">
                  <div className="flex items-start gap-3 text-[#64ffda] mb-2">
                    <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                    <h4 className="text-xl font-semibold">Nuestra Solución</h4>
                  </div>
                  <p className="pl-8 mb-6 text-gray-300">
                    Reemplazamos la función insegura <code className="text-[#ff6b6b] bg-[#ff6b6b]/10 px-1.5 py-0.5 rounded border border-[#ff6b6b]/20">gets()</code> por su alternativa segura <code className="text-[#64ffda] bg-[#64ffda]/10 px-1.5 py-0.5 rounded border border-[#64ffda]/20">fgets()</code>, implementando límites estrictos de memoria.
                  </p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pl-8"
                  >
                    <div className="bg-[#112240] rounded-lg p-5 border-l-4 border-[#64ffda] shadow-lg">
                      <p className="text-sm font-bold text-[#e6f1ff] mb-1">Resultado:</p>
                      <p className="text-sm text-gray-400">Ataque bloqueado exitosamente, previniendo pérdidas millonarias y restaurando la confianza del cliente.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Tools Section */}
        <section id="herramientas" className="py-24 bg-[#0a192f]/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4">Tecnologías que utilizamos</h2>
              <div className="w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full"></div>
              <p className="text-lg max-w-2xl mx-auto">Herramientas de grado industrial para análisis profundo y mitigación de amenazas.</p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Card 1 */}
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-[#112240]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#64ffda]/10 hover:border-[#64ffda]/50 transition-all duration-300 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150"></div>
                <Code className="w-12 h-12 text-[#64ffda] mb-6 relative z-10" />
                <h3 className="text-2xl font-bold text-[#e6f1ff] mb-3 relative z-10 group-hover:text-[#64ffda] transition-colors">Cppcheck</h3>
                <div className="inline-block px-3 py-1 bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono rounded-full mb-4 relative z-10 border border-[#64ffda]/20">Análisis Estático</div>
                <p className="relative z-10 text-gray-400">
                  Herramienta avanzada de análisis estático diseñada para detectar bugs indefinidos y construcciones peligrosas en bases de código C/C++, incluso antes de la compilación.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-[#112240]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#64ffda]/10 hover:border-[#64ffda]/50 transition-all duration-300 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150"></div>
                <Terminal className="w-12 h-12 text-[#64ffda] mb-6 relative z-10" />
                <h3 className="text-2xl font-bold text-[#e6f1ff] mb-3 relative z-10 group-hover:text-[#64ffda] transition-colors">GDB</h3>
                <div className="inline-block px-3 py-1 bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono rounded-full mb-4 relative z-10 border border-[#64ffda]/20">Depuración de Memoria</div>
                <p className="relative z-10 text-gray-400">
                  El depurador GNU nos permite inspeccionar el estado exacto de la memoria y la pila de ejecución en tiempo real para identificar desbordamientos y fugas de datos.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4">Demostración de Código</h2>
              <div className="w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full"></div>
              <p className="text-lg max-w-2xl mx-auto">Comparativa del código vulnerable del cliente vs nuestra implementación segura.</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Client Code */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 rounded-xl overflow-hidden border border-[#ff6b6b]/30 bg-[#112240] flex flex-col shadow-[0_10px_30px_rgba(255,107,107,0.15)] max-h-[500px]"
              >
                <div className="bg-[#0a192f] border-b border-[#ff6b6b]/20 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <span className="text-xs font-mono text-[#ff6b6b] flex items-center gap-2">
                    <Bug className="w-3 h-3" /> codigo_cliente.c
                  </span>
                </div>
                <div className="p-4 overflow-y-auto overflow-x-auto text-xs font-mono text-gray-300 flex-grow scrollbar-thin scrollbar-thumb-[#ff6b6b]/20">
                  <pre><code>{codigoClienteRaw}</code></pre>
                </div>
              </motion.div>

              {/* Secure Code */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 rounded-xl overflow-hidden border border-[#64ffda]/30 bg-[#112240] flex flex-col shadow-[0_10px_30px_rgba(100,255,218,0.15)] max-h-[500px]"
              >
                <div className="bg-[#0a192f] border-b border-[#64ffda]/20 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <span className="text-xs font-mono text-[#64ffda] flex items-center gap-2">
                    <Shield className="w-3 h-3" /> codigo_overflow_labs.c
                  </span>
                </div>
                <div className="p-4 overflow-y-auto overflow-x-auto text-xs font-mono text-gray-300 flex-grow scrollbar-thin scrollbar-thumb-[#64ffda]/20">
                  <pre><code>{codigoSeguroRaw}</code></pre>
                </div>
              </motion.div>
            </div>

            <TerminalDemo />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 bg-[#112240] p-6 rounded-xl border border-[#64ffda]/10 text-center max-w-3xl mx-auto"
            >
              <h4 className="text-lg font-semibold text-[#e6f1ff] mb-2">Explicación Técnica</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                La función <code className="text-[#ff6b6b]">gets()</code> lee caracteres de la entrada estándar hasta encontrar un salto de línea, sin verificar si el búfer de destino tiene espacio suficiente. Esto permite a un atacante introducir más datos de los esperados, sobrescribiendo zonas adyacentes de memoria (Buffer Overflow) y potencialmente ejecutando código arbitrario. Al reemplazarla con <code className="text-[#64ffda]">fgets()</code>, establecemos un límite estricto de lectura basado en el tamaño del búfer, mitigando completamente el vector de ataque.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Presentation Section */}
        <motion.section
          id="presentacion"
          className="py-24 bg-[#0a192f]/50 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          {/* Subtle decorations */}
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#64ffda]/5 blur-[80px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4 flex items-center justify-center gap-3">
                <Play className="w-8 h-8 text-[#64ffda] animate-pulse" />
                Presentación del Caso de Éxito
              </h2>
              <div className="w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full"></div>
              <p className="text-lg max-w-2xl mx-auto">
                Acceda a nuestra presentación interactiva a pantalla completa detallando la auditoría de ciberseguridad, análisis de vulnerabilidades y remediación.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-[#112240]/60 backdrop-blur-md rounded-2xl border border-[#64ffda]/20 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent"></div>
              
              <div className="flex-grow space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono border border-[#64ffda]/20">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DECK COMPLETO - 10 DIAPOSITIVAS</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Diapositivas Ejecutivas de Ciberseguridad</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Presentamos el desglose técnico de la intrusión y remediación realizada para <strong>GlobalBank</strong>. Incluye un simulador de desbordamiento de pila interactivo, herramientas de diagnóstico de DevSecOps como Cppcheck y GDB, y la comparación del impacto del código de bajo nivel.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                  <span className="bg-[#0a192f] px-2.5 py-1 rounded border border-white/5">&bull; Portada</span>
                  <span className="bg-[#0a192f] px-2.5 py-1 rounded border border-white/5">&bull; Caso GlobalBank</span>
                  <span className="bg-[#0a192f] px-2.5 py-1 rounded border border-white/5">&bull; Auditoría C</span>
                  <span className="bg-[#0a192f] px-2.5 py-1 rounded border border-white/5">&bull; Terminal de Ataque</span>
                  <span className="bg-[#0a192f] px-2.5 py-1 rounded border border-white/5">&bull; Remediación</span>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto">
                <a
                  href="./presentacion.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 font-bold font-outfit text-[#020c1b] bg-[#64ffda] hover:bg-[#64ffda]/90 rounded-lg shadow-[0_0_20px_rgba(100,255,218,0.3)] hover:shadow-[0_0_35px_rgba(100,255,218,0.5)] transition-all group duration-300 transform hover:scale-[1.03]"
                >
                  <Play className="w-5 h-5 fill-current animate-pulse" />
                  <span>PRESENTACIÓN</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Our Team */}
        <section id="equipo" className="py-24 relative overflow-hidden">
          {/* Decorative glow behind cards */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#64ffda]/5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4">Nuestro Equipo</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-[#64ffda] mx-auto mb-6 rounded-full"></div>
              <p className="text-lg max-w-2xl mx-auto">Especialistas de élite en auditoría de código y seguridad ofensiva para infraestructuras financieras críticas.</p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Card: Leonel Rosso */}
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -12, scale: 1.01 }}
                className="group relative bg-[#112240]/70 backdrop-blur-md rounded-2xl overflow-hidden border border-[#64ffda]/15 hover:border-[#64ffda]/50 transition-all duration-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#64ffda] to-blue-500"></div>
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                {/* Avatar area */}
                <div className="h-44 bg-gradient-to-br from-[#0a192f] to-[#112240]/80 flex items-center justify-center relative overflow-hidden">
                  {/* Animated grid bg */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(100,255,218,0.15)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(100,255,218,0.15)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                  {/* Avatar circle — foto real */}
                  <div className="relative z-10 flex flex-col items-center">
                    <img
                      src={leonelImg}
                      alt="Leonel Rosso"
                      className="foto-equipo w-24 h-24 rounded-full object-cover object-top border-2 border-[#64ffda]/40 group-hover:border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.1)] mb-3"
                    />
                  </div>
                  {/* Role badge floating */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#020c1b]/80 border border-[#64ffda]/30 rounded-full text-[10px] font-mono text-[#64ffda] uppercase tracking-widest whitespace-nowrap backdrop-blur-sm">
                    Pentester & Auditor
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-grow gap-4 relative z-10">
                  <div>
                    <h4 className="text-xl font-bold text-[#e6f1ff] mb-1">Leonel Rosso</h4>
                    <p className="text-sm text-[#64ffda] font-mono">Auditor de Código &amp; Pentester</p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {['Buffer Overflow', 'C/C++', 'GDB', 'Exploit Dev'].map(skill => (
                      <span key={skill} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a192f] border border-[#64ffda]/20 text-gray-400">{skill}</span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    Especialista en análisis de vulnerabilidades de bajo nivel y pruebas de penetración orientadas a sistemas bancarios embebidos.
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64ffda]/60">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sec. Ofensiva</span>
                    </div>
                    <a
                      href="https://github.com/leonelrosso"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0a192f] border border-[#64ffda]/20 rounded-full text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda]/60 hover:bg-[#64ffda]/10 transition-all"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card: Juan Pablo Figueroa */}
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -12, scale: 1.01 }}
                className="group relative bg-[#112240]/70 backdrop-blur-md rounded-2xl overflow-hidden border border-blue-500/15 hover:border-blue-400/50 transition-all duration-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                {/* Avatar area */}
                <div className="h-44 bg-gradient-to-br from-[#0a192f] to-[#112240]/80 flex items-center justify-center relative overflow-hidden">
                  {/* Animated grid bg */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(59,130,246,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                  {/* Avatar circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#112240] border-2 border-blue-500/40 group-hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-300 flex items-center justify-center mb-3">
                      <Search className="w-10 h-10 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                  {/* Role badge floating */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#020c1b]/80 border border-blue-500/30 rounded-full text-[10px] font-mono text-blue-400 uppercase tracking-widest whitespace-nowrap backdrop-blur-sm">
                    Depuración & QA
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-grow gap-4 relative z-10">
                  <div>
                    <h4 className="text-xl font-bold text-[#e6f1ff] mb-1">Juan Pablo Figueroa</h4>
                    <p className="text-sm text-blue-400 font-mono">Analista de Depuración &amp; QA</p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {['Cppcheck', 'GDB Debugger', 'QA Testing', 'C Seguro'].map(skill => (
                      <span key={skill} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a192f] border border-blue-500/20 text-gray-400">{skill}</span>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    Especialista en análisis estático de código y depuración de memoria en sistemas de bajo nivel, asegurando la correcta mitigación de vulnerabilidades.
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400/60">
                      <Bug className="w-3.5 h-3.5" />
                      <span>Análisis Estático</span>
                    </div>
                    <a
                      href="https://github.com/juanpfigueroa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#0a192f] border border-blue-500/20 rounded-full text-[#8892b0] hover:text-blue-400 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0a192f] border-t border-[#64ffda]/10 py-10 z-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <img src="./logo.png" alt="Overflow Labs Logo" className="w-auto h-8" />
            <span className="font-bold text-[#e6f1ff] tracking-widest ml-2">OVERFLOW LABS</span>
          </div>
          <p className="text-sm text-[#8892b0]">
            © 2026 Overflow Labs. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
