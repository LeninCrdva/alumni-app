import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start.component';
import { ContentBuilderComponent } from './content-builder/content-builder.component';
const routes: Routes = [
    { path: '', component: StartComponent },
   // {path: '/component/:id', component: ContentBuilderComponent},
   {path: 'component/:id', component: ContentBuilderComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StartRoutingModule { }