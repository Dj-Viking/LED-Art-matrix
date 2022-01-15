export function readEnv(): void {
  let entries = {} as Record<string, string>;
  let env;
  if (typeof process.env.ENV_TXT !== "undefined") {
    env = process.env.ENV_TXT.split("\n") as string[];
    for (let i = 0; i < env.length; i++) {
      entries = {
        ...entries,
        [env[i].split("=")[0]]: env[i].split("=")[1].replace(/'/g, ""),
      };
    }
    process.env = {
      ...process.env,
      ...entries,
    };
  }
}
