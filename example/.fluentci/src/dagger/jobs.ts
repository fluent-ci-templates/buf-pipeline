import { Directory, Secret, dag } from "../../deps.ts";
import { getBufToken, getDirectory } from "./lib.ts";

export enum Job {
  lint = "lint",
  push = "push",
  format = "format",
}

export const exclude = [];

/**
 * @function
 * @description Push your Protobuf files to the Buf Registry
 * @param {Directory | string} src
 * @param {Secret | string} token
 * @returns {Promise<string>}
 */
export async function push(
  src: Directory | string,
  token: Secret | string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const secret = await getBufToken(dag, token);

  if (!secret) {
    console.error("No BUF_TOKEN secret found");
    Deno.exit(1);
  }

  const ctr = dag
    .pipeline(Job.push)
    .container()
    .from("bufbuild/buf")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withSecretVariable("BUF_TOKEN", secret)
    .withExec(["--version"])
    .withExec(["push"]);

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Format your Protobuf files
 * @param {Directory | string} src
 * @returns {Promise<Directory | string>}
 */
export async function format(
  src: Directory | string
): Promise<Directory | string> {
  const context = await getDirectory(dag, src);
  const ctr = dag
    .pipeline(Job.lint)
    .container()
    .from("bufbuild/buf")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["--version"])
    .withExec(["format", "-w"]);

  await ctr.stdout();
  const id = await ctr.directory("/app").id();
  return id;
}

/**
 * @function
 * @description Lint your Protobuf files
 * @param {Directory | string} src
 * @returns {Promise<string>}
 */
export async function lint(src: Directory | string): Promise<string> {
  const context = await getDirectory(dag, src);
  const ctr = dag
    .pipeline(Job.lint)
    .container()
    .from("bufbuild/buf")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["--version"])
    .withExec(["lint"]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec =
  | ((src: Directory | string, token: Secret | string) => Promise<string>)
  | ((src: Directory | string) => Promise<string>)
  | ((src: Directory | string) => Promise<Directory | string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.lint]: lint,
  [Job.push]: push,
  [Job.format]: format,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.lint]: "Lint your Protobuf files",
  [Job.format]: "Format your Protobuf files",
  [Job.push]: "Push your Protobuf files to the Buf Registry",
};
