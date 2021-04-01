import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'image-gallery',
        loadChildren: () =>
            import('./modules/image-gallery/image-gallery.module').then(
                m => m.ImageGalleryModule
            ),
        data: { pageTitle: 'Overview' }
    },
    { path: '**', redirectTo: 'image-gallery', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
