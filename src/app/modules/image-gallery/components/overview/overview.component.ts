import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Album, ListAlbumsRequest } from '../../models/album.model';
import { AlbumService } from '../../services/album.service';

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
            s3BucketName: environment.album.bucketName
        } as ListAlbumsRequest;

        this.albumService
            .listAlbums(request)
            .subscribe(albums => (this.albums = albums));
    }
}
