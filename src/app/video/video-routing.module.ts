import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedToHome } from '../services/common-functions.service';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: { authGuardPipe: redirectUnauthorizedToHome },
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: { authGuardPipe: redirectUnauthorizedToHome },
    canActivate: [AngularFireAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
