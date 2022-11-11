import {Command} from 'Commander'
import Figlet from 'figlet'
import Gradient from 'gradient-string'

import Lexer, {FileType} from './Lexer.js'

const program = new Command()

const NAME = 'CPPLexerJS'
const VERSION = '0.1.0'

console.log(Gradient.pastel.multiline(Figlet.textSync(NAME, { font: 'Doom' })))

program
    .name(NAME)
    .version(VERSION)
    .description('parses c++ code into a json structure')

program
    .command('parse')
    .argument('<file>', 'the file')
    .action(args => {
        new Lexer({ }).parseFile(args, FileType.HEADER)
    })

program.parse(process.argv)
