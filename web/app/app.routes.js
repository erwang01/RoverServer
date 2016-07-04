"use strict";
var controller_component_1 = require("./controller/controller.component");
var router_1 = require('@angular/router');
var routes = [
    {
        path: '',
        component: controller_component_1.ControllerComponent
    }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map