import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ListImagesRequest,
    Image,
    ImageHandlerFit
} from '../shared/album/album.model';
import { AlbumService } from '../shared/album/album.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    images: Image[];

    constructor(
        private route: ActivatedRoute,
        private albumService: AlbumService
    ) {}

    ngOnInit(): void {
        const request = {
            s3BucketName: environment.album.bucketName,
            albumTitle: this.route.snapshot.paramMap.get('title'),
            imageEdits: {
                resize: {
                    width: 200,
                    height: 200,
                    fit: ImageHandlerFit.COVER
                }
            }
        } as ListImagesRequest;

        this.albumService
            .listImages(request)
            .subscribe(images => (this.images = images));
    }
}
