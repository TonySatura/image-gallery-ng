import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CacheObject, CacheSettings } from '../models/cache.model';
import { CACHE_SETTINGS } from './cache.config';

@Injectable()
export class CacheService {
    private cacheMap: Map<string, CacheObject>;
    private settings: CacheSettings;

    constructor(@Inject(CACHE_SETTINGS) settings: CacheSettings) {
        this.settings = settings;

        if (this.settings.enabled) {
            this.cacheMap = new Map<string, CacheObject>();
        }
    }

    public getObservable<T, TResult>(
        request: T,
        cachedFunction: (r: T) => Observable<TResult>
    ): Observable<TResult> {
        let result: Observable<TResult> = this.loadFromCache<
            T,
            Observable<TResult>
        >(request);

        if (!result) {
            result = cachedFunction(request).pipe(
                tap(response => {
                    if (!environment.production) {
                        console.log(JSON.stringify(response));
                    }
                }),
                share()
            );

            if (!environment.production) {
                console.log('=== NOT FROM CACHE ===');
            }

            this.saveToCache<T, Observable<TResult>>(
                request,
                result,
                this.settings.expiresInSeconds
            );
        }

        return result;
    }

    private getCacheKey<T>(request: T) {
        return btoa(JSON.stringify(request));
    }

    private loadFromCache<T, TResult>(request: T): TResult {
        if (this.settings.enabled) {
            const cacheKey = this.getCacheKey(request);
            const cacheObject = this.cacheMap.get(cacheKey);

            if (cacheObject) {
                if (new Date() < cacheObject.expireDate) {
                    return cacheObject.data;
                } else {
                    this.cacheMap.delete(cacheKey);
                }
            }
        }
    }

    private saveToCache<T, TResult>(
        request: T,
        result: TResult,
        expiresInSeconds: number
    ) {
        if (this.settings.enabled) {
            const cacheKey = this.getCacheKey(request);

            const cacheObject = {
                data: result,
                expireDate: this.calculateExpireDate(expiresInSeconds)
            } as CacheObject;

            this.cacheMap.set(cacheKey, cacheObject);
        }
    }

    private calculateExpireDate(expiresInSeconds: number) {
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + expiresInSeconds);
        return expireDate;
    }
}
