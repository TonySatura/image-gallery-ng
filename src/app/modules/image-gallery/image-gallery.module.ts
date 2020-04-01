import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './components/details/details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { AwsModule } from '../aws/aws.module';

@NgModule({
    imports: [AwsModule, CommonModule, ImageGalleryRoutingModule, SharedModule],
    declarations: [DetailsComponent, OverviewComponent],
    providers: []
})
export class ImageGalleryModule {}
