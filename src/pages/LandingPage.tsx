import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic2, ScanLine, Sparkles, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANDING_THEMES } from "@/lib/landingThemes";
import { useLandingThemeStore } from "@/store/useLandingThemeStore";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

// Habilita scroll + aplica fondo del tema al body
function useScrollable(bg: string, color: string) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");
    html.style.overflow = "auto";
    html.style.height = "auto";
    body.style.overflow = "auto";
    body.style.height = "auto";
    body.style.backgroundColor = bg;
    body.style.color = color;
    if (root) { root.style.height = "auto"; root.style.overflow = "auto"; }
    return () => {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
      body.style.backgroundColor = "";
      body.style.color = "";
      if (root) { root.style.height = ""; root.style.overflow = ""; }
    };
  }, [bg, color]);
}

const FEATURES = [
  {
    icon: ScanLine,
    title: "Barrido inteligente",
    description: "Un solo botón controla todo. El cursor navega automáticamente entre filas y celdas para seleccionar letras o frases.",
  },
  {
    icon: Sparkles,
    title: "Predicción con IA",
    description: "Anticipa palabras mientras escribís, en español. Aprende tu vocabulario personal y mejora con el tiempo.",
  },
  {
    icon: WifiOff,
    title: "100% offline",
    description: "Funciona sin internet. Instalable en cualquier dispositivo como aplicación nativa (PWA).",
  },
];

export default function LandingPage() {
  const { themeId } = useLandingThemeStore();
  const theme = LANDING_THEMES[themeId];

  useScrollable(theme.bg, theme.textColor);

  return (
    <div className={cn("min-h-screen", theme.wrapper)}>
      <NavBar />

      {/* ── Hero ── */}
      <section className={cn(
        "relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-start sm:justify-center overflow-hidden pt-24 pb-8 sm:pt-0 sm:pb-16",
        theme.heroBg,
      )}>
        {/* Blobs de fondo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className={cn(
            "absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full blur-[100px]",
            theme.blob1,
          )} />
          <div className={cn(
            "absolute top-[20%] -right-[5%] h-[350px] w-[350px] rounded-full blur-[120px]",
            theme.blob2,
          )} />
          {/* Textura de puntos */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="container relative z-10 flex max-w-4xl flex-col items-center text-center">

          {/* Ícono flotante animado */}
          <div className="mb-6 sm:mt-12" style={{ animation: "float 4s ease-in-out infinite" }}>
            <div className={cn(
              "relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] mx-auto rounded-3xl flex items-center justify-center shadow-lg",
              theme.iconBox,
            )}>
              <Mic2 className={cn("w-10 h-10 sm:w-12 sm:h-12", theme.iconColor)} />
            </div>
          </div>

          {/* Título */}
          <h1 className="mb-4 flex flex-col items-center text-balance font-bold tracking-tight uppercase">
            <span className={cn("text-sm font-black opacity-70 sm:text-lg md:text-xl", theme.heroText)}>
              Un espacio para
            </span>
            <span className={cn(
              "mt-2 text-3xl font-black leading-none sm:text-5xl md:text-6xl",
              "bg-gradient-to-r bg-clip-text text-transparent",
              theme.titleGrad,
            )}>
              comunicarte
            </span>
          </h1>

          {/* Subtítulo */}
          <p className={cn(
            "mb-8 max-w-2xl mx-auto text-balance text-sm font-medium leading-relaxed sm:text-base md:px-8",
            theme.heroSubtext,
          )}>
            Diseñamos SIVOX para que las personas con discapacidad motora puedan componer
            y expresar mensajes con autonomía, usando un solo botón y predicción de palabras por IA.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-5">
            <Link to="/registro">
              <button className={cn(
                "relative h-12 px-10 rounded-full text-sm font-black transition-all duration-300 uppercase tracking-widest hover:scale-105 active:scale-95",
                theme.btnPrimary,
              )}>
                Comenzar Ahora
              </button>
            </Link>
            <p className={cn("text-[10px] font-bold tracking-widest uppercase", theme.heroMuted)}>
              Sin costo · Sin instalación · Funciona en cualquier dispositivo
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={cn("py-16 sm:py-24", theme.sectionBg)}>
        <div className="container max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className={cn("mb-4 text-3xl font-bold sm:text-4xl", theme.sectionTitle)}>
              ¿Qué podés hacer con SIVOX?
            </h2>
            <p className={cn("mx-auto max-w-2xl text-base", theme.sectionText)}>
              Cada función fue pensada para dar al usuario la mayor autonomía
              con el menor esfuerzo posible.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className={cn(
                  "group rounded-3xl p-8 transition-all hover:shadow-lg hover:-translate-y-0.5",
                  theme.card,
                )}
              >
                <div className={cn(
                  "mb-4 w-12 h-12 rounded-xl flex items-center justify-center",
                  theme.cardIconBox,
                )}>
                  <Icon className={cn("w-5 h-5", theme.iconColor)} />
                </div>
                <h3 className={cn("mb-3 text-xl font-bold", theme.cardTitle)}>{title}</h3>
                <p className={cn("text-sm leading-relaxed", theme.cardText)}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className={cn("py-16 sm:py-24", theme.sectionBg)}>
        <div className="container max-w-4xl">
          <div className={cn("rounded-3xl p-8 text-center md:p-12", theme.ctaBlock)}>
            <h2 className={cn("mb-4 text-3xl font-bold sm:text-4xl", theme.ctaTitle)}>
              Empezá a comunicarte
            </h2>
            <p className={cn("mx-auto mb-8 max-w-2xl text-base", theme.ctaText)}>
              Creá tu cuenta gratuita y comenzá a usar SIVOX desde cualquier dispositivo,
              sin necesidad de instalar nada.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/registro">
                <button className={cn(
                  "h-12 px-10 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300",
                  theme.btnPrimary,
                )}>
                  Crear cuenta gratis
                </button>
              </Link>
              <Link to="/login">
                <button className={cn(
                  "h-12 px-10 rounded-full text-sm font-black uppercase tracking-widest active:scale-95 transition-all",
                  theme.btnOutline,
                )}>
                  Iniciar sesión
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animación flotante del ícono hero */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%        { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
