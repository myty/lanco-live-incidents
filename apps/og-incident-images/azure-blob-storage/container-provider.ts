interface BlobConfiguration {
  AccountKey: string;
  AccountName: string;
  BlobEndpoint: string;
}

export interface BlobContainerProviderOptions {
  container: string;
  blobConfiguration?: BlobConfiguration;
}

export abstract class BlobContainerProvider {
  readonly blobConfiguration: BlobConfiguration;
  readonly container: string;

  constructor(options: BlobContainerProviderOptions) {
    this.container = options.container;
    this.blobConfiguration = options.blobConfiguration ?? {
      AccountKey: Deno.env.get("AccountKey") ?? "",
      AccountName: Deno.env.get("AccountName") ?? "",
      BlobEndpoint: Deno.env.get("BlobEndpoint") ?? "",
    };
  }

  abstract getBlockBlob(name: string): Promise<Response>;

  abstract saveBlockBlob(
    name: string,
    buffer: ArrayBuffer,
    headers?: Record<string, string>,
  ): Promise<Response>;

  abstract deleteIfExists(): Promise<Response | undefined>;

  abstract createIfNotExists(): Promise<Response | undefined>;
}
