import Client from "@dagger.io/dagger";

export enum Job {
  lint = "lint",
  push = "push",
}

export const push = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const BUF_TOKEN = Deno.env.get("BUF_TOKEN");
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
};

export const lint = async (client: Client, src = ".") => {
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
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.lint]: lint,
  [Job.push]: push,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.lint]: "Lint your Protobuf files",
  [Job.push]: "Push your Protobuf files to the Buf Registry",
};
