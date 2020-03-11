import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { AlbumModel } from '../models/album.model';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    albums: AlbumModel[];

    constructor(private albumService: AlbumService) {}

    ngOnInit() {
        this.albumService
            .listAlbumTitles()
            .subscribe(albums => (this.albums = albums));
    }
}
