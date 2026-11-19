import { Routes } from '@angular/router';

export const routes: Routes = [
    {

        path: 'skills', loadComponent: () => import('./components/skills/skills').then(mod => mod.Skills),
    },
];
