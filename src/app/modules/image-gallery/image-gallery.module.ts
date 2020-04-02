import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './components/details/details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { AwsModule } from '../aws/aws.module';
import { CacheService } from '../shared/services/cache.service';
import { CACHE_SETTINGS } from '../shared/services/cache.config';
import { CacheSettings, CacheStorageType } from '../shared/models/cache.model';
import { environment } from 'src/environments/environment';

const IG_CACHE_SETTINGS: CacheSettings = {
    // overwrite environment defaults if applicable
    enabled: environment.cache.enabled,
    expiresInSeconds: environment.cache.expiresInSeconds,
    storageType: environment.cache.storageType
};

@NgModule({
    imports: [AwsModule, CommonModule, ImageGalleryRoutingModule, SharedModule],
    declarations: [DetailsComponent, OverviewComponent],
    providers: [
        CacheService,
        {
            provide: CACHE_SETTINGS,
            useValue: IG_CACHE_SETTINGS
        }
    ]
})
export class ImageGalleryModule {}
