import {ControllerComponent} from "./controller/controller.component";
import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Router} from "angular2/router";

@Component({
    selector: "app",
    templateUrl: "app/app.component.html",
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS
    ]
})
@RouteConfig([
    {
        path: "/",
        name: "Controller",
        component: ControllerComponent,
        useAsDefault: true
    }
])
export class AppComponent implements OnInit {
    constructor(public router: Router) {}

    ngOnInit() {
        $("body .mdl-navigation__link").click(function () {
            var d = document.querySelector('.mdl-layout');
            d.MaterialLayout.toggleDrawer();
        });
    }

    ngAfterViewInit() {
        componentHandler.upgradeDom();
    }
}
