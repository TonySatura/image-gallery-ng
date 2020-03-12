import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
    providedIn: 'root'
})
export class S3Service {
    private buckets: Map<string, S3>;

    constructor() {
        this.buckets = new Map<string, S3>();

        // TODO: put region and identity pool id to an config class

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'eu-central-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:9b02f2ec-86ff-4ea1-b697-fab841a603b0'
        });
    }

    public initS3Bucket(s3BucketName: string): S3 {
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
