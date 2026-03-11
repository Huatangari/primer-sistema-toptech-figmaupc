import { mockAssets, mockAssetHistory } from "../mock-data";
import type { Asset, AssetHistoryEvent } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapAsset, mapAssetHistoryEvent } from "../api/mappers";

export async function getAssets(): Promise<Asset[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets;
  const { data, error } = await supabase.from("assets").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAsset);
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets.find((a) => a.id === id);
  const { data, error } = await supabase.from("assets").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapAsset(data);
}

export async function getAssetHistory(assetId: string): Promise<AssetHistoryEvent[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssetHistory.filter((e) => e.assetId === assetId);
  const { data, error } = await supabase
    .from("asset_history")
    .select("*")
    .eq("asset_id", assetId)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAssetHistoryEvent);
}

export async function getAssetsByProviderId(providerId: string): Promise<Asset[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets.filter((a) => a.providerId === providerId);
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("provider_id", providerId)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAsset);
}
