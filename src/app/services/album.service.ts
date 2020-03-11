import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, from } from 'rxjs';
import { map, tap, reduce } from 'rxjs/operators';
import { AlbumModel } from '../models/album.model';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    private bucketName = 'tonomony-images';
    private bucket: S3;

    constructor() {
        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'eu-central-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-central-1:9b02f2ec-86ff-4ea1-b697-fab841a603b0'
        });

        // Create a new service object
        this.bucket = new S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.bucketName }
        });
    }

    public listAlbumTitles(): Observable<AlbumModel[]> {
        const params = { Delimiter: '/' } as S3.ListObjectsRequest;
        const promise = this.bucket.listObjects(params).promise();

        return from(promise).pipe(
            map(objects => objects.CommonPrefixes.map(c => this.initAlbum(c))),
            tap(response => console.log(response))
        );
    }

    // public listPhotos(albumName: string) {
    //     const params = { Prefix: albumName + '/_' } as S3.ListObjectsRequest;
    //     const promise = this.bucket.listObjects(params).promise();

    //     const result = from(promise).pipe();

    //     this.bucket.listObjects();
    // }

    private initAlbum(commonPrefix: S3.CommonPrefix) {
        if (commonPrefix) {
            return {
                title: decodeURIComponent(commonPrefix.Prefix.replace('/', '')),
                titleImageKey: ''
            } as AlbumModel;
        }
    }
}
