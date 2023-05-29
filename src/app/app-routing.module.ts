import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerComponent } from './components/tracker/tracker.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'tracker', pathMatch: 'full' },
  { path: 'tracker', component: TrackerComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'projects', component: ProjectsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
