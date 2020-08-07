import * as S3 from 'aws-sdk/clients/s3';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
    Image,
    ImageHandlerEdits,
    ImageHandler,
    ListImagesRequest
} from '../models/image.model';
import { Observable, from } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';
import { CacheService } from '../../cache/services/cache.service';
import { S3Service } from '../../aws/services/s3.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    constructor(
        private s3Service: S3Service,
        private cacheService: CacheService
    ) {}

    public listImages(request: ListImagesRequest): Observable<Array<Image>> {
        return this.cacheService.getObservable(request, r => {
            const bucket = this.s3Service.initBucket(r.s3BucketName);
            const params = {
                Prefix: r.albumTitle + '/'
            } as S3.ListObjectsRequest;

            const promise = bucket.listObjects(params).promise();
            return from(promise).pipe(
                map(output =>
                    output.Contents.filter(
                        object => object.Key !== params.Prefix
                    ).map(object => {
                        return this.initImage(
                            r.s3BucketName,
                            object,
                            r.imageEdits
                        );
                    })
                )
            );
        });
    }

    private initImage(
        bucket: string,
        object: S3.Object,
        edits: ImageHandlerEdits
    ) {
        const imgHandler = {} as ImageHandler;
        imgHandler.bucket = bucket;
        imgHandler.key = object.Key;

        if (edits) {
            imgHandler.edits = edits;
        }

        const headParams = {
            Bucket: imgHandler.bucket
        };

        // TODO: read without path from Head: https://stackoverflow.com/questions/42647016/aws-sdk-get-file-information
        const img = {} as Image;
        img.fileName = imgHandler.key;
        img.description = '';

        const str = JSON.stringify(imgHandler);
        const enc = btoa(str);

        img.imageUrl = environment.album.imageHandlerEndpoint + '/' + enc;
        return img;
    }
}
