const BrainFuck = require('./brainfuck');

let fs = require('fs');
let filename = process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;

	let program = new BrainFuck(data);

	if(process.argv.find(arg => arg === '--debug')){
		program.options.debug = true;
	}

	let exitHandler = () => {
		program.dump();
		if(program.options.debug){
			process.stderr.write('\x1B[?25h');
		}
		process.exit();
	};
	try{
		program.execute();
	}catch(e){
		console.log("\n");
		let msg = '| ! Uncaught Exception ' + e + ' ! |';
		let len = (msg).length;
		console.log(Array(len+1).join("="));
		console.log(msg);
		console.log(Array(len+1).join("="));
		console.log("Pointer: " + program.pointer);
		console.log("PC: " + program.pc);
		console.log("Stack: " + JSON.stringify(program.stack));
		console.log(Array(len+1).join("="));
		program.dump();
	}
});