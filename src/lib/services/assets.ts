import { mockAssets, mockAssetHistory } from "../mock-data";
import type { Asset, AssetHistoryEvent } from "../types";

// When connecting to a backend, replace the mock returns with:
// const res = await fetch(`${import.meta.env.VITE_API_URL}/assets`);
// return res.json();

export async function getAssets(): Promise<Asset[]> {
  return mockAssets;
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  return mockAssets.find((a) => a.id === id);
}

export async function getAssetHistory(assetId: string): Promise<AssetHistoryEvent[]> {
  return mockAssetHistory.filter((e) => e.assetId === assetId);
}

export async function getAssetsByProviderId(providerId: string): Promise<Asset[]> {
  return mockAssets.filter((a) => a.providerId === providerId);
}
