class BrainFuck{
	constructor(program, options){
		this.program = this.parse(program);
		this.options = Object.assign({
			debug: false,
			pointer_wrap_around: false,
			cell_wrap_around: true,
			cell_size: 0xff,
			memory_size: 0x8000,
			clock_speed: -1,
			mem_dump: false
		}, options);
		this.buffer = "";
		this.pointer = 0;
		this.memory = [0];
		this.stack = [];
		this.pc = 0;
		for(let i = 0; i < this.options.memory_size; i++){
			this.memory[i] = 0x00;
		}
	}
	parse(program){
		let parsed_program = [];
		for(let index = 0; index < program.length; index++){
			if(typeof this.operands[program[index]] !== 'undefined'){
				parsed_program.push(this.operands[program[index]]);
			}
		}
		return parsed_program;
	}
	execute(){
		if(this.pc < this.program.length){
			let bf = this;
			if(this.options.debug){
				setInterval(function(){
					if(bf.pc >= bf.program.length){
						process.exit();
					}
					bf.stackTrace(bf.program[bf.pc](bf));
					bf.pc++;
				}, this.options.clock_speed);
			}else{
				if(this.options.clock_speed > 0){
					setInterval(function(){
						if(bf.pc >= bf.program.length){
							process.exit();
						}
						bf.program[bf.pc](bf);
						bf.pc++;
					}, this.options.clock_speed);
				}else{
					while(this.pc != this.program.length){
						bf.program[bf.pc](bf);
						bf.pc++;
					};
				}
			}
		}else{
			if(this.options.debug){
				process.stderr.write('\x1B[?25h');
			}
			process.exit();
		}
	}
	stackTrace(trace){
		if(this.options.debug){
			process.stdout.write("\u001b[2J\u001b[0;0H");
			console.log("Pointer: " + this.toHex(trace.address, this.memory.length) + " Value: " + this.toHex(trace.value, this.options.cell_size) + " PC: " + this.toHex(this.pc, this.program.length));
			console.log("Instruction: " + trace.instruction + " Address: " + this.toHex(trace.address, this.memory.length));
			console.log("\nOutput: \n\n" + this.buffer);
		}
	}
}

BrainFuck.prototype.toHex = require('./to-hex');
BrainFuck.prototype.operands = require('./operands');
BrainFuck.prototype.dump = require('./dump');

module.exports = BrainFuck;
