interface ResponseCacheOptions {
  expirationMs?: number;
}

export class ResponseCache {
  private readonly cache = new Map<string, Response>();

  constructor(private readonly options: ResponseCacheOptions = {}) {}

  get(key: string): Response | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: Response): void {
    this.cache.set(key, value);

    if (this.options.expirationMs) {
      setTimeout(() => {
        this.cache.delete(key);
      }, this.options.expirationMs);
    }
  }
}
