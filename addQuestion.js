exports.addQuestion = function addQuestion(){
    const program = require('commander');
    const inquirer = require('inquirer');
    const colours = require('colours');
    const fs = require('fs');

        
    //écriture du fichier question
    function writeData(questionList){
      fs.writeFile('questions.json', JSON.stringify(questionList, null, '  '), (err) => {
        if (err) return err;
        console.log(colours.green("Question saved"))
      });
    }


    let promise = Promise.resolve()
    .then(() => {
      //inputs
      //formulaire
      inputs = [
        {
          type: 'list',
          message: 'séléctionnez le thème de la réponse',
          name:'0',
          choices: ['1', '2', '3']
        },
        {
          type: 'input',
          message: 'Veuillez entrer la question',
          name:'1'
        },
        {
          type: 'input',
          message: 'Veuillez entrer la 1ere réponse',
          name:'2'
        },
        {
          type: 'input',
          message: 'Veuillez entrer la 2nd réponse',
          name:'3'
        },
        {
          type: 'input',
          message: 'Veuillez entrer la 3eme réponse',
          name:'4'
        },
        {
          type: 'list',
          message: 'séléctionnez la bonne réponse',
          name:'5',
          choices: ['1', '2', '3']
        }
      ]
      return inputs
    })
    .then((inputs) => {
      //poser les question de formation de nouvelle question
      return inquirer.prompt(inputs)
     })
     .then((answers) => {      
      //on range les réponses
      let nouvelleQuestion = {
       "theme" : parseInt(answers[0]),
       "question" : answers[1],
       "reponses" : [answers[2], answers[3], answers[4]],
       "goodAnswer" : parseInt(answers[5][0]-1)
      }
      return nouvelleQuestion
    })
  
    .then((nouvelleQuestion) => {
      let anciantQuestionList = require('./questions.json');
      anciantQuestionList.push(nouvelleQuestion)
      writeData(anciantQuestionList)
    })
  
    .catch((err) => {
      console.log(colours.red(err.message))
    })
}