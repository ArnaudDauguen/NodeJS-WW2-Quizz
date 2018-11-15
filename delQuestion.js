exports.delQuestion = function delQuestion(){
    const program = require('commander');
    const inquirer = require('inquirer');
    const colours = require('colours');
    const fs = require('fs');
    let promise = Promise.resolve()
    .then(() => {
      //inputs
      return inquirer.prompt()
     })
     .then((answers) => {      
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
      let anciantQuestionList = require('./questions.json');
      anciantQuestionList.push(questionToDelete)
      writeData(anciantQuestionList)
    })
  
    .catch((err) => {
      console.log(colours.red(err.message))
    })
}