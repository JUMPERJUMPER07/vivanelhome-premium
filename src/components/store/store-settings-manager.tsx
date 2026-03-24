"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Instagram, Music2, Save } from "lucide-react";
import { useStoreSettings } from "./store-settings-provider";

export function StoreSettingsManager() {
  const { settings, updateSettings, isLoading } = useStoreSettings();
  const [form, setForm] = useState(settings);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setIsSubmitting(true);
      await updateSettings(form);
      setSuccessMessage("Links da loja atualizados com sucesso.");
    } catch {
      setErrorMessage("Nao foi possivel salvar os links agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-xl h-fit">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
          Redes Sociais & Contato
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--brand-text)]">
          Configurações da Conta
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)]">
          Atualize os canais de comunicação oficial da sua vitrine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-4">
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">
              <Instagram size={14} className="text-pink-500" />
              Perfil Instagram
            </span>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, instagramUrl: event.target.value }))
              }
              disabled={isLoading}
              placeholder="https://instagram.com/seu.perfil"
              className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
            />
          </label>

          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">
              <Music2 size={14} className="text-cyan-400" />
              Perfil TikTok
            </span>
            <input
              type="url"
              value={form.tiktokUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, tiktokUrl: event.target.value }))
              }
              disabled={isLoading}
              placeholder="https://tiktok.com/@seu.perfil"
              className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
            />
          </label>

        </div>

        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[#7c3aed] text-sm font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          <Save size={16} className="relative z-10" />
          <span className="relative z-10">{isSubmitting ? "Salvando..." : "Atualizar Configurações"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>

        {successMessage ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-400">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-bold text-red-400">
            {errorMessage}
          </div>
        ) : null}
      </form>
    </section>
  );
}
