export function readEnv(): void {
  let entries = {} as Record<string, string>;
  let env;
  if (typeof process.env.ENV_TXT !== "undefined") {
    env = process.env.ENV_TXT.split("\n") as string[];
    for (let i = 0; i < env.length; i++) {
      const key = env[i].split("=")[0];
      const value = env[i].split("=")[1].replace(/'/g, "").replace(/\r/g, "");
      entries = {
        ...entries,
        [key]: value,
      };
    }
    process.env = {
      ...process.env,
      ...entries,
    };
  }
}
