# Buf Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fbuf_pipeline&query=%24.version)](https://pkg.fluentci.io/buf_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/buf-pipeline)](https://codecov.io/gh/fluent-ci-templates/buf-pipeline)

A ready-to-use CI/CD Pipeline for linting and pushing Protobuf files to the [Buf](https://buf.build/) Registry.

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run buf_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t buf
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Environment variables

| Variable  | Description              |
| --------- | ------------------------ |
| BUF_TOKEN | The Buf Registry token. |

## Jobs

| Job    | Description                                |
| ------ | ------------------------------------------ |
| lint   | Lint your Protobuf files with buf.            |
| push   | Push your Protobuf files to the Buf Registry. |

```graphql
  lint(src: String!): String
  push(src: String!, token: String!): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { lint, push } from "https://pkg.fluentci.io/buf_pipeline@v0.3.1/mod.ts";

await lint();
await push();
```
