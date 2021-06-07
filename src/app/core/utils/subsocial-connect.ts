import {ApiPromise, WsProvider} from '@polkadot/api';
import {SubsocialApi} from '@subsocial/api';
import rpc from '@polkadot/types/interfaces/jsonrpc';
import {registryTypes as types} from '@subsocial/types';
import {environment} from '../../../environments/environment';

let subsocial!: SubsocialApi;
let isLoadingSubsocial = false;

export const newSubsocialApi = (substrateApi: ApiPromise) => {
  const useServer = environment.ipfs.useOffChain ? {
    httpRequestMethod: environment.dag.httpMethod as any
  } : undefined;

  return new SubsocialApi({
    substrateApi: substrateApi,
    ipfsNodeUrl: environment.ipfs.url,
    offchainUrl: environment.offChain.url,
    useServer
  });
};

type Config = {
  endpoint: string | string[],
  metadata?: Record<string, string>
}

let api: ApiPromise;

export const getSubstrateApi = ({endpoint, metadata}: Config) => {
  if (!api && !isLoadingSubsocial) {
    isLoadingSubsocial = true;
    const provider = new WsProvider(endpoint);
    api = new ApiPromise({provider, types, rpc: {...rpc}, metadata});
    isLoadingSubsocial = false;
  }

  return api;
};

export const getSubsocialApi = async () => {
  if (!subsocial && !isLoadingSubsocial) {
    const api = getSubstrateApi({endpoint: environment.substrate.url});
    subsocial = newSubsocialApi(api);
  }

  return subsocial;
};

