import { apiCreated, apiError, apiOk } from "@/lib/api-response";
import { createCollaborator, deleteCollaborator, listCollaborators, updateCollaboratorPassword } from "@/lib/collaborator-service";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return apiError("Unauthorized", 401);
  }

  try {
    const collaborators = await listCollaborators();
    return apiOk({ collaborators });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Erro ao listar colaboradores.", 500);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { name, email, password } = await request.json();

    if (!name || !email) {
      return apiError("Nome e email sao obrigatorios.", 422);
    }

    const created = await createCollaborator(name, email, password);
    return apiCreated({ collaborator: created });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Erro ao criar colaborador.", 500);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id, password } = await request.json();
    if (!id || !password) return apiError("ID e senha obrigatorios.", 422);

    await updateCollaboratorPassword(id, password);
    return apiOk({ success: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Erro ao atualizar senha.", 500);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await request.json();
    if (!id) return apiError("ID obrigatorio.", 422);

    await deleteCollaborator(id);
    return apiOk({ success: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Erro ao excluir colaborador.", 500);
  }
}
