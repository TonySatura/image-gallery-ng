import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';
import {
    Album,
    ListAlbumsRequest,
    ListImagesRequest,
    Image,
    ImageHandler,
    ImageHandlerEdits
} from '../models/album.model';
import { environment } from 'src/environments/environment';
import { CacheService } from '../../shared/services/cache.service';
import { S3Service } from '../../shared/services/s3.service';

@Injectable()
export class AlbumService {
    private albumCacheService = new CacheService<
        ListAlbumsRequest,
        Observable<Array<Album>>
    >();

    private imageCacheService = new CacheService<
        ListImagesRequest,
        Observable<Array<Image>>
    >();

    constructor(private s3Service: S3Service) {}

    public listAlbums(request: ListAlbumsRequest): Observable<Array<Album>> {
        let albumsObservable = this.albumCacheService.getFromCache(request);

        if (!albumsObservable) {
            const bucket = this.s3Service.initBucket(request.s3BucketName);
            const params = { Delimiter: '/' } as S3.ListObjectsRequest;
            const promise = bucket.listObjects(params).promise();

            albumsObservable = from(promise).pipe(
                map(output =>
                    output.CommonPrefixes.map(c => this.initAlbum(c))
                ),
                tap(response => console.log(response)),
                share()
            );

            this.albumCacheService.saveToCache(request, albumsObservable);
        }

        return albumsObservable;
    }

    public listImages(request: ListImagesRequest): Observable<Array<Image>> {
        let imagesObservable = this.imageCacheService.getFromCache(request);

        if (!imagesObservable) {
            const bucket = this.s3Service.initBucket(request.s3BucketName);
            // var bucketUrl = this.s3Service.getUrlFromBucket(bucket);

            const params = {
                Prefix: request.albumTitle + '/'
            } as S3.ListObjectsRequest;

            const promise = bucket.listObjects(params).promise();

            imagesObservable = from(promise).pipe(
                map(output =>
                    output.Contents.filter(
                        object => object.Key !== params.Prefix
                    )
                        .map(object => {
                            return this.initImageHandler(
                                request.s3BucketName,
                                object,
                                request.imageEdits
                            );
                        })
                        .map(imageHandler => this.initImage(imageHandler))
                ),
                tap(response => console.log(response)),
                share()
            );

            this.imageCacheService.saveToCache(request, imagesObservable);
        }

        return imagesObservable;
    }

    public generateImageUrl(image: ImageHandler): string {
        const request = image;
        const str = JSON.stringify(request);
        const enc = btoa(str);

        console.log(str);
        console.log(enc);

        return enc;
    }

    private initAlbum(commonPrefix: S3.CommonPrefix) {
        if (commonPrefix) {
            return {
                title: decodeURIComponent(commonPrefix.Prefix.replace('/', '')),
                titleImage: null
            } as Album;
        }
    }

    private initImageHandler(
        bucket: string,
        object: S3.Object,
        edits: ImageHandlerEdits
    ): ImageHandler {
        const imgHandler = {} as ImageHandler;
        imgHandler.bucket = bucket;
        imgHandler.key = object.Key;

        if (edits) {
            imgHandler.edits = edits;
        }

        console.log(imgHandler);
        return imgHandler as ImageHandler;
    }

    private initImage(imageHandler: ImageHandler) {
        const headParams = {
            Bucket: imageHandler.bucket
        };

        const img = {} as Image;
        img.fileName = imageHandler.key; // TODO: read without path from Head: https://stackoverflow.com/questions/42647016/aws-sdk-get-file-information
        img.description = '';

        const str = JSON.stringify(imageHandler);
        const enc = btoa(str);

        img.imageUrl = environment.album.imageHandlerEndpoint + '/' + enc;
        return img;
    }
}
