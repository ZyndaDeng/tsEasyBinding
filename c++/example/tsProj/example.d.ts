

type int=number;
type char=string;
declare module "example" {

    export class Element{
        constructor(name:string);
        get name(): string;
        set name(value: string);
        get x(): int;
        set x(value: int);
        get y(): int;
        set y(value: int);
        getType(): char;
    }

    export type ButtonClick=(arg:Button)=>void;
    export class Button extends Element{
        getType(): char;
         click():void;
         setOnClick(func:ButtonClick):void;
    }

    export class Input extends Element{
        getType(): char;
    }

    export class Label extends Element{
        getType(): char;
        get text(): string;
        set text(value: string);
    }

    export class View {
        addElement(element:Element):void;
        getElementByName(name:string):Element|undefined;
    }
}