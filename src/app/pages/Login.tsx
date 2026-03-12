import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Github } from "lucide-react";
import { login, supabase, IS_SUPABASE_CONFIGURED } from "../../lib/auth/authClient";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@torresdelparque.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<"password" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authUnavailable = !IS_SUPABASE_CONFIGURED;
  const isPasswordLoading = loadingProvider === "password";
  const isGitHubLoading = loadingProvider === "github";

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return;

    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session) navigate("/", { replace: true });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) navigate("/", { replace: true });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider("password");
    setError(null);

    if (authUnavailable) {
      setError("Supabase no esta configurado. Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      setLoadingProvider(null);
      return;
    }

    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion");
      setLoadingProvider(null);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    setLoadingProvider("github");

    if (authUnavailable) {
      setError("Supabase no esta configurado. Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      setLoadingProvider(null);
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">BuildTrack</p>
              <p className="text-blue-300 text-xs">Gestion Tecnica de Edificios</p>
            </div>
          </div>

          <h2 className="text-white mb-4 text-[32px] font-bold leading-tight">
            Control total
            <br />
            de tu edificio
          </h2>
          <p className="text-slate-400 text-[15px] leading-[1.7]">
            Centraliza activos, incidencias, documentos y proveedores en una sola plataforma disenada para la gestion tecnica profesional.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative space-y-3">
          {[
            "Registro y trazabilidad de activos",
            "Gestion de incidencias en tiempo real",
            "Repositorio documental centralizado",
            "Dashboard ejecutivo con KPIs",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <p className="text-slate-300 text-sm">{feat}</p>
            </div>
          ))}
        </div>

        <p className="relative text-slate-600 text-xs">(c) 2026 BuildTrack - Version Demo</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <p className="text-white font-bold text-xl">BuildTrack</p>
          </div>

          <div className="mb-8">
            <h1 className="text-white mb-1 text-[26px] font-bold">Iniciar sesion</h1>
            <p className="text-slate-400 text-sm">Accede a tu panel de gestion tecnica</p>
          </div>

          {/* Error / info */}
          {error ? (
            <div className="mb-6 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          ) : (
            <div className="mb-6 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-xs font-medium">
                {authUnavailable ? "Configuracion requerida para autenticar" : "Ingresa con tus credenciales"}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-1.5">
                Correo electronico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  placeholder="correo@edificio.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingProvider !== null || authUnavailable}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2"
            >
              {isPasswordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar al sistema
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-500">o</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={loadingProvider !== null || authUnavailable}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-70 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {isGitHubLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirigiendo...
                </>
              ) : (
                <>
                  <Github size={16} />
                  Continuar con GitHub
                </>
              )}
            </button>
          </form>

          <p className="text-slate-600 text-xs text-center mt-8">
            Esta es una demo para presentacion comercial.
            <br />
            No almacena datos reales.
          </p>
        </div>
      </div>
    </div>
  );
}
