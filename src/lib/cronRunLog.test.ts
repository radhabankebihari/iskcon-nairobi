import { createECDH } from "node:crypto";
import { describe, expect, it } from "vitest";
import { checkPushKeys } from "./cronRunLog";

function keyPair() {
  const ecdh = createECDH("prime256v1");
  ecdh.generateKeys();
  return {
    publicKey: ecdh.getPublicKey().toString("base64url"),
    privateKey: ecdh.getPrivateKey().toString("base64url"),
  };
}

const pair = keyPair();
const good = {
  VAPID_PUBLIC_KEY: pair.publicKey,
  VAPID_PRIVATE_KEY: pair.privateKey,
  VAPID_SUBJECT: "mailto:iskconnairobi@gmail.com",
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: pair.publicKey,
};

describe("checkPushKeys", () => {
  it("accepts a matching key pair and a mailto subject", () => {
    const check = checkPushKeys(good);
    expect(check.ok).toBe(true);
    expect(check.message).toContain("mailto:iskconnairobi@gmail.com");
    expect(check.message).not.toContain(pair.privateKey);
  });

  it("names every missing key", () => {
    expect(checkPushKeys({ ...good, VAPID_PRIVATE_KEY: undefined, VAPID_SUBJECT: "" })).toEqual({
      ok: false,
      message: "Missing: VAPID_PRIVATE_KEY, VAPID_SUBJECT",
    });
  });

  it("catches a private key from a different pair", () => {
    expect(checkPushKeys({ ...good, VAPID_PRIVATE_KEY: keyPair().privateKey }).message).toBe(
      "VAPID_PRIVATE_KEY does not belong to VAPID_PUBLIC_KEY"
    );
  });

  it("catches a server key that differs from the one browsers subscribed with", () => {
    expect(checkPushKeys({ ...good, NEXT_PUBLIC_VAPID_PUBLIC_KEY: keyPair().publicKey }).ok).toBe(false);
  });

  it("rejects a subject that is neither mailto nor https", () => {
    expect(checkPushKeys({ ...good, VAPID_SUBJECT: "iskconnairobi.com" }).ok).toBe(false);
    expect(checkPushKeys({ ...good, VAPID_SUBJECT: "https://iskconnairobi.com" }).ok).toBe(true);
  });
});
