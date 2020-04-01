import { Image, ImageHandlerEdits } from './image.model';

export interface Album {
    s3BucketName: string;
    title: string;
    titleImage: Image;
}

export interface ListAlbumsRequest {
    s3BucketName: string;
}
