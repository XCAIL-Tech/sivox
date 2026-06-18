import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mic2, ChevronLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth";

type View = "welcome" | "login" | "register";

const COUNTRIES = [
  { name: "Argentina", code: "ar" }, { name: "Bolivia", code: "bo" },
  { name: "Chile", code: "cl" }, { name: "Colombia", code: "co" },
  { name: "Costa Rica", code: "cr" }, { name: "España", code: "es" },
  { name: "México", code: "mx" }, { name: "Paraguay", code: "py" },
  { name: "Perú", code: "pe" }, { name: "Uruguay", code: "uy" },
  { name: "Venezuela", code: "ve" }, { name: "Rep. Dominicana", code: "do" },
];
const MARQUEE = [...COUNTRIES, ...COUNTRIES];

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-between relative bg-sivox-700 overflow-hidden pt-12 pb-8 border-r border-sivox-800/30">

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] h-[400px] w-[400px] rounded-full bg-sivox-500/20 blur-[100px]" />
        <div className="absolute bottom-[20%] -right-[10%] h-[300px] w-[300px] rounded-full bg-sivox-900/30 blur-[80px]" />
      </div>

      <div
        className="relative z-20 pt-4 lg:pt-0"
        style={{ animation: "heartbeat 4s ease-in-out infinite" }}
      >
        <div className="w-[120px] h-[120px] mx-auto rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
          <Mic2 className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start pt-14 lg:pt-2 pb-12">
        <div className="text-center px-12 space-y-3">
          <h2 className="flex flex-col items-center text-2xl lg:text-3xl font-black tracking-tight leading-[1.1]">
            <span className="uppercase text-base lg:text-lg text-sivox-200">Un espacio para</span>
            <span className="uppercase text-white">comunicarte</span>
          </h2>
          <div className="h-1 w-16 bg-white/30 rounded-full mx-auto" />
          <p className="text-sm font-medium text-sivox-100 max-w-xl mx-auto leading-relaxed pt-2">
            Creamos SIVOX para que puedas componer y expresar mensajes con total autonomía.
            Una herramienta pensada para acompañar con tecnología accesible en todo el mundo de habla hispana.
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden bg-sivox-800/20 backdrop-blur-sm py-5 z-10 border-y border-white/10 shadow-sm">
        <div
          className="flex w-max items-center pl-8"
          style={{ animation: "marquee 80s linear infinite" }}
        >
          {MARQUEE.map((c, i) => (
            <div key={i} className="flex items-center shrink-0">
              <img
                src={`https://flagcdn.com/w20/${c.code}.png`}
                alt={c.name}
                width={20}
                className="rounded-sm shadow-sm shrink-0 ml-8 border border-white/20"
                loading="lazy"
              />
              <span className="text-[11px] font-black uppercase tracking-widest text-sivox-100 whitespace-nowrap pl-2 pr-8">
                {c.name}
              </span>
              <span className="text-white/20 text-lg opacity-50 shrink-0 mx-1">•</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.08); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage({ initialView = "welcome" }: { initialView?: View }) {
  const navigate = useNavigate();
  const [view, setView] = useState<View>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Limpiar error al cambiar de vista
  useEffect(() => {
    setError("");
  }, [view]);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (view === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      navigate("/");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle("AR");
      navigate("/");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function switchView(next: View) {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setView(next);
  }

  return (
    <div className="relative flex flex-col lg:flex-row bg-white min-h-screen lg:min-h-screen">
      <LeftPanel />

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-white overflow-y-auto py-12">
        <div className="w-full max-w-[500px] px-6">

          {/* Header */}
          <div className="flex flex-col items-center pt-10 pb-4 text-center relative lg:pt-2">

            {view !== "welcome" && (
              <button
                onClick={() => switchView("welcome")}
                className="absolute left-0 top-2 p-2.5 text-slate-400 hover:text-sivox-600 hover:bg-sivox-50 rounded-full transition-all active:scale-95"
              >
                <ChevronLeft className="w-7 h-7" strokeWidth={3} />
              </button>
            )}

            <div className="mb-4 h-24 w-full flex items-center justify-center">
              <div className="w-[90px] h-[90px] rounded-2xl bg-sivox-500/10 border border-sivox-500/20 flex items-center justify-center">
                <Mic2 className="w-11 h-11 text-sivox-500" />
              </div>
            </div>

            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 leading-none mb-3">
              {view === "welcome" ? "¡Empecemos!" :
               view === "login" ? "Iniciar sesión" :
               "Crear mi cuenta"}
            </h1>
            <p className="text-xs lg:text-[13px] text-slate-500 font-medium leading-relaxed">
              {view === "welcome" ? "Personalizá tu experiencia y gestioná tu comunicador." :
               view === "login" ? "Ingresá tus credenciales para acceder." :
               "Ingresá tus datos para comenzar a usar SIVOX."}
            </p>
          </div>

          {/* ── Bienvenida ── */}
          {view === "welcome" && (
            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={() => switchView("register")}
                className="h-14 rounded-full text-sm font-black bg-sivox-600 hover:bg-sivox-700 text-white shadow-xl shadow-sivox-600/20 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                Crear mi cuenta
              </button>
              <button
                onClick={() => switchView("login")}
                className="h-14 rounded-full text-sm font-black border-2 border-slate-100 hover:border-sivox-200 hover:bg-sivox-50 text-sivox-600 active:scale-95 transition-all"
              >
                Iniciar sesión
              </button>

              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex -space-x-1.5">
                  {["bg-slate-400","bg-sky-500","bg-teal-500","bg-blue-600","bg-yellow-400","bg-green-500","bg-orange-500","bg-violet-500","bg-pink-500","bg-white","bg-amber-800","bg-sivox-600"].map((color, i) => (
                    <div key={i} className={`h-7 w-7 rounded-full border border-slate-200 overflow-hidden shadow-sm ${color} flex items-center justify-center`}>
                      <span className={`text-[10px] font-bold ${color === "bg-white" ? "text-slate-300" : "text-white/90"}`}>•</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] uppercase font-black tracking-[0.15em] text-slate-300">
                  Únete a nuestra comunidad
                </p>
              </div>
            </div>
          )}

          {/* ── Login / Registro ── */}
          {(view === "login" || view === "register") && (
            <div className="flex flex-col gap-3 pt-2">

              {/* Error global */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleEmailAuth} className="space-y-3">

                {/* Nombre — solo en registro */}
                {view === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      className="w-full h-9 rounded-xl border-2 border-slate-100 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-sivox-300 transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus={view === "login"}
                    className="w-full h-9 rounded-xl border-2 border-slate-100 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-sivox-300 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
                      Contraseña
                    </label>
                    {view === "login" && (
                      <span className="text-[10px] text-sivox-600 font-bold cursor-pointer hover:underline">
                        ¿La olvidaste?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full h-9 rounded-xl border-2 border-slate-100 bg-white px-3 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-sivox-300 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full font-black text-white bg-sivox-600 hover:bg-sivox-700 text-xs uppercase tracking-widest mt-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? "Cargando…" : (view === "login" ? "Ingresar" : "Registrarme")}
                </button>
              </form>

              {/* Separador */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">o</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Botón Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full h-11 rounded-full border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                <GoogleIcon />
                Continuar con Google
              </button>

              <p className="text-[11px] text-slate-400 font-medium text-center pt-1">
                {view === "login" ? "¿No tenés cuenta todavía?" : "¿Ya tenés una cuenta?"}
                {" "}
                <button
                  type="button"
                  onClick={() => switchView(view === "login" ? "register" : "login")}
                  className="text-sivox-600 font-black hover:underline ml-1"
                >
                  {view === "login" ? "Registrate aquí" : "Iniciá sesión aquí"}
                </button>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sivox-600 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
