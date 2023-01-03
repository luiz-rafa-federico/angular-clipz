import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';

import { TabComponent } from './tab/tab.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { InputComponent } from './input/input.component';

@NgModule({
  declarations: [
    ModalComponent,
    TabComponent,
    TabsContainerComponent,
    InputComponent,
  ],
  imports: [CommonModule],
  exports: [
    ModalComponent,
    TabComponent,
    TabsContainerComponent,
    InputComponent,
  ],
})
export class SharedModule {}
