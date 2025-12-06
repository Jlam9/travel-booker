import * as nodeCrypto from 'crypto';

if (!globalThis.crypto) {
  (globalThis as any).crypto = nodeCrypto;
} else if (!(globalThis.crypto as any).randomUUID && nodeCrypto.randomUUID) {
  (globalThis.crypto as any).randomUUID = nodeCrypto.randomUUID.bind(nodeCrypto);
}