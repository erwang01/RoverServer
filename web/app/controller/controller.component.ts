import {Component} from "@angular/core";

@Component({
    templateUrl: "app/controller/controller.component.html"
})
export class ControllerComponent {
    roverFeedSource: string = "http://192.168.15.149/html/cam_pic_new.php";
    ngAfterViewInit() {
        componentHandler.upgradeDom();
    }
}
