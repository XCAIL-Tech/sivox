import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LANDING_THEMES } from "@/lib/landingThemes";
import { useLandingThemeStore } from "@/store/useLandingThemeStore";

export function Footer() {
  const { themeId } = useLandingThemeStore();
  const theme = LANDING_THEMES[themeId];

  return (
    <footer className={cn("mt-0", theme.footerBg)}>
      <div className="container max-w-6xl pt-6 pb-4">

        {/* Columnas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 pb-10 border-b border-current/10">

          <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
            <span className={cn("font-bold text-xl tracking-wide", theme.footerBrand)}>SIVOX</span>
            <p className={cn("text-xs font-medium tracking-wider", theme.footerText)}>
              Tecnología que comunica
            </p>
            <p className={cn("text-xs max-w-[180px]", theme.footerText)}>
              Comunicador AAC con IA predictiva y barrido universal.
            </p>
          </div>

          <div>
            <h3 className={cn("mb-4 text-[11px] font-bold uppercase tracking-[0.2em]", theme.footerHeading)}>
              Producto
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/registro" className={cn("transition-colors", theme.footerLink)}>
                  Empezar gratis
                </Link>
              </li>
              <li>
                <Link to="/login" className={cn("transition-colors", theme.footerLink)}>
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("mb-4 text-[11px] font-bold uppercase tracking-[0.2em]", theme.footerHeading)}>
              Recursos
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a
                  href="https://xcail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("transition-colors", theme.footerLink)}
                >
                  XCAIL Technologies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={cn("mb-4 text-[11px] font-bold uppercase tracking-[0.2em]", theme.footerHeading)}>
              Legal
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/privacidad" className={cn("transition-colors", theme.footerLink)}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className={cn("transition-colors", theme.footerLink)}>
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className={cn("text-xs font-medium text-center", theme.footerCopy)}>
          © {new Date().getFullYear()}{" "}
          <span className={cn("font-bold", theme.footerBrand)}>SIVOX</span>
          {" "}|{" "}
          <a
            href="https://xcail.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("transition-colors", theme.footerLink)}
          >
            XCAIL Technologies
          </a>
          <span className="block sm:inline sm:ml-1">
            {" "}· Todos los derechos reservados.
          </span>
        </p>
      </div>
    </footer>
  );
}
