import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ListImagesRequest,
    Image,
    ImageHandlerFit
} from '../../models/image.model';
import { environment } from 'src/environments/environment';
import { ImageService } from '../../services/image.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    albumTitle: string;
    images: Image[];

    constructor(
        private route: ActivatedRoute,
        private imageService: ImageService
    ) {}

    ngOnInit(): void {
        this.albumTitle = this.route.snapshot.paramMap.get('title');

        const request = {
            s3BucketName: environment.album.bucketName,
            albumTitle: this.albumTitle,
            imageEdits: {
                resize: {
                    width: 200,
                    height: 200,
                    fit: ImageHandlerFit.COVER
                }
            }
        } as ListImagesRequest;

        this.imageService
            .listImages(request)
            .subscribe(images => (this.images = images));
    }
}
