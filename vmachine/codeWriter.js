const fs = require('fs');
const path = require('path');

class CodeWriter{

    constructor(fileOutput){
        this.fileOutputName = fileOutput;
        this.writeStream = fs.createWriteStream(path.resolve(__dirname, this.fileOutputName));
        this.lastVar = undefined;
        this.instrCounter = 1;
    }

    writeArithmetic(command) {
        switch(command){
            case 'add':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nM=D+M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M+1\n`);
                break;
            case 'sub':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M-1\nM=M-D\n`);
                break;
            case 'neg':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nM=-M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M+1\n`);
                break;
            case 'eq':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nM=D-M\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JEQ\n@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t`);
                this.writeStream.write(`@${this.lastVar}\n\t\tA=M\n\t\tM=D\n\t\t`);
                this.writeStream.write(`@${this.lastVar}\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'gt':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\nM=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M\nM=M-D\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JGT\n`);
                this.writeStream.write(`@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t@${this.lastVar}\n\t\tA=M\n\t\tM=D\n\t\t@${this.lastVar}\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'lt':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\nM=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M\nM=M-D\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JLT\n`);
                this.writeStream.write(`@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t@${this.lastVar}\n\t\tA=M\n\t\tM=D\n\t\t@${this.lastVar}\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'and':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M-1\nM=D&M\n`);
                break;
            case 'or':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@${this.lastVar}\nA=M-1\nM=D|M\n`);
                break;
            case 'not':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`A=M\nM=!M\n`);
                this.writeStream.write(`@${this.lastVar}\n`);
                this.writeStream.write(`M=M+1\n`);
                break;
            default:
                break;
        }
    }

    writePushPop(op, arg1, arg2){
        if(op==='PUSH'){
            //write comment in assembly
            switch(arg1){
                case 'constant':
                    //write the comment to assembly file
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    //now have to write the actual assembly command
                    this.writeStream.write(`@${arg2}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n`);
                    this.lastVar = `SP`;
                    break;
                case 'local':
                    
                    break;
                default:
                    break;
            }
        }
        else if(op==='POP'){

        }
    }

    close() {
        this.writeStream.write(`(END)\n\t\t@END\n\t\t0;JMP`);
        this.writeStream.end();
    }
}

module.exports = CodeWriter;