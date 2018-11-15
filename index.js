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

//random pour l'ordre des question
function choisirQuestion(questions){
  return questions[Math.floor(Math.random() * questions.length)]
}

//traitement de la question pour affichage
function addQuestionToList(nouvelleQuestion, id){
  let question = {
    type: 'list',
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
        console.log(`question ${i} : ` + colours.green("Passed"))
        score++
      }else{
        console.log(`question ${i} : ` + colours.red("Failed"))
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
  })

  //en cas d'erreur, on préviens et on quitte
  .catch((err) => {
    //console.log(err.message)
    console.log(colours.red("Une erreur est survenue..."))
    process.exit()
  })
}



/* ---------------------------
      P A R A M E T R E S
----------------------------*/
// conf des paramètres
program
  .version('1.0.0')
  .option('-a --add', 'Ajouter une question - WIP')
  .option('-d --delete', 'Supprimer une question - WIP')
  //thèmes
  .option('-t --theme [themeID]', 'Choix du thème parmis : 1:Marine Japonnaise / 2:Front ouest européen / 3: Front est européen')
  .parse(process.argv)


//interraction avec la liste de question
if(program.add){
 require('./addQuestion.js').addQuestion()
}
if(program.delete){
  require('./delQuestion.js').delQuestion()
}


// Q U I Z Z
if(program.theme){
  let promise = Promise.resolve()
  //recuperation des questions
  .then(() => {
    const theme = program.theme
    if(theme >= 1 && theme <= 3) {
      let fullQuetionsList
      //recup des q sur BDD
      // then recup
      // else json
      fullQuetionsList = require('./questions.json');
      
      
      //on ramasse les questions du bon theme
      let questions = []
      for(let i = 0; i < fullQuetionsList.length; i++){
        const thisQuestion = fullQuetionsList[i]
        if(thisQuestion.theme == theme){
          questions.push(thisQuestion)
        }
      }
      return questions
    }else{
      //on balance une erreur pour forcer le programme a quitter si le theme n'est pas reconnu
      throw new Error("theme not found!")
    }
  })

  //structuration de la liste des questions a poser
  .then((questions) => {
    let numCurrentQuestion = 0
    let questionsAPoser = []

    //création du tableau de questions à poser (max 10 / min combien il y en a)
    while( numCurrentQuestion < 10 && questions.length > 0){
      let nouvelleQuestion = choisirQuestion(questions)
      //on rajoute dans la liste des questions a poser
      questionsAPoser.push(addQuestionToList(nouvelleQuestion, numCurrentQuestion))
      //on dégage la question de la liste globale
      questions.splice(questions.indexOf(nouvelleQuestion), 1)

      numCurrentQuestion++
    }

    //on sort une erreur s'il n'y a pas de questions a poser
    if(questionsAPoser.length < 1){
      throw new Error("Ce thème ne contient pas encore de question...")
    }

    return displayQuestion(questionsAPoser)
  })

  .catch((err) => {
    console.log(err.message)
    if(err.message == 'theme not found!'){
      console.log('Veuillez choisir un thème parmis \n1:Marine Japonnaise \n2:Front ouest européen \n3:Front est européen \n avec la formulation \'node ./index.js -t <num>\'')
    }
  })
}