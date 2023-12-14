export function readEnv(): void {
    let entries = {} as Record<string, string>;
    let env;
    if (typeof process.env.ENV_TXT !== "undefined") {
        env = process.env.ENV_TXT.split(/\r\n|\n/) as string[];
        for (let i = 0; i < env.length; i++) {
            // skip new lines that don't yield a row of text
            if (env[i] === "") {
                continue;
            }
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
