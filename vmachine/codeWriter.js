const fs = require('fs');
const path = require('path');

class CodeWriter{

    constructor(fileOutput){
        this.fileOutputName = fileOutput;
        this.staticFileName = String.prototype.slice.call(path.basename(fileOutput), 0, path.basename(fileOutput).lastIndexOf('.'));
        this.writeStream = fs.createWriteStream(path.resolve(__dirname, this.fileOutputName));
        this.instrCounter = 1;
    }

    writeArithmetic(command) {
        switch(command){
            case 'add':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nM=D+M\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M+1\n`);
                break;
            case 'sub':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M-1\nM=M-D\n`);
                break;
            case 'neg':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nM=-M\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M+1\n`);
                break;
            case 'eq':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nM=D-M\n`);
                this.writeStream.write(`@SP\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JEQ\n@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t`);
                this.writeStream.write(`@SP\n\t\tA=M\n\t\tM=D\n\t\t`);
                this.writeStream.write(`@SP\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'gt':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\nM=M-1\n`);
                this.writeStream.write(`@SP\nA=M\nM=M-D\n`);
                this.writeStream.write(`@SP\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JGT\n`);
                this.writeStream.write(`@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t@SP\n\t\tA=M\n\t\tM=D\n\t\t@SP\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'lt':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\nM=M-1\n`);
                this.writeStream.write(`@SP\nA=M\nM=M-D\n`);
                this.writeStream.write(`@SP\nA=M\nD=M\n`);
                this.writeStream.write(`@D${this.instrCounter}1\nD;JLT\n`);
                this.writeStream.write(`@D${this.instrCounter}0\nD=0;JMP\n`);
                this.writeStream.write(`(D${this.instrCounter}1)\nD=-1\n`);
                this.writeStream.write(`(D${this.instrCounter}0)\n\t\t@SP\n\t\tA=M\n\t\tM=D\n\t\t@SP\n\t\tM=M+1\n`);
                this.instrCounter++;
                break;
            case 'and':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\nA=M-1\nM=D&M\n`);
                break;
            case 'or':
                this.writeStream.write(`//${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nD=M\n`);
                this.writeStream.write(`@SP\nA=M-1\nM=D|M\n`);
                break;
            case 'not':
                this.writeStream.write(`// ${command}\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`M=M-1\n`);
                this.writeStream.write(`@SP\n`);
                this.writeStream.write(`A=M\nM=!M\n`);
                this.writeStream.write(`@SP\n`);
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
                    break;
                case 'local':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@LCL\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nA=D\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n@SP\nM=M+1\n`);
                    break;
                case 'argument':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@ARG\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nA=D\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n@SP\nM=M+1\n`);
                    break;
                case 'this':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@THIS\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nA=D\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n@SP\nM=M+1\n`);
                    break;
                case 'that':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@THAT\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nA=D\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n@SP\nM=M+1\n`);
                    break;
                case 'temp':
                    let regNum = parseInt(arg2) + 5;
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@R${regNum}\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n`);
                    this.writeStream.write(`@SP\nM=M+1\n`);
                    break;
                case 'pointer':
                    if(parseInt(arg2)===0){
                        this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                        this.writeStream.write(`@THIS\nD=M\n`);
                        this.writeStream.write(`@SP\nA=M\nM=D\n`);
                        this.writeStream.write(`@SP\nM=M+1\n`);
                    }
                    else if(parseInt(arg2)===1){
                        this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                        this.writeStream.write(`@THAT\nD=M\n`);
                        this.writeStream.write(`@SP\nA=M\nM=D\n`);
                        this.writeStream.write(`@SP\nM=M+1\n`);
                    }
                    break;
                case 'static':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@${this.staticFileName}.${arg2}\nD=M\n`);
                    this.writeStream.write(`@SP\nA=M\nM=D\n`);
                    this.writeStream.write(`@SP\nM=M+1\n`);
                    break;
                default:
                    break;
            }
        }
        else if(op==='POP'){
            switch(arg1){
                case 'local':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n`);
                    this.writeStream.write(`@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@R13\nM=D\n`)
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@LCL\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nM=D\n@R13\nD=M\n`);
                    this.writeStream.write(`@newaddress\nA=M\nM=D`);
                    break;
                case 'argument':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n`);
                    this.writeStream.write(`@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@R13\nM=D\n`)
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@ARG\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nM=D\n@R13\nD=M\n`);
                    this.writeStream.write(`@newaddress\nA=M\nM=D`);
                    break;
                case 'this':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n`);
                    this.writeStream.write(`@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@R13\nM=D\n`)
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@THIS\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nM=D\n@R13\nD=M\n`);
                    this.writeStream.write(`@newaddress\nA=M\nM=D`);
                    break;
                case 'that':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n`);
                    this.writeStream.write(`@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@R13\nM=D\n`)
                    this.writeStream.write(`@${arg2}\nD=A\n`);
                    this.writeStream.write(`@THAT\nA=M\nD=D+A\n`);
                    this.writeStream.write(`@newaddress\nM=D\n@R13\nD=M\n`);
                    this.writeStream.write(`@newaddress\nA=M\nM=D`);
                    break;
                case 'temp':
                    let regNum = parseInt(arg2) + 5;
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@R${regNum}\nM=D\n`);
                    break;
                case 'pointer':
                    if(parseInt(arg2)===0){
                        this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                        this.writeStream.write(`@SP\nM=M-1\n`);
                        this.writeStream.write(`@SP\nA=M\nD=M\n`);
                        this.writeStream.write(`@THIS\nM=D\n`);
                    }
                    else if(parseInt(arg2)===1){
                        this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                        this.writeStream.write(`@SP\nM=M-1\n`);
                        this.writeStream.write(`@SP\nA=M\nD=M\n`);
                        this.writeStream.write(`@THAT\nM=D\n`);
                    }
                    break;
                case 'static':
                    this.writeStream.write(`//${op} ${arg1} ${arg2}\n`);
                    this.writeStream.write(`@SP\nM=M-1\n`);
                    this.writeStream.write(`@SP\nA=M\nD=M\n`);
                    this.writeStream.write(`@${this.staticFileName}.${arg2}\nM=D\n`);
                    break;
                default:
                    break;
            }
        }
    }

    close() {
        this.writeStream.write(`(END)\n\t\t@END\n\t\t0;JMP`);
        this.writeStream.end();
    }
}

module.exports = CodeWriter;