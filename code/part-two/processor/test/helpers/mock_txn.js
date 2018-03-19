'use strict';

const { TransactionHeader } = require('sawtooth-sdk/protobuf');
const secp256k1 = require('sawtooth-sdk/signing/secp256k1');
const context = new secp256k1.Secp256k1Context();
const utils = require('./utils');

const getRandomString = () => (Math.random() * 10 ** 18).toString(36);

// A mock Transaction Process Request or "txn"
class Txn {
  constructor(payload) {
    const privateKey = context.newRandomPrivateKey();
    const publicKey = context.getPublicKey(privateKey).asHex();

    this.contextId = getRandomString();
    this.payload = utils.encode(payload);
    this.header = TransactionHeader.create({
      signerPublicKey: publicKey,
      batcherPublicKey: publicKey,
      familyName: utils.FAMILY_NAME,
      familyVersion: utils.FAMILY_VERSION,
      nonce: getRandomString(),
      inputs: [ utils.NAMESPACE ],
      outputs: [ utils.NAMESPACE ],
      payloadSha512: utils.hash(this.payload)
    });
    const encodedHeader = TransactionHeader.encode(this.header).finish();
    this.signature = context.sign(encodedHeader, privateKey);
  }
}

module.exports = Txn;
