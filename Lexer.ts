import FS from 'fs'

export enum Access {
    PUBLIC,
    PRIVATE,
    PROTECTED
}
function parseAccess(str): Access {
    switch(str.toLowerCase()) {
        case 'public': return Access.PUBLIC
        case 'privvate': return Access.PRIVATE
        case 'protected': return Access.PROTECTED
    }
}

export enum FileType {
    HEADER,
    SOURCE
}

export class Parameter {
    constructor() {
    }

    name: string
    type: string
    fPointer: boolean
    fReference: boolean
    fConst: boolean
}

export class Function {
    constructor() {
    }

    name: string
    access: Access
    fStatic: boolean
    fInline: boolean
    fOverride: boolean
    fConst: boolean
    fVirtual: boolean
    returnType: string
    parameters: Parameter[]
}

export class ParentClass {
    constructor() {
    }

    name: string
    access: Access
}

export class Namespace {
    constructor() {
    }

    parse(src: string) {
        this.name = RegexHelpers.getNamespaceName(src)
        this.childNamespaces = []

        const body = src.substring(searchNextLine(src))
        let match = body.search(/namespace (\w+)\s+{/gm)
        if(match != -1) {
            const namespace = new Namespace()
            namespace.parse(src.substring(match))
            this.childNamespaces.push(namespace)
        }
        console.log(RegexHelpers.getClassName(body))
    }

    name: string
    childNamespaces: Namespace[]
    classes: Class
    functions: Function
}

export class Class {
    constructor() {
    }

    name: string
    parents: ParentClass
    namespace: Namespace
}

export class File {
    constructor() {
    }

    parse(src: string) {
        const namespaceMatch = src.search(/namespace (\w+)\s+{/gm)
        const namespaceSrc = src.substring(namespaceMatch, searchNamespaceEnd(src, namespaceMatch))
        const namespace = new Namespace()
        namespace.parse(namespaceSrc)
    }

    type: FileType
    dir: string
    classes: Class[]
    nameespaces: Namespace[]
}

export type LexerOptions = {
}

export default class Lexer {
    constructor(options: LexerOptions) {
        this.options = options
    }

    parseFile(fin: string, type: FileType) {
        const file = new File()
        file.type = type
        file.parse(FS.readFileSync(fin, { encoding: 'utf-8' }))
    }

    options: LexerOptions
}

class RegexHelpers {
    static getNamespaceName(src: string): string {
        return /namespace (\w+)\s+{/gm.exec(src)[1]
    }
    static getClassName(src: string): { name: string, base: string, access: Access } {
        const r = /class (\w+)\s*:\s*(\w+)\s*(\w+)\s*{/gm.exec(src)
        console.log(r)

        return {
            name: r[1],
            base: r[3],
            access: parseAccess(r[2])
        }
    }
}

function searchNamespaceEnd(str: string, from: number): number {
    let braces = 1
    from = str.indexOf('{') + 1
    for(let i = from; i < str.length; ++i) {
        if(str.at(i) == '{') braces++
        else if(str.at(i) == '}') braces--

        if(braces == 0) return i + 1
    }

    throw new Error(`Could not find namespace end (Start: ${from})`)
}

function searchNextLine(str: string) {
    return str.indexOf('\n')
}
