import { lint, push } from "https://pkg.fluentci.io/buf_pipeline@v0.5.1/mod.ts";

await lint();
await push();
