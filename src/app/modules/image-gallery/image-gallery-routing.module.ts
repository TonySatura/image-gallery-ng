import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
    {
        path: '',
        component: OverviewComponent,
        data: { pageTitle: 'Overview' }
    },
    {
        path: 'album/:title',
        component: DetailsComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImageGalleryRoutingModule {}
