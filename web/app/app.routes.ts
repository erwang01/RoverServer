import {ControllerComponent} from "./controller/controller.component";
import { provideRouter, RouterConfig }  from '@angular/router';

const routes: RouterConfig = [
  {
    path: '',
    component: ControllerComponent
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
