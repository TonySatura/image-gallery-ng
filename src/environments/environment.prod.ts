import { CacheStorageType } from 'src/app/modules/cache/models/cache.model';

export const environment = {
    production: true,
    album: {
        bucketName: 'image-gallery-images-bucket43879c71-144tb5q75m5ai',
        imageHandlerEndpoint: 'https://d3j7rohb8t3esh.cloudfront.net'
    },
    aws: {
        region: 'eu-central-1',
        identityPoolId: 'eu-central-1:0b698247-b5cd-4975-a9cc-6db279d41a9a'
    },
    cache: {
        enabled: true,
        expiresInSeconds: 10 * 60, // 10 minutes
        storageType: CacheStorageType.LOCAL_STORAGE
    }
};
