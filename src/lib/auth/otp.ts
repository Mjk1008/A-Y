import pool from "../db";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOTP(phone: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min
  await pool.query(
    "INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)",
    [phone, code, expiresAt]
  );
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const res = await pool.query(
    `SELECT id FROM otp_codes
     WHERE phone=$1 AND code=$2 AND used=false AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [phone, code]
  );
  if (res.rows.length === 0) return false;
  await pool.query("UPDATE otp_codes SET used=true WHERE id=$1", [res.rows[0].id]);
  return true;
}

export async function sendOTP(phone: string, code: string): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const template = process.env.KAVENEGAR_TEMPLATE || "verify";

  if (!apiKey || apiKey === "mock") {
    console.log(`[OTP Mock] Phone: ${phone}, Code: ${code}`);
    return;
  }

  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      receptor: phone,
      token: code,
      template,
    }),
  });
  if (!res.ok) throw new Error(`Kavenegar error: ${res.status}`);
}

export async function findOrCreateUser(phone: string) {
  const existing = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
  if (existing.rows.length > 0) return existing.rows[0];
  const res = await pool.query(
    "INSERT INTO users (phone) VALUES ($1) RETURNING *",
    [phone]
  );
  return res.rows[0];
}
