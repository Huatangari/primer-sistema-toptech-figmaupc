import { mockProviders } from "../mock-data";
import type { AssetCategory, Provider, ProviderStatus } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapProvider } from "../api/mappers";
import { getActiveBuildingId } from "./building";

export interface CreateProviderInput {
  name: string;
  rubro: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status?: ProviderStatus;
  contractType?: string;
  categories?: AssetCategory[];
}

export async function getProviders(): Promise<Provider[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockProviders;
  // Join con provider_categories para obtener las categorías en una sola query
  const { data, error } = await supabase
    .from("providers")
    .select("*, provider_categories(category)")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProvider);
}

export async function getProviderById(id: string): Promise<Provider | undefined> {
  if (!IS_SUPABASE_CONFIGURED) return mockProviders.find((p) => p.id === id);
  const { data, error } = await supabase
    .from("providers")
    .select("*, provider_categories(category)")
    .eq("id", id)
    .single();
  if (error || !data) return undefined;
  return mapProvider(data);
}

export async function createProvider(input: CreateProviderInput): Promise<Provider> {
  const now = new Date().toISOString();

  if (!IS_SUPABASE_CONFIGURED) {
    const provider: Provider = {
      id: `prov-${Date.now()}`,
      name: input.name,
      rubro: input.rubro,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      status: input.status ?? "Activo",
      lastService: "",
      rating: 0,
      contractType: input.contractType,
      categories: input.categories ?? [],
    };
    mockProviders.unshift(provider);
    return provider;
  }

  const buildingId = await getActiveBuildingId();

  const { data: providerRow, error: providerErr } = await supabase
    .from("providers")
    .insert({
      building_id: buildingId,
      name: input.name,
      rubro: input.rubro,
      contact_name: input.contactName,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      status: input.status ?? "Activo",
      contract_type: input.contractType || null,
      updated_at: now,
    })
    .select("*")
    .single();

  if (providerErr || !providerRow) throw new Error(providerErr?.message ?? "No se pudo crear el proveedor");

  const categories = input.categories ?? [];
  if (categories.length > 0) {
    const rows = categories.map((category) => ({ provider_id: providerRow.id, category }));
    const { error: catErr } = await supabase.from("provider_categories").insert(rows);
    if (catErr) throw new Error(catErr.message);
  }

  return {
    id: providerRow.id,
    name: providerRow.name,
    rubro: providerRow.rubro,
    contactName: providerRow.contact_name,
    contactEmail: providerRow.contact_email,
    contactPhone: providerRow.contact_phone,
    status: providerRow.status,
    lastService: providerRow.last_service ?? "",
    rating: providerRow.rating ?? 0,
    contractType: providerRow.contract_type ?? undefined,
    categories,
  };
}
