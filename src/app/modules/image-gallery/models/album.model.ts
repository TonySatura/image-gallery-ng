export interface Album {
    s3BucketName: string;
    title: string;
    titleImage: Image;
}

export interface Image {
    fileName: string;
    description: string;
    imageUrl: string;
}

export interface ImageHandler {
    bucket: string;
    key: string;
    edits: ImageHandlerEdits;
}

export interface ImageHandlerEdits {
    resize: {
        width: number;
        height: number;
        fit: ImageHandlerFit;
    };
    grayscale: boolean;
    flip: boolean;
    flop: boolean;
    negate: boolean;
    flatten: boolean;
    normalise: boolean;
}

export enum ImageHandlerFit {
    COVER = 'cover',
    CONTAIN = 'contain',
    FILL = 'fill',
    INSIDE = 'inside',
    OUTSIDE = 'outside'
}

export interface ListAlbumsRequest {
    s3BucketName: string;
}

export interface ListImagesRequest {
    s3BucketName: string;
    albumTitle: string;
    imageEdits: ImageHandlerEdits;
}
