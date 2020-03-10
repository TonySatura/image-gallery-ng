import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, from } from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    private albumBucketName = 'tonomony-images';
    private albumBucket: S3;

    constructor() {
        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'eu-central-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:9b02f2ec-86ff-4ea1-b697-fab841a603b0'
        });

        // Create a new service object
        this.albumBucket = new S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.albumBucketName }
        });
    }

    // A utility function to create HTML.
    private getHtml(template) {
        return template.join('\n');
    }

    // List the photo albums that exist in the bucket.
    public listAlbums(): Observable<string[]> {
        const params = { Delimiter: '/' } as S3.ListObjectsRequest;

        const promise = this.albumBucket.listObjects(params).promise();

        return from(promise).pipe(
            map(listObjects =>
                listObjects.CommonPrefixes.map(commonPrefixes =>
                    decodeURIComponent(commonPrefixes.Prefix.replace('/', ''))
                )
            )
        );
    }
}
