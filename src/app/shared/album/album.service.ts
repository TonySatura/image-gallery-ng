import { Injectable, Optional } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';

import { Album, ListAlbumsRequest } from './album.model';
import { S3Service } from '../aws/s3.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    constructor(private s3Service: S3Service) {}

    public listAlbums(request: ListAlbumsRequest): Observable<Album[]> {
        const bucket = this.s3Service.initBucket(request.s3BucketName);

        const params = { Delimiter: '/' } as S3.ListObjectsRequest;
        const promise = bucket.listObjects(params).promise();

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
            } as Album;
        }
    }
}
