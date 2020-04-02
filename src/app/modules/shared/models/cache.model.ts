import { bool } from 'aws-sdk/clients/signer';

export interface CacheObject {
    data: any;
    expireDate?: Date;
}

export interface CacheSettings {
    enabled: bool;
    expiresInSeconds: number;
    storageType: CacheStorageType;
}

export interface ICacheStorage {
    save(cacheKey: string, cacheObject: CacheObject);
    load<TData>(cacheKey: string): TData;
}

export enum CacheStorageType {
    IN_MEMORY,
    LOCAL_STORAGE
}
