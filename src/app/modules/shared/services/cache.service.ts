export class CacheService<RequestType, ResponseType> {
    private cacheMap: Map<string, ResponseType>;
    private expireDate: Date;
    private expiresInMinutes: number;

    constructor(expiresInMinutes?: number) {
        this.cacheMap = new Map<string, ResponseType>();
        this.expiresInMinutes = expiresInMinutes ? expiresInMinutes : 10;
    }

    private getCacheKey(request: RequestType) {
        return btoa(JSON.stringify(request));
    }

    private resetExpireDate() {
        this.expireDate = new Date();
        this.expireDate.setMinutes(
            this.expireDate.getMinutes() + this.expiresInMinutes
        );
    }

    public getFromCache(request: RequestType): ResponseType {
        if (new Date() < this.expireDate) {
            const cacheKey = this.getCacheKey(request);
            return this.cacheMap.get(cacheKey);
        }
    }

    public saveToCache(request: RequestType, response: ResponseType) {
        const cacheKey = this.getCacheKey(request);
        this.cacheMap.set(cacheKey, response);
        this.resetExpireDate();
    }
}
