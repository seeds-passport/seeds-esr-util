import { ChainId, SigningRequest } from "eosio-signing-request";
import { Api, JsonRpc } from "eosjs";
import pako from "pako";
import util from "util";

if (!window || !window.TextEncoder) {
  window.TextEncoder = util.TextEncoder;
  window.TextDecoder = util.TextDecoder;
}

import { DEFAULT_RPC_ENDPOINT } from "./config/index.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const getOpts = async (api) => {
  return {
    textEncoder,
    textDecoder,
    zlib: {
      deflateRaw: (data) => new Uint8Array(pako.deflateRaw(Buffer.from(data))),
      inflateRaw: (data) => new Uint8Array(pako.inflateRaw(Buffer.from(data))),
    },
    abiProvider: {
      getAbi: async (account) => {
        return await api.getAbi(account);
      },
    },
  };
};

class ESRUtil {
  constructor(rpcEndpoint, fetch) {
    const rpc = new JsonRpc(rpcEndpoint || DEFAULT_RPC_ENDPOINT, { fetch });
    const api = new Api({
      rpc,
      textDecoder,
      textEncoder,
    });

    this.rpc = rpc;
    this.api = api;
    this.getOpts = getOpts.bind(this);
    this.encodeESR = this.encodeESR.bind(this);
    this.decodeESR = this.decodeESR.bind(this);
  }

  decodeESR = async (esr) => {
    const { api } = this;
    const opts = await this.getOpts(api);
    try {
      const signingRequest = await SigningRequest.from(esr, opts);
      return signingRequest;
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }
  };

  encodeESR = async (actions) => {
    const { rpc, api } = this;
    const opts = await this.getOpts(api);
    const info = await rpc.get_info();
    const chainId = info.chain_id;
    const request = await SigningRequest.create({ actions, chainId }, opts);
    const esr = request.encode();
    return esr;
  };
}

export { ESRUtil };
