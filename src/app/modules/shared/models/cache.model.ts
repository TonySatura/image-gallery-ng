import { bool } from 'aws-sdk/clients/signer';

export interface CacheObject {
    data: any;
    expireDate?: Date;
}

export interface CacheSettings {
    enabled: bool;
    expiresInSeconds: number;
    // TODO: implement storage type (alternativly cache in local storage)
}
