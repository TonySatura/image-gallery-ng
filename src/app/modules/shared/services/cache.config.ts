import { InjectionToken } from '@angular/core';
import { CacheSettings } from '../models/cache.model';

export let CACHE_SETTINGS = new InjectionToken<CacheSettings>('cache.config');

export const DEFAULT_CACHE_SETTINGS: CacheSettings = {
    enabled: true,
    expiresInSeconds: 60
};
