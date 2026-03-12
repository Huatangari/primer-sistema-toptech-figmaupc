import { mockAssets, mockAssetHistory } from "../mock-data";
import type { Asset, AssetCategory, AssetHistoryEvent, AssetStatus } from "../types";
import { IS_SUPABASE_CONFIGURED, supabase } from "../auth/authClient";
import { mapAsset, mapAssetHistoryEvent } from "../api/mappers";
import { getActiveBuildingId } from "./building";

export interface CreateAssetInput {
  name: string;
  category: AssetCategory;
  location: string;
  status?: AssetStatus;
  description?: string;
  observations?: string;
  providerId?: string;
  installationDate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
}

const CATEGORY_PREFIX: Record<AssetCategory, string> = {
  Ascensores: "ASC",
  Extintores: "EXT",
  CCTV: "CCTV",
  "Sistema Eléctrico": "ELEC",
  "Bombas de Agua": "BOMB",
  "Alarmas CI": "ACI",
  Internet: "NET",
  "Áreas Comunes": "AC",
};

function buildAssetCode(category: AssetCategory, count: number) {
  return `${CATEGORY_PREFIX[category]}-${String(count + 1).padStart(3, "0")}`;
}

export async function getAssets(): Promise<Asset[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets;
  const { data, error } = await supabase.from("assets").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAsset);
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets.find((asset) => asset.id === id);
  const { data, error } = await supabase.from("assets").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapAsset(data);
}

export async function getAssetHistory(assetId: string): Promise<AssetHistoryEvent[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssetHistory.filter((event) => event.assetId === assetId);
  const { data, error } = await supabase
    .from("asset_history")
    .select("*")
    .eq("asset_id", assetId)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAssetHistoryEvent);
}

export async function getAssetsByProviderId(providerId: string): Promise<Asset[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets.filter((asset) => asset.providerId === providerId);
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("provider_id", providerId)
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAsset);
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const now = new Date().toISOString();

  if (!IS_SUPABASE_CONFIGURED) {
    const sameCategoryCount = mockAssets.filter((asset) => asset.category === input.category).length;
    const asset: Asset = {
      id: `ast-${Date.now()}`,
      code: buildAssetCode(input.category, sameCategoryCount),
      name: input.name,
      category: input.category,
      location: input.location,
      status: input.status ?? "Operativo",
      installationDate: input.installationDate ?? "",
      lastMaintenance: input.lastMaintenance ?? "",
      nextMaintenance: input.nextMaintenance ?? "",
      description: input.description ?? "",
      observations: input.observations ?? "",
      providerId: input.providerId ?? "",
      serialNumber: input.serialNumber,
      brand: input.brand,
      model: input.model,
    };

    mockAssets.unshift(asset);
    return asset;
  }

  const buildingId = await getActiveBuildingId();
  const { count } = await supabase
    .from("assets")
    .select("*", { count: "exact", head: true })
    .eq("building_id", buildingId)
    .eq("category", input.category);

  const { data, error } = await supabase
    .from("assets")
    .insert({
      building_id: buildingId,
      provider_id: input.providerId || null,
      code: buildAssetCode(input.category, count ?? 0),
      name: input.name,
      category: input.category,
      location: input.location,
      status: input.status ?? "Operativo",
      installation_date: input.installationDate || null,
      last_maintenance: input.lastMaintenance || null,
      next_maintenance: input.nextMaintenance || null,
      description: input.description ?? "",
      observations: input.observations ?? "",
      serial_number: input.serialNumber || null,
      brand: input.brand || null,
      model: input.model || null,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear el activo");
  return mapAsset(data);
}
