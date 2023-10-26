import { lint, push } from "https://pkg.fluentci.io/buf_pipeline@v0.3.1/mod.ts";

await lint();
await push();
