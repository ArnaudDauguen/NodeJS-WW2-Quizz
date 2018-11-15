exports.delQuestion = function delQuestion(){
    const program = require('commander');
    const inquirer = require('inquirer');
    const colours = require('colours');
    const fs = require('fs');

    let promise = Promise.resolve()
    .then(() => {
      //création d'une liste avec que les questions (pour la séléction)
      fullQuetionsList = require('./questions.json');
      let listStringQuestion = []
      for(let i = 0; i < fullQuetionsList.length; i++){
        listStringQuestion.push(`${i}///${fullQuetionsList[i].question}`)
      }

      const selectionChoix = {
        type: 'list',
        name: 'selection',
        message: 'Choisissez la question à supprimer',
        choices : listStringQuestion
      }

      return inquirer.prompt(selectionChoix)
     })
     .then((answers) => {
       console.log(answers)     
      //on range les réponses
      let questionToDelete = {
       "theme" : parseInt(answers[0]),
       "question" : answers[1],
       "reponses" : [answers[2], answers[3], answers[4]],
       "goodAnswer" : parseInt(answers[5][0]-1)
      }
      return questionToDelete
    })
  
    .then((questionToDelete) => {
      anciantQuestionList.push(questionToDelete)
      writeData(anciantQuestionList)
    })
  
    .catch((err) => {
      console.log(colours.red(err.message))
    })
}