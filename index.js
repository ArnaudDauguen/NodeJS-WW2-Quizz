#!/usr/bin/env node

// START 
console.log('Hi! Welcome to WW2 quizz')
console.log("---   Loading datas   ---")

/* ---------------------------
        I M P O R T S
----------------------------*/
const program = require('commander');
const inquirer = require('inquirer');
const colours = require('colours');
const fs = require('fs');



/* ---------------------------
      F O N C T I O N S
----------------------------*/

//consulter aide (msg)
function consulterAide(){
  console.log(colours.yellow('Veuillez consulter l\'aide, \'node ./index.js -h\''))
}
//random pour l'ordre des question
function choisirQuestion(questions){
  return questions[Math.floor(Math.random() * questions.length)]
}

//traitement de la question pour affichage
function addQuestionToList(nouvelleQuestion, id){
  let question = {
    type: 'checkbox',
    message: `\n\n\n\n\n\n\n${nouvelleQuestion.question} \n`,
    name: `${id}`,
    choices: [
      nouvelleQuestion.reponses[0],
      nouvelleQuestion.reponses[1],
      nouvelleQuestion.reponses[2]
    ],
    goodAnswer: nouvelleQuestion.goodAnswer
  }
  return question
}

//poser les questions et traitement des réponses dans la foulée
function displayQuestion(questions){
  inquirer.prompt(questions)
  .then((answers) => {
    let score = 0
    for(let i = 0; i < questions.length; i++){
      //determination de la bonne réponse
      const goodAnswer = questions[i].choices[questions[i].goodAnswer];
      const reponse = answers[`${i}`][0]

      //compararison, savoir s'il s'est gourré
      if(goodAnswer == reponse){
        console.log(`question ${i+1} : ` + colours.green("Passed"))
        score++
      }else{
        console.log(`question ${i+1} : ` + colours.red("Failed"))
      }
    }

    //calcul de la note (si > 7/10 alors gg)
    const moyenne = score / questions.length
    if(moyenne >= 0.70){
      console.log("\n check : " + colours.green("Passed"))
    }else{
      console.log("\n check : " + colours.red("Failed"))
    }

    //affichage du score
    console.log(colours.cyan("Score : ") + colours.yellow(`${score} / ${questions.length}`))
    process.exit()
  })

  //en cas d'erreur, on préviens et on quitte
  .catch((err) => {
    //console.log(err.message)
    console.log(colours.red("Une erreur est survenue..."))
    process.exit()
  })
  
}

//écriture d'un fichier
function writeDataInFile(toWrite, file){
  fs.writeFile(file, JSON.stringify(toWrite, null, '  '), (err) => {
    if (err) return colours.red(err);
  });
}



/* ---------------------------
      P A R A M E T R E S
----------------------------*/
// conf des paramètres
program
  .version('1.4.1')
  .option('-a --add ', 'Ajouter une question')
  .option('-d --delete ', 'Supprimer une question')
  .option('-t --theme [themeID]', 'Choix du thème parmis : \n\t1:Marine Japonnaise \n\t2:Front ouest européen \n\t3: Front est européen \n\tsans valeur, lancera un quizz sans thème particulier')
  .option('-b --backup ', 'Restaure le fichier \'questions - backup.json\'')
  .option('-s --save ', 'Enregistre les questions dans \'questions - backup.json\'')
  .parse(process.argv)


//detection d'aucun argument
if(!(program.theme || program.backup || program.save || program.delete || program.add)){
  consulterAide()
}

//interraction avec la liste de question
if(program.add){
 require('./addQuestion.js').addQuestion()
}
if(program.delete){
  require('./delQuestion.js').delQuestion()
}

//interraction avec le fichier de questio,
if(program.backup){
  const questionsToRestore = require('./questions - backup.json')
  writeDataInFile(questionsToRestore, 'questions.json')
  console.log(colours.green("Restoration complete"))
}
if(program.save){
  const questionsToBackup = require('./questions.json')
  writeDataInFile(questionsToBackup, 'questions - backup.json')
  console.log(colours.green("Backup done"))

}



// Q U I Z Z
if(program.theme){
  let promise = Promise.resolve()
  //recuperation des questions
  .then(() => {
    const theme = program.themeID
    if((theme >= 1 && theme <= 3) || theme == undefined) {
      let fullQuetionsList
      //recup des q sur BDD
      // then recup
      // else json
      fullQuetionsList = require('./questions.json');
      
      
      //on ramasse les questions du bon theme
      let questions = []
      //si pas de thème, alors on les prends tous
      if(theme == undefined){
        questions = fullQuetionsList
      }else{
        for(let i = 0; i < fullQuetionsList.length; i++){
          const thisQuestion = fullQuetionsList[i]
          if(thisQuestion.theme == theme){
            questions.push(thisQuestion)
          }
        }
      }
      return questions
    }
    //on balance une erreur pour forcer le programme a quitter si le theme n'a pas été reconnu
    throw new Error(colours.red('theme not found!'))
  })


  //structuration de la liste des questions a poser
  .then((questions) => {
    let numCurrentQuestion = 0
    let questionsAPoser = []

    //création du tableau de questions à poser (max 10 / min combien il y en a)
    while( numCurrentQuestion < 10 && questions.length > 0){
      let nouvelleQuestion = choisirQuestion(questions)
      //on la traite et on la rajoute dans la liste des questions a poser
      questionsAPoser.push(addQuestionToList(nouvelleQuestion, numCurrentQuestion))
      //on la dégage la question de la liste des questions potentielles
      questions.splice(questions.indexOf(nouvelleQuestion), 1)
      numCurrentQuestion++
    }

    //on sort une erreur s'il n'y a pas de questions a poser
    if(questionsAPoser.length < 5){
      throw new Error(colours.red(`Ce thème ne contient pas assez de questions (${questionsAPoser.length}/5)... \n Quizz annulé`))
    }

    //poser les questions avec résultats direct apres
    return displayQuestion(questionsAPoser)

  })

  .catch((err) => {
    console.log(err.message)
    if(err.message == colours.red('theme not found!') || err.message == colours.red('Ce thème ne contient pas assez de question... \n Quizz annulé')){
      console.log(colours.yellow('Veuillez choisir un thème parmis \n1:Marine Japonnaise \n2:Front ouest européen \n3:Front est européen \n avec la formulation \'node ./index.js -t <num>\'\n\'node ./index.js -t\' lancera un quizz sans thème particulier'))
    }

    process.exit()
  })


}
