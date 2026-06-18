import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/userProfile";
import App from "@/App";
import LandingPage from "@/pages/LandingPage";

function LoadingScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-sivox-500/10 border border-sivox-500/30 flex items-center justify-center">
          <Mic2 className="w-7 h-7 text-sivox-500 animate-pulse" />
        </div>
        <span className="text-sm text-muted-foreground">Cargando SIVOX…</span>
      </div>
    </div>
  );
}

export default function RootPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setProfileChecked(true); return; }

    let cancelled = false;
    getUserProfile(user.uid).then(profile => {
      if (cancelled) return;
      if (!profile || !profile.profile_completed) {
        navigate("/onboarding", { replace: true });
      } else {
        setProfileChecked(true);
      }
    }).catch(() => {
      if (!cancelled) setProfileChecked(true);
    });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  if (authLoading || (user && !profileChecked)) return <LoadingScreen />;
  if (!user) return <LandingPage />;
  return <App />;
}
