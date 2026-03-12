import { mockDocuments } from "../mock-data";
import type { Document } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapDocument } from "../api/mappers";
import { uploadDocument } from "../api/endpoints";
import { getActiveBuildingId } from "./building";

export interface CreateDocumentInput {
  name: string;
  type: Document["type"];
  description?: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
  assetId?: string;
  providerId?: string;
  tags?: string[];
  expiresAt?: string;
}

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

export async function createDocument(input: CreateDocumentInput): Promise<Document> {
  if (!IS_SUPABASE_CONFIGURED) {
    const now = new Date().toISOString();
    const document: Document = {
      id: `doc-${Date.now()}`,
      name: input.name,
      type: input.type,
      description: input.description ?? "",
      fileSize: input.fileSize,
      fileType: input.fileType,
      fileUrl: input.fileUrl,
      assetId: input.assetId,
      providerId: input.providerId,
      tags: input.tags ?? [],
      uploadedBy: "Sistema demo",
      uploadedAt: now,
      expiresAt: input.expiresAt,
    };
    mockDocuments.unshift(document);
    return document;
  }

  const buildingId = await getActiveBuildingId();
  return uploadDocument({
    building_id: buildingId,
    name: input.name,
    type: input.type,
    description: input.description ?? "",
    file_size: input.fileSize,
    file_type: input.fileType,
    file_url: input.fileUrl,
    asset_id: input.assetId,
    provider_id: input.providerId,
    tags: input.tags ?? [],
    expires_at: input.expiresAt,
  });
}
