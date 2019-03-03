const fs = require('fs');  //make filestream constant
var filename = 'projects/07/MemoryAccess/StaticTest/StaticTest.vm'; //input file name
writeFD = fs.openSync('projects/07/MemoryAccess/StaticTest/test.asm', 'w+');
var lines = fs.readFileSync(filename, 'utf-8').split('\n');
var at = '@';
var labelnum = '-1';
function updateLabelNumber() {
    var fullstring = 'label';
    var parsed = Number(labelnum);
    parsed = parsed + 1;
    labelnum = parsed;
    labelnum = labelnum.toString();
    fullstring = fullstring.concat(labelnum);
    return fullstring;
}
function writeBuf(writeFD, instr)  {
    fs.writeSync(writeFD, instr);
    fs.writeSync(writeFD, '\r\n');
}
for (var i in lines) {
    var input = lines[i];
    input = input.trim();
    if (input[0] == '/' || input.length == 0) {
        continue;
    }
    if (input.includes('/')) {
        while (input.includes('/')) {
            input = input.slice(0, -1);
        }
    }
    var splitline = input.split(" ");
    var thingy = splitline[2];
    thingy = at.concat(thingy);
    if (splitline[0] == 'push') {  //push line
        if (splitline[1] == 'constant') { //push constant (number)
            var constant = splitline[2];
            var instruction = at.concat(constant);
            writeBuf(writeFD, instruction);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1');
            
        }
        if (splitline[1] == 'local') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@LCL');
            writeBuf(writeFD, 'D=D+M');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1');   
        }
        if (splitline[1] == 'argument') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@ARG');
            writeBuf(writeFD, 'D=D+M');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1'); 
        }
        if (splitline[1] == 'this') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@THIS');
            writeBuf(writeFD, 'D=D+M');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1'); 
        }
        if (splitline[1] == 'that') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@THAT');
            writeBuf(writeFD, 'D=D+M');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1'); 
        }
        if (splitline[1] == 'temp') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@R5');
            writeBuf(writeFD, 'D=D+A');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1'); 
        }
        if (splitline[1] == 'pointer') {
            if (splitline[2] == '0') {
                writeBuf(writeFD, '@THIS');
                writeBuf(writeFD, 'D=M');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'A=M');
                writeBuf(writeFD, 'M=D');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'M=M+1');
            }
            if (splitline[2] == '1') {
                writeBuf(writeFD, '@THAT');
                writeBuf(writeFD, 'D=M');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'A=M');
                writeBuf(writeFD, 'M=D');
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'M=M+1');
            }
        }
        if (splitline[1] == 'static') {
            writeBuf(writeFD, thingy);
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, '@16');
            writeBuf(writeFD, 'D=D+A');
            writeBuf(writeFD, 'A=D');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'A=M');
            writeBuf(writeFD, 'M=D');
            writeBuf(writeFD, '@SP');
            writeBuf(writeFD, 'M=M+1'); 
        } 
    }
    if (splitline[0] == 'pop') {
        if (splitline[1] == 'local') {
            writeBuf(writeFD, '@LCL');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, thingy);
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
        }
        if (splitline[1] == 'argument') {
            writeBuf(writeFD, '@ARG');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, thingy);
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
        }
        if (splitline[1] == 'this') {
            writeBuf(writeFD, '@THIS');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, thingy);
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
        }
        if (splitline[1] == 'that') {
            writeBuf(writeFD, '@THAT');
            writeBuf(writeFD, 'D=M');
            writeBuf(writeFD, thingy);
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
        }
        if (splitline[1] == 'temp') {
            writeBuf(writeFD, '@R5');
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, thingy);
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
        }
        if (splitline[1] == 'pointer') {
            if (splitline[2] == '0') {
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'M=M-1');
                writeBuf(writeFD, 'A=M');
                writeBuf(writeFD, 'D=M');
                writeBuf(writeFD, '@THIS');
                writeBuf(writeFD, 'M=D');
            }
            if (splitline[2] == '1') {
                writeBuf(writeFD, '@SP');
                writeBuf(writeFD, 'M=M-1');
                writeBuf(writeFD, 'A=M');
                writeBuf(writeFD, 'D=M');
                writeBuf(writeFD, '@THAT');
                writeBuf(writeFD, 'M=D');
            }
        }
        if (splitline[1] == 'static') {
            writeBuf(writeFD, '@16');
            writeBuf(writeFD, 'D=A');
            writeBuf(writeFD, thingy);
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
        }
    }
    if (splitline[0] == 'add') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=D+M');
        writeBuf(writeFD, 'M=D');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'sub') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M-D');
        writeBuf(writeFD, 'M=D');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'neg') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, 'M=-D')
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'eq') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M-D');
        var value1 = updateLabelNumber();
        writeBuf(writeFD, '@'.concat(value1));
        writeBuf(writeFD, 'D;JEQ');
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
    if (splitline[0] == 'gt') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M-D');
        var value1 = updateLabelNumber();
        writeBuf(writeFD, '@'.concat(value1));
        writeBuf(writeFD, 'D;JGT');
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
    if (splitline[0] == 'lt') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M-D');
        var value1 = updateLabelNumber();
        writeBuf(writeFD, '@'.concat(value1));
        writeBuf(writeFD, 'D;JLT');
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
    if (splitline[0] == 'and') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'M=D&M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'or') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'M=D|M');
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1');
    }
    if (splitline[0] == 'not') {
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M-1');
        writeBuf(writeFD, 'A=M');
        writeBuf(writeFD, 'D=M');
        writeBuf(writeFD, 'M=!D')
        writeBuf(writeFD, '@SP');
        writeBuf(writeFD, 'M=M+1'); 
    }
    

} 