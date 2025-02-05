

import {View,Label,Button} from "example"

function main() {
    var view = new View();

    let label = new Label("lbl");
    label.text = "Hello World";
    view.add(label);

    let btn = new Button("btn");
    btn.setOnClick((e) => console.log("clicked",e.name));
    view.add(btn);

    let btn2=view.getElementByName("btn");
    btn2.click();
}

main();