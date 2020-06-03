import { BindingData, BaseBindingData } from "../BindingData";


export  class JSBModule extends BaseBindingData{
    bindingType: "module"
    protected members_: Array< BaseBindingData >
    constructor(name: string) {
        if(name[0]=="\""){
            name=name.replace("\"","");
            name=name.replace("\"","");
        }
        super(name)
        this.bindingType = "module"
        this.members_ = [];
    }

    static IsMyType(data: BindingData): data is JSBModule {
        return data.bindingType == "module";
    }

    addMember(m: BaseBindingData) {
        //if (this.members_[m.name]) throw new Error("member[" + m.name + "] aready in module[" + this.name + "]");
        m.parent = this;
        this.members_.push (m);
    }

    get members() {
        return this.members_;
    }
}