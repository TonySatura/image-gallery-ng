import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ListImagesRequest,
    Image,
    ImageHandlerFit
} from '../../models/image.model';
import { environment } from 'src/environments/environment';
import { ImageService } from '../../services/image.service';
import { Album } from '../../models/album.model';
import { AlbumService } from '../../services/album.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    album: Album;
    images: Image[];
    loadingProcess: number;

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private albumService: AlbumService,
        private imageService: ImageService
    ) {
        this.loadingProcess = 0;
    }

    ngOnInit(): void {
        const getAlbumRequest = {
            s3BucketName: environment.album.bucketName,
            albumTitle: this.activeRoute.snapshot.paramMap.get('title')
        };

        this.albumService.getAlbum(getAlbumRequest).subscribe(album => {
            if (!album) {
                this.router.navigate(['']);
            } else {
                this.album = album;
                this.loadingProcess = 20;

                const listImagesRequest = {
                    s3BucketName: this.album.s3BucketName,
                    albumTitle: this.album.title,
                    imageEdits: {
                        resize: {
                            width: 200,
                            height: 200,
                            fit: ImageHandlerFit.COVER
                        }
                    }
                } as ListImagesRequest;

                this.imageService
                    .listImages(listImagesRequest)
                    .subscribe(images => {
                        this.images = images;
                        this.loadingProcess = 100;
                    });
            }
        });
    }
}
