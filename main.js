
const readline = require('readline');
const {log, biglog, errorlog, colorize} = require("./out");
const cmds = require("./cmds");



// Mensaje inicial

biglog('CORE Quiz', 'green');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colorize("quiz > ", 'blue'),
  completer: (line) => {
	  const completions = 'h help add delete edit list test play p credits q quit '.split(' ');
	  const hits = completions.filter((c) => c.startsWith(line));
	  // show all completions if none found
	  return [hits.length ? hits : completions, line];
  }
});

rl.prompt();

rl
.on('line', (line) => {
  
	let args = line.split(" ");
	let cmd = args[0].toLowerCase().trim();

	let param = args[1];

  	switch (cmd) {
	    case '':
	    	rl.prompt();
	    	break;

	    case 'h':
	    case 'help':
	    	cmds.helpCmd(rl);
	      	break;

	    case 'quit':
	    case 'q':
	    	cmds.quitCmd(rl);
	    	break;

	    case 'add':
	    	cmds.addCmd(rl);
	    	break;

	    case 'list':
	    	cmds.listCmd(rl);
	    	break;	

	    case 'show':
	    	cmds.showCmd(rl, param);
	    	break;	

		case 'test':
	    	cmds.testCmd(rl, param);
	    	break;

		case 'p':
		case 'play':
	    	cmds.playCmd(rl);
	    	break;

	    case 'delete':
	    	cmds.deleteCmd(rl, param);
	    	break;

	    case 'edit':
	    	cmds.editCmd(rl, param);
	    	break;

	    case 'credits':
	    	cmds.creditsCmd(rl);
	    	break;


	    default:
	    	log(`El comando '${colorize(cmd, 'red')}' no es conocido.`);
	      	log(`Utilice el comando 'help' para obtener ayuda`)
	      	rl.prompt();
	      	break;
  }
})
.on('close', () => {
 	log('Adios!');
  	process.exit(0);
});


