import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './components/details/details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { AwsModule } from '../aws/aws.module';
import { CacheService } from '../cache/services/cache.service';
import { CacheSettings } from '../cache/models/cache.model';
import { CACHE_SETTINGS } from '../cache/services/cache.config';
import { environment } from 'src/environments/environment';

const IG_CACHE_SETTINGS: CacheSettings = {
    // overwrite environment defaults if applicable
    enabled: environment.cache.enabled,
    expiresInSeconds: environment.cache.expiresInSeconds,
    storageType: environment.cache.storageType,
};

@NgModule({
    imports: [AwsModule, CommonModule, ImageGalleryRoutingModule],
    declarations: [DetailsComponent, OverviewComponent],
    providers: [
        CacheService,
        {
            provide: CACHE_SETTINGS,
            useValue: IG_CACHE_SETTINGS,
        },
    ],
})
export class ImageGalleryModule {}
