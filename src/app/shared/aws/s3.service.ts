import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class S3Service {
    private buckets: Map<string, S3>;

    constructor() {
        this.buckets = new Map<string, S3>();

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = environment.aws.region; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.aws.identityPoolId
        });
    }

    public initBucket(s3BucketName: string): S3 {
        let bucket = this.buckets.get(s3BucketName);
        if (!bucket) {
            bucket = new S3({
                apiVersion: '2006-03-01',
                params: { Bucket: s3BucketName }
            });
            this.buckets.set(s3BucketName, bucket);
        }
        return bucket;
    }
}
