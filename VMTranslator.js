const fs = require('fs'); 
var filename = 'projects/07/MemoryAccess/StaticTest/StaticTest.vm'; //input file name
writeFD = fs.openSync('projects/07/MemoryAccess/StaticTest/test.asm', 'w+'); //output file being written to
var lines = fs.readFileSync(filename, 'utf-8').split('\n'); //lines huge array of every line in input file
var at = '@'; 
var labelnum = '-1';
function updateLabelNumber() {
    var fullstring = 'label'; //in Hack asm, feature called labels, this ensures no conflicting label names
    var parsed = Number(labelnum);
    parsed = parsed + 1;
    labelnum = parsed;
    labelnum = labelnum.toString();
    fullstring = fullstring.concat(labelnum);
    return fullstring; 
}
function writeBuf(writeFD, instr)  {
    fs.writeSync(writeFD, instr);
    fs.writeSync(writeFD, '\r\n');  //write Line and go to new line
}
for (var i in lines) {
    var input = lines[i];  //input = input line
    input = input.trim(); //eradicate spaces
    if (input[0] == '/' || input.length == 0) {  //get rid of lines that begin with comments and empty lines
        continue;
    }
    if (input.includes('/')) {
        while (input.includes('/')) {
            input = input.slice(0, -1);   //get rid of all commented code
        }
    }
    var splitline = input.split(" ");  //put input into array with space separating each line in array
    var efficient = splitline[2];
    efficient = at.concat(efficient);
    if (splitline[0] == 'push') {  //push line
        if (splitline[1] == 'constant') { //push constant (number)
            writeBuf(writeFD, efficient);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1');
            
        }
        if (splitline[1] != 'pointer') {  
            if (splitline[1] != 'static' && splitline[1] != 'temp') {
                if (splitline[1] != 'constant') {  //to make sure constant condition does not conflict
                    writeBuf(writeFD, efficient);
                    writeBuf(writeFD, 'D=A');
                    switch (splitline[1]) { 
                        case 'local': 
                            writeBuf(writeFD, '@LCL'); 
                            break;
                        case 'argument': 
                            writeBuf(writeFD, '@ARG');
                            break;
                        case 'this': 
                            writeBuf(writeFD, '@THIS');
                            break;
                        case 'that':
                            writeBuf(writeFD, '@THAT');
                            break;
                    }
                    writeBuf(writeFD, 'D=D+M');  //switch system works because local argument this and that have same lines of asm other than label.
                    writeBuf(writeFD, 'A=D');
                    writeBuf(writeFD, 'D=M');
                    writeBuf(writeFD, '@SP');
                    writeBuf(writeFD, 'A=M');
                    writeBuf(writeFD, 'M=D');
                    writeBuf(writeFD, '@SP');
                    writeBuf(writeFD, 'M=M+1'); 
                    }
                } else {
                    writeBuf(writeFD, efficient);
                    writeBuf(writeFD, 'D=A');
                    if (splitline[1] == 'temp') { //temp and static have same lines other than first line of code, dealt with here.
                        writeBuf(writeFD, '@R5');
                    }
                    if (splitline[1] == 'static') {
                        writeBuf(writeFD, '@16');
                    }
                    writeBuf(writeFD, 'D=D+A');
                    writeBuf(writeFD, 'A=D');
                    writeBuf(writeFD, 'D=M');
                    writeBuf(writeFD, '@SP');
                    writeBuf(writeFD, 'A=M');
                    writeBuf(writeFD, 'M=D');
                    writeBuf(writeFD, '@SP');
                    writeBuf(writeFD, 'M=M+1'); 
                }
            } else { //push pointer ...
                if (splitline[2] == '0') {  //pointer has to be 0 or 1.
                    writeBuf(writeFD, '@THIS'); 
                }
                if (splitline[2] == '1') {
                    writeBuf(writeFD, '@THAT');
                }
                writeBuf(writeFD, 'D=M');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'A=M');
                writeBuf(writeFD, 'M=D');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'M=M+1');
            }
    }   
//END OF CODE FOR PUSH LINES
    if (splitline[0] == 'pop') {  //pop lines:
        if (splitline[1] != 'pointer') {
            switch (splitline[1]) {
                case 'local': 
                    writeBuf(writeFD, '@LCL');
                    break;
                case 'argument': 
                    writeBuf(writeFD, '@ARG');
                    break;
                case 'this': 
                    writeBuf(writeFD, '@THIS');
                    break;
                case 'that': 
                    writeBuf(writeFD, '@THAT');
                    break;
                case 'temp': 
                    writeBuf(writeFD, '@R5');
                    writeBuf(writeFD, 'D=A');
                    break;
                case 'static': 
                    writeBuf(writeFD, '@16');
                    writeBuf(writeFD, 'D=A');
                    break;
            }
            if (splitline[1] != 'temp' && splitline[1] != 'static') {   //system same as in push lines code
                writeBuf(writeFD, 'D=M');
            }
            writeBuf(writeFD, efficient);
            writeBuf(writeFD, 'D=D+A');
            writeBuf(writeFD, '@R13');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M-1');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@R13');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');     
        } else {   //pop pointer ... same as in push line code
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M-1');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'D=M');
            if (splitline[2] == '0') {
                writeBuf(writeFD, '@THIS');
            }
            if (splitline[2] == '1') {
                writeBuf(writeFD, '@THAT');
            }
            writeBuf(writeFD, 'M=D');
        }
    }
//END OF POP LINES
    if (splitline[0] == 'add' || splitline[0] == 'sub' || splitline[0] == 'and' || splitline[0] == 'or') {  //beginning of arithmetic operations
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        switch (splitline[0]) {
            case 'add': 
                writeBuf(writeFD, 'D=D+M');
                break;
            case 'sub': 
                writeBuf(writeFD, 'D=M-D');
                break;
            case 'and': 
                writeBuf(writeFD, 'D=D&M');
                break;
            case 'or': 
                writeBuf(writeFD, 'D=D|M');
                break;
        }
        writeBuf(writeFD, 'M=D');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');  //similar to push and pop code lines.
    } 
    if (splitline[0] == 'neg' || splitline[0] == 'not') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        if (splitline[0] == 'neg') {
            writeBuf(writeFD, 'M=-D')
        }
        if (splitline[0] == 'not') {
            writeBuf(writeFD, 'M=!D');
        }
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'eq' || splitline[0] == 'gt' || splitline[0] == 'lt') {
        writeBuf(writeFD, '@SP');   
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M-D');
        var value1 = updateLabelNumber(); //must do this to make sure if multiple operations in program, not conficting label names
        writeBuf(writeFD, '@'.concat(value1));
        switch (splitline[0]) {
            case 'eq': 
                writeBuf(writeFD, 'D;JEQ');
                break;
            case 'gt': 
                writeBuf(writeFD, 'D;JGT');
                break;
            case 'lt':
                writeBuf(writeFD, 'D;JLT');
                break;
        }
        writeBuf(writeFD, 'D=0');
        var value2 = updateLabelNumber();
        writeBuf(writeFD, '@'.concat(value2));
        writeBuf(writeFD, '0;JMP');
        writeBuf(writeFD, '('.concat(value1, ')'));
        writeBuf(writeFD, 'D=-1');
        writeBuf(writeFD, '('.concat(value2, ')'));
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'M=D');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
} 