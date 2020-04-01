import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';
import { Album, ListAlbumsRequest } from '../models/album.model';
import { CacheService } from '../../shared/services/cache.service';
import { S3Service } from '../../aws/services/s3.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    constructor(private s3Service: S3Service) {}

    public listAlbums(request: ListAlbumsRequest): Observable<Array<Album>> {
        const bucket = this.s3Service.initBucket(request.s3BucketName);
        const params = { Delimiter: '/' } as S3.ListObjectsRequest;
        const promise = bucket.listObjects(params).promise();

        return from(promise).pipe(
            map(output => output.CommonPrefixes.map(c => this.initAlbum(c))),
            tap(response => console.log(response)),
            share()
        );
    }

    private initAlbum(commonPrefix: S3.CommonPrefix) {
        if (commonPrefix) {
            return {
                title: decodeURIComponent(commonPrefix.Prefix.replace('/', '')),
                titleImage: null
            } as Album;
        }
    }
}
