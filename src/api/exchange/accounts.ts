import { randomUUID } from "node:crypto";
import type { AxiosInstance } from "axios";
import { buildAuthHeaders } from "../../auth";
import { ACCOUNTS_PATH } from "../../config/constants";
import { toUpbitError } from "../../errors";
import { normalizeAccount, type UpbitRawAccount } from "../../normalizers";
import type { UpbitAccount, UpbitCredentials } from "../../types";

export const fetchAccounts = async (
  http: AxiosInstance,
  credentials: UpbitCredentials,
): Promise<UpbitAccount[]> => {
  const payload = {
    access_key: credentials.accessKey,
    nonce: randomUUID(),
  };

  try {
    const response = await http.get<UpbitRawAccount[]>(ACCOUNTS_PATH, {
      headers: buildAuthHeaders(payload, credentials),
    });
    return response.data.map(normalizeAccount);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit accounts.");
  }
};
