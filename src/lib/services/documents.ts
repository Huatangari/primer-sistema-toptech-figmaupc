import { mockDocuments } from "../mock-data";
import type { Document } from "../types";

export async function getDocuments(): Promise<Document[]> {
  return mockDocuments;
}

export async function getDocumentById(id: string): Promise<Document | undefined> {
  return mockDocuments.find((d) => d.id === id);
}

export async function getDocumentsByAssetId(assetId: string): Promise<Document[]> {
  return mockDocuments.filter((d) => d.assetId === assetId);
}

export async function getDocumentsByProviderId(providerId: string): Promise<Document[]> {
  return mockDocuments.filter((d) => d.providerId === providerId);
}
