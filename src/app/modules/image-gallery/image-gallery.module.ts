import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './components/details/details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CacheModule } from '../cache/cache.module';
import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { AwsModule } from '../aws/aws.module';
<<<<<<< HEAD
import { CacheService } from '../shared/services/cache.service';
import { CACHE_SETTINGS } from '../shared/services/cache.config';
import { CacheSettings } from '../shared/models/cache.model';
=======
import { CacheService } from '../cache/services/cache.service';
import { CACHE_SETTINGS } from '../cache/services/cache.config';
import { CacheSettings, CacheStorageType } from '../cache/models/cache.model';
>>>>>>> 6eb328b002cf32492e8249951b32c9f2a86fdc56
import { environment } from 'src/environments/environment';

const IG_CACHE_SETTINGS: CacheSettings = {
    // overwrite environment defaults if applicable
    enabled: environment.cache.enabled,
    expiresInSeconds: environment.cache.expiresInSeconds,
    storageType: environment.cache.storageType,
};

@NgModule({
    imports: [AwsModule, CommonModule, ImageGalleryRoutingModule, CacheModule],
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
