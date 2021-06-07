// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  substrate: {
    lastReservedSpaceId: 1000,
    claimedSpaceIds: [1, 2, 3, 4, 5],
    url: 'wss://rpc.subsocial.network',
  },
  offChain: {
    url: 'https://app.subsocial.network/offchain-2'
  },
  ipfs: {
    url: 'https://ipfs.io',
    useOffChain: false
  },
  dag: {
    httpMethod: 'GET'
  },
  elasticSearch: {
    url: 'https://app.subsocial.network/elastic'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
