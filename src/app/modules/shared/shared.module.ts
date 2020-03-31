import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CacheService } from './services/cache.service';
import { S3Service } from './services/s3.service';

@NgModule({
    providers: [S3Service],
    imports: [CommonModule]
})
export class SharedModule {}
