import { Component, OnInit } from '@angular/core';
import { Album, ListAlbumsRequest } from '../shared/album/album.model';
import { AlbumService } from '../shared/album/album.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    albums: Album[];

    constructor(private albumService: AlbumService) {}

    ngOnInit() {
        const request = {
            s3BucketName: 'tonomony-images'
        } as ListAlbumsRequest;

        this.albumService
            .listAlbums(request)
            .subscribe(albums => (this.albums = albums));
    }
}
