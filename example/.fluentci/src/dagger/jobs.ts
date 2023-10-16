import Client, { connect } from "../../deps.ts";

export enum Job {
  lint = "lint",
  push = "push",
}

export const exclude = [];

export const push = async (src = ".", token?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const BUF_TOKEN = Deno.env.get("BUF_TOKEN") || token;
    if (!BUF_TOKEN) {
      throw new Error("BUF_TOKEN is not set");
    }
    const ctr = client
      .pipeline(Job.push)
      .container()
      .from("bufbuild/buf")
      .withDirectory("/app", context)
      .withWorkdir("/app")
      .withEnvVariable("BUF_TOKEN", BUF_TOKEN)
      .withExec(["--version"])
      .withExec(["push"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "pushed";
};

export const lint = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = client
      .pipeline(Job.lint)
      .container()
      .from("bufbuild/buf")
      .withDirectory("/app", context)
      .withWorkdir("/app")
      .withExec(["--version"])
      .withExec(["lint"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "linted";
};

export type JobExec = (
  src?: string,
  token?: string
) =>
  | Promise<string>
  | ((
      src?: string,
      token?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.lint]: lint,
  [Job.push]: push,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.lint]: "Lint your Protobuf files",
  [Job.push]: "Push your Protobuf files to the Buf Registry",
};
