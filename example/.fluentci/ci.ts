import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import { lint, push } from "https://pkg.fluentci.io/buf_pipeline@v0.2.2/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await lint(client, src);
    await push(client, src);
  });
}

pipeline();
