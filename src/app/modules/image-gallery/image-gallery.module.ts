import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './components/details/details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { AlbumService } from './services/album.service';

@NgModule({
    imports: [CommonModule, ImageGalleryRoutingModule, SharedModule],
    declarations: [DetailsComponent, OverviewComponent],
    providers: [AlbumService]
})
export class ImageGalleryModule {}
