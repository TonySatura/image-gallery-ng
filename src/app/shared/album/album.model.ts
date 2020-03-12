export interface Album {
    title: string;
    titleImageKey: string;
}

export interface ListAlbumsRequest {
    s3BucketName: string;
}
