import { mockProviders } from "../mock-data";
import type { Provider } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapProvider } from "../api/mappers";

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
