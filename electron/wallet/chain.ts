// The hub connection the wallet uses, over plain TCP/TLS sockets from the main process.
import { HubBackend } from "../../extras/lbc/net/hub";
import { nodeLineTransport } from "../../extras/lbc/node/index";
import { getNetwork, type NetworkName } from "../../extras/lbc/networks";

export async function connectHub(network: NetworkName = "mainnet", clientName = "lbry-desktop"): Promise<HubBackend> {
  const params = getNetwork(network);
  const backend = new HubBackend({
    servers: params.defaultHubs,
    transportFactory: (endpoint) => nodeLineTransport(endpoint),
    network: params,
    clientName,
  });
  await backend.start();
  return backend;
}
