const readlineSync = require('readline-sync');
let inputBuffer = [];

module.exports = {
	'>': function(bf) {
		bf.pointer++;
		if(bf.pointer >= bf.memory.length){
			if(bf.options.pointer_wrap_around){
				bf.pointer = 0;
			}else{
				throw new RangeError('Pointer out of range');
			}
		}
		if(isNaN(bf.pointer)){
			bf.pointer = bf.memory.length;
		}
		return { instruction: ">", address: bf.pointer, value: 0 }
	},
	'<': function(bf) {
		bf.pointer--;
		if(bf.pointer < 0){
			if(bf.options.pointer_wrap_around){
				bf.pointer = bf.memory.length - 1;
			}else{
				throw new RangeError('Pointer out of range');
			}
		}
		if(isNaN(bf.pointer)){
			bf.pointer = 0;
		}
		return { instruction: "<", address: bf.pointer, value: 0 }
	},
	'+': function(bf) {
		bf.memory[bf.pointer]++;
		if(bf.memory[bf.pointer] > bf.options.cell_size){
			if(bf.options.cell_wrap_around){
				bf.memory[bf.pointer] = 0;
			}else{
				bf.memory[bf.pointer] = bf.options.cell_size;
			}
		}
		if(isNaN(bf.memory[bf.pointer])){
			bf.memory[bf.pointer] = bf.options.cell_size;
		}
		return { instruction: "+", address: bf.pointer, value: bf.memory[bf.pointer] }
	},
	'-': function(bf) {
		bf.memory[bf.pointer]--;
		if(bf.memory[bf.pointer] < 0){
			if(bf.options.cell_wrap_around){
				bf.memory[bf.pointer] = bf.options.cell_size;
			}else{
				bf.memory[bf.pointer] = 0;
			}
		}
		if(isNaN(bf.memory[bf.pointer])){
			bf.memory[bf.pointer] = 0;
		}
		return { instruction: "-", address: bf.pointer, value: bf.memory[bf.pointer] }
	},
	'.': function(bf) {
		process.stdout.write(String.fromCharCode(bf.memory[bf.pointer]));
		bf.buffer += String.fromCharCode(bf.memory[bf.pointer]);
		return { instruction: ".", address: bf.pointer, value: bf.memory[bf.pointer] }
	},
	',': function(bf) {
		process.stderr.write('\x1B[?25h');
		let input = "";
		if(inputBuffer.length == 0){
			console.log("");
			input = readlineSync.question("");
			if(input.length > 0){
				let leftovers = input.substr(1, input.length);
				input = input[0];
				for(let i = 0; i < leftovers.length; i++){
					inputBuffer.push(leftovers[i]);
				}
			}
		}else{
			input = inputBuffer.shift();
		}
		if(input === " "){
			input = 0x20;
		}else{
			input = input.charCodeAt(0);
		}
		bf.memory[bf.pointer] = input;
		if(bf.memory[bf.pointer] > bf.options.cell_size){
			if(bf.options.cell_wrap_around){
				bf.memory[bf.pointer] = 0;
			}else{
				bf.memory[bf.pointer] = bf.options.cell_size;
			}
		}
		if(bf.memory[bf.pointer] < 0){
			if(bf.options.cell_wrap_around){
				bf.memory[bf.pointer] = bf.options.cell_size;
			}else{
				bf.memory[bf.pointer] = 0;
			}
		}
		if(isNaN(bf.memory[bf.pointer])){
			bf.memory[bf.pointer] = 0;
		}
		process.stdout.write("\x1B[2J");
		return { instruction: ",", address: bf.pointer, value: bf.memory[bf.pointer] }
	},
	'[': function(bf) {
		if(bf.memory[bf.pointer] !== 0){
			bf.stack.push(bf.pc);
                        let pc = bf.pc;
                        let loops = 0;
                        for(let index = pc; index < bf.program.length; index++){
                                let instruction = bf.program[index].name;
                                if(instruction == "["){
                                        loops++;
                                }
                                if(instruction == "]"){
                                        loops--;
                                        if(loops == 0){
                                                pc = index;
                                                break;
                                        }
                                }
                        }
                        if(loops > 0){
                                throw new SyntaxError('Open loop');
                        }
			return { instruction: "[", address: bf.pointer, value: bf.pc }
		}else{
			let pc = bf.pc;
			let loops = 0;
			for(let index = bf.pc; index < bf.program.length; index++){
				let instruction = bf.program[index].name;
				if(instruction == "["){
					loops++;
				}
				if(instruction == "]"){
					loops--;
					if(loops == 0){
						bf.pc = index;
						break;
					}
				}
			}
                        if(loops > 0){
                                throw new SyntaxError('Open loop');
                        }
			return { instruction: "[", address: bf.pc, value: 0 };
		}
	},
	']': function(bf) {
		if(bf.stack.length !== 0){
			bf.pc = bf.stack.pop() - 1;
			return { instruction: "]", address: bf.pc, value: 0 }
		}
		return { instruction: "]", address: 0, value: 0 }
	}
}
