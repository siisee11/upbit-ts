export type UpbitClientOptions = {
  baseURL?: string;
  accessKey?: string;
  secretKey?: string;
};

export type UpbitCredentials = Required<
  Pick<UpbitClientOptions, "accessKey" | "secretKey">
>;
