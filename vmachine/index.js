const parser = require('./parser.js');
const codeWriter = require('./codeWriter.js');

let fileInput = process.argv[2] || 'exp.vm';
const fileOutput = fileInput.substring(0, fileInput.lastIndexOf('.')) + '.asm';

parser.readFile(fileInput).then(() => {
    const writerObj = new codeWriter(fileOutput);
    while(parser.hasMoreLines()){
        if(parser.commandType()==='ARITHMETIC'){
            writerObj.writeArithmetic(parser.arg1());
        }
        else if(parser.commandType()==='PUSH' || parser.commandType()==='POP'){
            writerObj.writePushPop(parser.commandType(), parser.arg1(), parser.arg2());
        }

        parser.advance();
    }
    writerObj.close();
});