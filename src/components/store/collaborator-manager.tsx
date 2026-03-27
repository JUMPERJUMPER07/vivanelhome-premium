"use client";

import { useEffect, useState } from "react";
import { UserPlus, Users, Trash2, CheckCircle2, AlertCircle, Loader2, Key } from "lucide-react";
import type { Collaborator } from "@/lib/collaborator-service";

export function CollaboratorManager() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function fetchCollaborators() {
    try {
      const response = await fetch("/api/admin/collaborators");
      const data = await response.json();
      if (data.collaborators) {
        setCollaborators(data.collaborators);
      }
    } catch {
      setErrorMessage("Erro ao carregar colaboradores.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCollaborators();
  }, []);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/collaborators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erro ao adicionar.");

      setSuccessMessage(`Colaborador ${form.name} adicionado!`);
      setForm({ name: "", email: "", password: "" });
      fetchCollaborators();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao adicionar colaborador.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este colaborador?")) return;

    try {
      const response = await fetch("/api/admin/collaborators", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Erro ao excluir.");
      fetchCollaborators();
    } catch (error) {
      alert("Nao foi possivel excluir.");
    }
  }

  async function handleResetPassword(id: string, name: string) {
    const newPassword = prompt(`Digite a nova senha para ${name}:`, "");
    if (!newPassword || newPassword.length < 6) {
      if (newPassword) alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch("/api/admin/collaborators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: newPassword }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar senha.");
      alert(`Senha de ${name} atualizada com sucesso!`);
    } catch (error) {
      alert("Erro ao redefinir senha.");
    }
  }

  return (
    <section className="rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 backdrop-blur-md shadow-xl h-fit">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
          Equipe e Acessos
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--brand-text)]">
          Gerenciar Colaboradores
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)]">
          Adicione outros membros da equipe para que possam incluir produtos simultaneamente.
        </p>
      </div>

      <form onSubmit={handleAdd} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Nome</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
              placeholder="Ex: João Silva"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
              placeholder="colaborador@vivanel.com"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]/60 ml-1">Senha (opcional - gera aleatória se vazio)</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)]/50 focus:bg-white/[0.08]"
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[#7c3aed] text-sm font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin relative z-10" size={16} /> : <UserPlus size={16} className="relative z-10" />}
          <span className="relative z-10">Adicionar Colaborador</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>

        {successMessage && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-bold text-red-400 flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}
      </form>

      <div className="mt-8 border-t border-white/5 pt-6">
        <h3 className="text-sm font-bold text-[var(--brand-text)] flex items-center gap-2 uppercase tracking-widest">
          <Users size={16} />
          Colaboradores Ativos
        </h3>

        {isLoading ? (
          <div className="mt-4 flex justify-center py-6">
            <Loader2 className="animate-spin text-[var(--brand-primary)]" />
          </div>
        ) : collaborators.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--brand-muted)] italic">Nenhum colaborador adicional cadastrado.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {collaborators.map((collab) => (
              <li key={collab.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-bold text-[var(--brand-text)]">{collab.name}</p>
                  <p className="text-xs text-[var(--brand-muted)]">{collab.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResetPassword(collab.id, collab.name)}
                    className="p-2 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded-xl transition-colors border border-transparent hover:border-amber-400/20"
                    title="Redefinir senha"
                  >
                    <Key size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(collab.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-xl transition-colors border border-transparent hover:border-red-400/20"
                    title="Remover acesso"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
