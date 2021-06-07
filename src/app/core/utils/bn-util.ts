import * as BN from 'bn.js';

export function stringifyBns(ids: BN[]): string[] {
  return ids.map(id => id?.toString());
}

export function idToBN(id) {
  return new BN(id);
}
