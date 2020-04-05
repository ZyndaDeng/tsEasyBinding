

export class BindingPackage {

    constructor(includeStr: string, name: string, dtsFiles: Array<string>) {
        this.includeStr = includeStr;
        this.name = name;
        this.tsFiles = dtsFiles;
    }

    includeStr: string;
    tsFiles: Array<string>;
    name: string;
  
}