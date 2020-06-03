import { BindingData, BaseBindingData } from "../BindingData";


export  class JSBNamespace extends BaseBindingData{
    bindingType: "namespace"
    protected members_: Array< BaseBindingData >
    constructor(name: string) {
        super(name)
        this.bindingType = "namespace"
        this.members_ = [];
    }

    static IsMyType(data: BindingData): data is JSBNamespace {
        return data.bindingType == "namespace";
    }

    addMember(m: BaseBindingData) {
        //if (this.members_[m.name]) throw new Error("member[" + m.name + "] aready in module[" + this.name + "]");
        m.parent = this;
        this.members_.push (m);
    }

    // removeMember(arg: BaseBindingData | string) {
    //     if (typeof arg == "string") {
    //         let m = this.members_[arg];
    //         if (m) {
    //             m.parent = undefined;
    //             delete this.members_[arg];
    //         }
    //     } else {
    //         let m = this.members_[arg.name];
    //         if (m && m == arg) {
    //             m.parent = undefined;
    //             delete this.members_[arg.name];
    //         } else {
    //             throw new Error("that is not the member of this module");
    //         }
    //     }
    // }

    get members() {
        return this.members_;
    }
}