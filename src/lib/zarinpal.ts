// Zarinpal payment gateway integration
// Docs: https://docs.zarinpal.com/paymentGateway/

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
const SANDBOX = process.env.NODE_ENV !== "production";

const BASE_URL = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://api.zarinpal.com/pg/v4/payment";

const GATEWAY = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://www.zarinpal.com/pg/StartPay";

export interface ZarinpalRequestResult {
  authority: string;
  gatewayUrl: string;
}

export interface ZarinpalVerifyResult {
  refId: string;
  cardHash?: string;
  cardPan?: string;
}

/** Step 1 — Create a payment request, get redirect URL */
export async function zarinpalRequest(opts: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
  email?: string;
}): Promise<ZarinpalRequestResult> {
  const res = await fetch(`${BASE_URL}/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: opts.amountToman * 10,   // Zarinpal uses Rials
      description: opts.description,
      callback_url: opts.callbackUrl,
      metadata: {
        mobile: opts.mobile,
        email: opts.email,
      },
    }),
  });

  const data = await res.json();
  if (data.data?.code !== 100) {
    throw new Error(data.errors?.message || "Zarinpal request failed");
  }

  return {
    authority: data.data.authority,
    gatewayUrl: `${GATEWAY}/${data.data.authority}`,
  };
}

/** Step 2 — Verify payment after redirect back */
export async function zarinpalVerify(opts: {
  authority: string;
  amountToman: number;
}): Promise<ZarinpalVerifyResult> {
  const res = await fetch(`${BASE_URL}/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: opts.amountToman * 10,
      authority: opts.authority,
    }),
  });

  const data = await res.json();
  // 100 = success, 101 = already verified (idempotent)
  if (data.data?.code !== 100 && data.data?.code !== 101) {
    throw new Error(data.errors?.message || "Zarinpal verify failed");
  }

  return {
    refId: String(data.data.ref_id),
    cardHash: data.data.card_hash,
    cardPan: data.data.card_pan,
  };
}
