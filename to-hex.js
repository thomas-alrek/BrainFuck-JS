module.exports = function(input, max_val){
	let padding = '';
	for(let x = 0; x < max_val.toString(16).length; x++){
		padding += '0';
	}
	return '0x' + (padding + input.toString(16)).substring(input.toString(16).length);
}