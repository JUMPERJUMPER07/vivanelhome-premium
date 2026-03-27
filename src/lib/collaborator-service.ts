import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { isSupabaseConfigured } from "@/lib/env";
import { createPasswordHash } from "@/lib/password-hash";

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

type CollaboratorRow = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  password_hash?: string;
};

export async function listCollaborators(): Promise<Collaborator[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("collaborators")
    .select("id, name, email, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao listar colaboradores: ${error.message}`);
  }

  return (data as CollaboratorRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}

export async function createCollaborator(
  name: string,
  email: string,
  password?: string,
): Promise<Collaborator> {
  if (!isSupabaseConfigured()) throw new Error("Supabase nao configurado.");

  const initialPassword = password || `vivanel${Math.random().toString(36).slice(-6)}`;
  const hash = createPasswordHash(initialPassword);

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("collaborators")
    .insert({
      name,
      email,
      password_hash: hash,
    })
    .select("id, name, email, is_active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Este email já está cadastrado.");
    }
    throw new Error(`Erro ao criar colaborador: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function deleteCollaborator(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase nao configurado.");

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("collaborators").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir colaborador: ${error.message}`);
  }
}

export async function updateCollaboratorPassword(id: string, password: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase nao configurado.");

  const hash = createPasswordHash(password);
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("collaborators")
    .update({ password_hash: hash })
    .eq("id", id);

  if (error) {
    throw new Error(`Erro ao atualizar senha: ${error.message}`);
  }
}

export async function findCollaboratorByEmail(email: string): Promise<CollaboratorRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("collaborators")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Erro ao buscar colaborador: ${error.message}`);
  }

  return data as CollaboratorRow;
}
