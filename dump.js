module.exports = function(){
	let padding = '';
	for(let x = 0; x < this.options.memory_size.toString(16).length; x++){
		padding += '0';
	}
	console.log('\nMemory dump ' + this.memory.length + ' byte(s)\n');
	for(let i = 0; i < this.memory.length; i += 16){
	let output = '0x' + (padding + i.toString(16)).substring(i.toString(16).length) + " | ";
	let str = '';
		for(let j = 0; j < 16; j++){
			if(typeof this.memory[i + j] === 'undefined'){
				output += '   ';
				str += ' ';
				continue;
			}
			output += (Array(this.options.cell_size.toString(16).length + 1).join("0") + this.memory[i + j].toString(16)).substring(this.memory[i + j].toString(16).length) + ' ';
			if(this.memory[i+j] <= 31){
				str += '.';
			}else{
				str += String.fromCharCode(this.memory[i+j]);
			}
		}
		output += "| " + str;
		console.log(output);
	};
	console.log("");
};