const {log, biglog, errorlog, colorize} = require("./out");
const model = require("./model");





// FUNCIONES

exports.helpCmd = rl => {
	log('	-- Comandos --');
	log('		h | help : Muestra la ayuda con los posibles comandos.');
  	log('		list : Lista los quizzes existentes.');
  	log('		show <id> : Muestra la pregunta y la respuesta del quiz indicado.');
  	log('		add : Añade un nuevo quiz interactivamente.');
  	log('		delete <id> : Borra el quiz indicado.');
  	log('		edit <id> : Edita el quiz indicado.');
  	log('		test <id> : Prueba el quiz indicado.');
  	log('		p | play : Jugar a preguntar aleatoriamente los quizzes.');
  	log('		credits : Créditos.');
  	log('		q | quit : Sale del programa.');
  	rl.prompt();
}; 

exports.listCmd = rl => {

	model.getAll().forEach((quiz, id) => {
		log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});



	rl.prompt();
};

exports.showCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		}
		catch (error) {
			errorlog(error.message);
		}
	} 
	rl.prompt();
};

exports.addCmd = rl => {

	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize(' Introduzca una respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer} `);
			rl.prompt();
		});
	});
};

exports.deleteCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			model.deleteByIndex(id);
		}
		catch (error) {
			errorlog(error.message);
		}
	} 





	rl.prompt();
};

exports.editCmd = (rl, id) => {

	if (typeof id === "undefined") {
			errorlog(`Falta el parámetro id.`);
		} else {
			try {
				const quiz = model.getByIndex(id);

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
				rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
					process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
					rl.question(colorize(' Introduzca una respuesta: ', 'red'), answer => {
						model.update(id, question, answer);
						log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por ${question} ${colorize('=>', 'magenta')} ${answer} `);
						rl.prompt(); //Lo pongo aqui porque el comportamiento es async
					});
				});
			} catch (error) {
				errorlog(error.message);
			}
		} 
	};

exports.testCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {

			const quiz = model.getByIndex(id);

			rl.question(colorize(`Pregunta: ${quiz.question}? => `, 'red'), resp => {
				if((resp.toLowerCase().trim()) === ((quiz.answer).toLowerCase().trim())) {
					log('CORRECTO', 'green');
					
				} else {log('INCORRECTO', 'red')}
				rl.prompt();
			});



		} catch (error) {
			errorlog(error.message);
			rl.prompt();
		}
	} 
};

exports.playCmd = rl => {

	let score = 0;
	let tamano = model.count(); //Numero de preguntas que tengo
	let toBeResolved = []; // Guardo id de las preguntas que quedan
	
	model.getAll().forEach((quiz, id) => {
		toBeResolved.push(id);
	});

	const playOne = () => {

		/*
		const funccc = () => {
			for(var i in toBeResolved) {
			console.log(toBeResolved[i]);
			}
		}*/

		if (score===tamano) {
			log('No hay más preguntas', 'red');
			biglog(`Puntos finales: ${score+1}`, 'blue');
			rl.prompt();

		} else {
			let id = 0;
			const aleat = () => {
				id = toBeResolved[Math.floor(Math.random() * toBeResolved.length)];
				if(id == "x") {
					aleat();
				}
			}
			aleat();

			toBeResolved.splice(id, 1, "x");

			let quiz = model.getByIndex(id);

			rl.question(colorize(`Pregunta: ${quiz.question}? => `, 'red'), resp => {
					if((resp.toLowerCase().trim()) === ((quiz.answer).toLowerCase().trim())) {
						log('CORRECTO', 'green');
						score = score +1;
						log(`Tu puntuación es: ${score}`, 'blue');
						//log(`el id de la pregunta es: ${id}`);
						//log('los que quedan son:');
						//funccc();
						playOne();
					} else {
						log('INCORRECTO', 'red')
						biglog(`Puntos finales: ${score}`, 'blue');
						rl.prompt();
					}
					//rl.prompt();
				});


		}
	}

	playOne();

};

exports.creditsCmd = rl => {
	log("Autor de la práctica:");
	log("Roberto Guerrero Valdés", 'green');
	rl.prompt();
};

exports.quitCmd = rl => {
	rl.close();
};


