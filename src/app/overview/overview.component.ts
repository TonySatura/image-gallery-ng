import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    albums: string[];

    constructor(private albumService: AlbumService) {}

    ngOnInit() {
        this.albumService
            .listAlbums()
            .subscribe(albums => (this.albums = albums));
    }
}
