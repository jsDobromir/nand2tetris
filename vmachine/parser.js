const events = require('events');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const stream = require('stream');
const commandsEnum = require('./commands.js');

const fileName = '/home/dobromir/Downloads/nand2tetris/projects/07/StackArithmetic/SimpleAdd/SimpleAdd.vm';

class Parser {

    static #lines = 0;
    static #currentLine = 0;
    static #linesArr = [];
    static #currentCommand = null;
    static #arg1 = undefined;
    static #arg2 = undefined;

    static readFile(filename) {
        return new Promise((resolve, reject) => {
            let fileStream = filename;
            const inStream = fs.createReadStream(path.resolve(__dirname, fileStream));
            const outStream = new stream;
            const readLine = readline.createInterface(inStream, outStream);

            readLine.on('line', (line) => {
                let lline = line.trim();
                if(lline && lline[0]!=='/' && lline[1]!=='/'){
                    this.#lines++;
                    this.#linesArr.push(lline);
                }
            });

            readLine.on('close', () => {
                this.setCommandsArgs();
                return resolve();
            });

        });
    }

    static getLines(){
        return this.#lines;
    }

    static getArray() {
        return this.#linesArr;
    }

    static hasMoreLines(){
        return this.#currentLine < this.#lines;
    }

    static advance() {
        this.#currentLine++;
        if(this.hasMoreLines()) {
            this.setCommandsArgs();
        }
    }

    static arg1() {
        return this.#arg1;
    }

    static arg2() {
        return this.#arg2;
    }

    static commandType() {
        return this.#currentCommand;
    }

    static setCommandsArgs(){
        //set command type first 
        const commandArg = this.#linesArr[this.#currentLine].split(' ');
        switch(commandArg[0]){
            case 'add':
            case 'sub':
            case 'neg':
            case 'eq':
            case 'gt':
            case 'lt':
            case 'and':
            case 'or':
            case 'not':
                this.#currentCommand = commandsEnum.C_ARITHMETIC;
                break;
            case 'push':
                this.#currentCommand = commandsEnum.C_PUSH;
                break;
            case 'pop':
                this.#currentCommand = commandsEnum.C_POP;
                break;
            case 'label':
                this.#currentCommand = commandsEnum.C_LABEL;
                break;
            case 'goto':
                this.#currentCommand = commandsEnum.C_GOTO;
                break;
            case 'if':
                this.#currentCommand = commandsEnum.C_IF;
                break;
            case 'function':
                this.#currentCommand = commandsEnum.C_FUNCTION;
                break;
            case 'return':
                this.#currentCommand = commandsEnum.C_RETURN;
                break;
            case 'call':
                this.#currentCommand = commandsEnum.C_CALL;
                break;
            default:
                this.#currentCommand = undefined;
                break;
        }

        //arg1
        let arg1 = (typeof commandArg[1]==='undefined') ? undefined : commandArg[1];
        switch(this.#currentCommand){
            case commandsEnum.C_ARITHMETIC:
                this.#arg1 = commandArg[0];
                break;
            case commandsEnum.C_PUSH:
            case commandsEnum.C_POP:
            case commandsEnum.C_LABEL:
            case commandsEnum.C_GOTO:
            case commandsEnum.C_IF:
            case commandsEnum.C_FUNCTION:
            case commandsEnum.C_CALL:
                this.#arg1 = arg1;
                break;
            default:
                this.#arg1 = undefined;
                break;
        }

        //arg2
        let arg2 = (typeof commandArg[2]==='undefined') ? undefined : commandArg[2];
        switch(this.#currentCommand){
            case commandsEnum.C_PUSH:
            case commandsEnum.C_POP:
            case commandsEnum.C_FUNCTION:
            case commandsEnum.C_CALL:
                this.#arg2 = arg2;
                break;
            default:
                this.#arg2 = undefined;
                break;
        }
    }
}

module.exports = Parser;