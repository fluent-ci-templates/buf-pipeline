import { Directory, Secret, dag, exit } from "../../deps.ts";
import { getBufToken, getDirectory } from "./lib.ts";

export enum Job {
  lint = "lint",
  push = "push",
  format = "format",
}

export const exclude = [];

/**
 * Push your Protobuf files to the Buf Registry
 *
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
  const context = await getDirectory(src);
  const secret = await getBufToken(token);

  if (!secret) {
    console.error("No BUF_TOKEN secret found");
    exit(1);
    return "";
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

  return ctr.stdout();
}

/**
 * Format your Protobuf files
 *
 * @function
 * @description Format your Protobuf files
 * @param {Directory | string} src
 * @returns {Promise<Directory | string>}
 */
export async function format(
  src: Directory | string
): Promise<Directory | string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.lint)
    .container()
    .from("bufbuild/buf")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["--version"])
    .withExec(["format", "-w"]);

  await ctr.stdout();
  return ctr.directory("/app").id();
}

/**
 * Lint your Protobuf files
 *
 * @function
 * @description Lint your Protobuf files
 * @param {Directory | string} src
 * @returns {Promise<string>}
 */
export async function lint(src: Directory | string): Promise<string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.lint)
    .container()
    .from("bufbuild/buf")
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withExec(["--version"])
    .withExec(["lint"]);

  return ctr.stdout();
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
