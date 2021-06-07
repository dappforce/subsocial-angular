export const environment = {
  production: true,
  substrate: {
    lastReservedSpaceId: 1000,
    claimedSpaceIds: [1, 2, 3, 4, 5],
    url: 'wss://rpc.subsocial.network',
  },
  offChain: {
    url: 'https://app.subsocial.network/offchain-2'
  },
  ipfs: {
    url: 'https://app.subsocial.network/ipfs',
    useOffChain: true
  },
  dag: {
    httpMethod: 'GET'
  },
  elasticSearch: {
    url: 'https://app.subsocial.network/elastic'
  }
};
