import { supabase } from "./supabase";
import { TokenFormData } from "@/types/token";
import { Project, ProjectFormData } from "@/types/project";

// Project functions
export const getProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw error;
  return data;
};

export const getProject = async (id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createProject = async (project: ProjectFormData) => {
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        name: project.name,
        description: project.description,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProject = async (
  id: string,
  project: Partial<ProjectFormData>,
) => {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// Token functions
export const getTokens = async (projectId: string) => {
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("project_id", projectId);
  if (error) throw error;
  return data;
};

export const getToken = async (id: string) => {
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createToken = async (projectId: string, token: TokenFormData) => {
  const { data, error } = await supabase
    .from("tokens")
    .insert([
      {
        project_id: projectId,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        standard: token.standard,
        blocks: token.blocks,
        metadata: token.metadata,
        status: token.status,
        reviewers: token.reviewers || [],
        approvals: token.approvals || [],
        contract_preview: token.contractPreview,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateToken = async (
  id: string,
  token: Partial<TokenFormData>,
) => {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  // Map token fields to database fields
  if (token.name) updateData.name = token.name;
  if (token.symbol) updateData.symbol = token.symbol;
  if (token.decimals !== undefined) updateData.decimals = token.decimals;
  if (token.standard) updateData.standard = token.standard;
  if (token.blocks) updateData.blocks = token.blocks;
  if (token.metadata) updateData.metadata = token.metadata;
  if (token.status) updateData.status = token.status;
  if (token.reviewers) updateData.reviewers = token.reviewers;
  if (token.approvals) updateData.approvals = token.approvals;
  if (token.contractPreview)
    updateData.contract_preview = token.contractPreview;

  const { data, error } = await supabase
    .from("tokens")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteToken = async (id: string) => {
  const { error } = await supabase.from("tokens").delete().eq("id", id);
  if (error) throw error;
  return true;
};
