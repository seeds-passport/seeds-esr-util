import { SigningRequest } from "eosio-signing-request";
import { Api, JsonRpc } from "eosjs";
import util from "util";
import zlib from "zlib";

import { DEFAULT_RPC_ENDPOINT } from "./config";

const textEncoder = new util.TextEncoder();
const textDecoder = new util.TextDecoder();

const getOpts = async (api) => {
  return {
    textEncoder,
    textDecoder,
    zlib: {
      deflateRaw: (data) =>
        new Uint8Array(zlib.deflateRawSync(Buffer.from(data))),
      inflateRaw: (data) =>
        new Uint8Array(zlib.inflateRawSync(Buffer.from(data))),
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
  }

  decodeESR = async (esr) => {
    const { api } = this;
    const opts = await this.getOpts(api);
    try {
      const signingRequest = await SigningRequest.from(esr, opts);
      return signingRequest;
    } catch (e) {
      console.log("ERROR");
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

export default ESRUtil;
