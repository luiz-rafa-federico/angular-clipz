import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';

import { TabComponent } from './tab/tab.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';
// import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    ModalComponent,
    TabComponent,
    TabsContainerComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    ModalComponent,
    TabComponent,
    TabsContainerComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}

//  IMPORT => NgxMaskModule.forRoot()
