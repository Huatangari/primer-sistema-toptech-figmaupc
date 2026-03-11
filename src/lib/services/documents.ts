import { mockDocuments } from "../mock-data";
import type { Document } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapDocument } from "../api/mappers";

export async function getDocuments(): Promise<Document[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockDocuments;
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDocument);
}

export async function getDocumentById(id: string): Promise<Document | undefined> {
  if (!IS_SUPABASE_CONFIGURED) return mockDocuments.find((d) => d.id === id);
  const { data, error } = await supabase.from("documents").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapDocument(data);
}

export async function getDocumentsByAssetId(assetId: string): Promise<Document[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockDocuments.filter((d) => d.assetId === assetId);
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("asset_id", assetId)
    .order("uploaded_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDocument);
}

export async function getDocumentsByProviderId(providerId: string): Promise<Document[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockDocuments.filter((d) => d.providerId === providerId);
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("provider_id", providerId)
    .order("uploaded_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDocument);
}
