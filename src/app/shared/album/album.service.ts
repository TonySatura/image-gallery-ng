import { Injectable, Optional } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';

import {
    Album,
    ListAlbumsRequest,
    ListImagesRequest,
    Image,
    ImageHandler,
    ImageHandlerEdits
} from './album.model';
import { S3Service } from '../aws/s3.service';
import { S3Object } from 'aws-sdk/clients/rekognition';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';

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
            map(output => output.CommonPrefixes.map(c => this.initAlbum(c))),
            tap(response => console.log(response))
        );
    }

    public listImages(request: ListImagesRequest): Observable<Image[]> {
        const bucket = this.s3Service.initBucket(request.s3BucketName);
        //var bucketUrl = this.s3Service.getUrlFromBucket(bucket);

        const params = {
            Prefix: request.albumTitle + '/'
        } as S3.ListObjectsRequest;

        const promise = bucket.listObjects(params).promise();

        return from(promise).pipe(
            map(output =>
                output.Contents.filter(object => object.Key != params.Prefix)
                    .map(object => {
                        return this.initImageHandler(
                            request.s3BucketName,
                            object,
                            request.imageEdits
                        );
                    })
                    .map(imageHandler => this.initImage(imageHandler))
            ),
            tap(response => console.log(response))
        );
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
        var imgHandler = {} as ImageHandler;
        imgHandler.bucket = bucket;
        imgHandler.key = object.Key;

        if (edits) {
            imgHandler.edits = edits;
        }

        console.log(imgHandler);
        return imgHandler as ImageHandler;
    }

    private initImage(imageHandler: ImageHandler) {
        var headParams = {
            Bucket: imageHandler.bucket
        };

        var img = {} as Image;
        img.fileName = imageHandler.key; //TODO: read without path from Head: https://stackoverflow.com/questions/42647016/aws-sdk-get-file-information
        img.description = '';

        const str = JSON.stringify(imageHandler);
        const enc = btoa(str);

        img.imageUrl = environment.album.imageHandlerEndpoint + enc;
        return img;
    }
}
