import type { Config } from "@jest/types";
export async function MyConfig(): Promise<Config.InitialOptions> {
  return {
    verbose: true,
  };
}