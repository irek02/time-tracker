import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { EntryAutocompleteComponent } from './components/entry-autocomplete/entry-autocomplete.component';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryAutocompleteComponent,
    ProjectSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
