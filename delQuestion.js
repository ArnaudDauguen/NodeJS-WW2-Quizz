exports.delQuestion = function delQuestion(){
    const program = require('commander');
    const inquirer = require('inquirer');
    const colours = require('colours');
    const fs = require('fs');

    
    //écriture du fichier question
    function writeData(questionList){
      fs.writeFile('questions.json', JSON.stringify(questionList, null, '  '), (err) => {
        if (err) return colours.red(err);
        console.log(colours.green("question removed"))
      });
    }

    let promise = Promise.resolve()
    .then(() => {
      //création d'une liste avec que les questions (pour la séléction)
      let fullQuetionsList = require('./questions.json');
      let listStringQuestion = []
      for(let i = 0; i < fullQuetionsList.length; i++){
        listStringQuestion.push(`${i+1}___thème:${fullQuetionsList[i].theme}_${fullQuetionsList[i].question}`)
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
      fullQuetionsList = require('./questions.json');
      //recup de l'id dans la phrase puis recup de la question a viré
      const idQuestionToRemove = answers.selection.split("___")[0] -1
      let questionToDelete = fullQuetionsList[idQuestionToRemove]
      //remove
      let newQuestionList = fullQuetionsList
      newQuestionList.splice(idQuestionToRemove, 1) //splice renvoie le/les items virés donc on change de variable avant
      //rewrite
      writeData(newQuestionList)
    })
  
    .catch((err) => {
      console.log(colours.red(err.message))
    })
}
