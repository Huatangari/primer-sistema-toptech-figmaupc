import { mockProviders } from "../mock-data";
import type { Provider } from "../types";

export async function getProviders(): Promise<Provider[]> {
  return mockProviders;
}

export async function getProviderById(id: string): Promise<Provider | undefined> {
  return mockProviders.find((p) => p.id === id);
}
