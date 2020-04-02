import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap, share, filter, find } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';
import {
    Album,
    ListAlbumsRequest,
    GetAlbumRequest
} from '../models/album.model';
import { CacheService } from '../../shared/services/cache.service';
import { S3Service } from '../../aws/services/s3.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    constructor(
        private s3Service: S3Service,
        private cacheService: CacheService
    ) {}

    public listAlbums(request: ListAlbumsRequest): Observable<Array<Album>> {
        return this.cacheService.getObservable(request, r => {
            const bucket = this.s3Service.initBucket(request.s3BucketName);
            const params = { Delimiter: '/' } as S3.ListObjectsRequest;
            const promise = bucket.listObjects(params).promise();

            return from(promise).pipe(
                map(output =>
                    output.CommonPrefixes.map(c =>
                        this.initAlbum(c, request.s3BucketName)
                    )
                )
            );
        });
    }

    public getAlbum(request: GetAlbumRequest): Observable<Album> {
        const listAlbumsRequest = {
            s3BucketName: request.s3BucketName
        };

        return this.listAlbums(listAlbumsRequest).pipe(
            map(album =>
                album.find(
                    a =>
                        a.s3BucketName === request.s3BucketName &&
                        a.title.toLowerCase() ===
                            request.albumTitle.toLowerCase()
                )
            )
        );
    }

    private initAlbum(commonPrefix: S3.CommonPrefix, s3BucketName: string) {
        if (commonPrefix) {
            return {
                title: decodeURIComponent(commonPrefix.Prefix.replace('/', '')),
                titleImage: null,
                s3BucketName
            } as Album;
        }
    }
}
