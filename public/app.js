var app = function(){
  var url = 'https://opentdb.com/api_category.php';
  var categoryArraymain = JSON.parse(localStorage.getItem('categories')) || [];
  
  if(categoryArraymain.length === 0){
    makeRequest(url, catRequestComplete);
  }else{
    populateCategories();
  }

  var categorySelector = document.getElementById('category-select');
  categorySelector.addEventListener('change', function(){
    findQuestions(categorySelector.value);
  })

  updateCounterDisplay();
}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
};

var getCorrectCount = function(){
  var total = localStorage.getItem('correctCount') || 0;
  return total;
}

var addCorrect = function(){
  var total = JSON.parse(localStorage.getItem('correctCount')) || 0;
  localStorage.setItem('correctCount', (total + 1) );
}

var resetCorrect = function(){
  localStorage.setItem('correctCount', 0);
}

var updateCounterDisplay = function(){
  var display = document.getElementById('correct-count');
  display.innerText = ("Current Streak: " + getCorrectCount());
}


var catRequestComplete = function(){
  if(this.status !== 200)return;
  var categories = this.responseText;
  localStorage.setItem('categories', categories);
  populateCategories();
};

var questionRequestComplete = function(){
  if(this.status !== 200)return;
  var questions = JSON.parse(this.responseText);
  localStorage.setItem('current-questions', JSON.stringify(questions));
  showQuestion();
};

var populateCategories = function(){
  var categoryArray = JSON.parse(localStorage.getItem('categories')).trivia_categories;
  var selectCategory = document.getElementById('category-select');
  var defaultOption = document.createElement('option');
  defaultOption.innerText = "Select a Category";
  defaultOption.value = "None";
  selectCategory.appendChild(defaultOption);

  categoryArray.forEach(function(category){
    var option = document.createElement('option');
    option.innerText = category.name;
    option.value = category.id;
    selectCategory.appendChild(option);
  })
}

var findQuestions = function(catID){
  if(catID !== 'None'){
    var url = ('https://opentdb.com/api.php?amount=5&category=' + catID + "&type=multiple");
    makeRequest(url, questionRequestComplete);
  }
}

function shuffleAnswers(answers) {
  var j, x, i;
  for (i = answers.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = answers[i - 1];
    answers[i - 1] = answers[j];
    answers[j] = x;
  }
  return answers;
}

var showQuestion = function(){
  var questions = JSON.parse(localStorage.getItem('current-questions')).results;
  var ul = document.getElementById('q-and-a');

  while(ul.firstChild){
    ul.removeChild(ul.firstChild);
  }

  var qCounter = 0;

  var answers = questions[qCounter].incorrect_answers;
  answers.push(questions[qCounter].correct_answer);
  var answersShuffled = shuffleAnswers(answers);
  

  var question = document.createElement('li');
  question.innerText = questions[qCounter].question;
  var answers = document.createElement('select');
  answers.id = 'answer-select';


  var answer0 = document.createElement('option');
  answer0.innerText = 'Select Your Answer'
  answer0.value = 'none'
  var answer1 = document.createElement('option');
  answer1.innerText = answersShuffled[0];
  answer1.value = answersShuffled[0];
  var answer2 = document.createElement('option');
  answer2.innerText = answersShuffled[1];
  answer2.value = answersShuffled[1];
  var answer3 = document.createElement('option');
  answer3.innerText = answersShuffled[2];
  answer3.value = answersShuffled[2];
  var answer4 = document.createElement('option');
  answer4.innerText = answersShuffled[3];
  answer4.value = answersShuffled[3];

  var result = document.createElement('li');

  answers.appendChild(answer0);
  answers.appendChild(answer1);
  answers.appendChild(answer2);
  answers.appendChild(answer3);
  answers.appendChild(answer4);

  ul.appendChild(question);
  ul.appendChild(answers);
  ul.appendChild(result);

  answers.addEventListener('change', function(){
    if(answers.value === questions[qCounter].correct_answer){
      document.getElementById("answer-select").disabled = true;
      result.innerText = "Correct! Select a new category";
      addCorrect();
      updateCounterDisplay();
    }else{
      result.innerText = ("Incorrect! the answer is: " + questions[qCounter].correct_answer + " |  Select a new category");
      document.getElementById("answer-select").disabled = true;

      resetCorrect();
      updateCounterDisplay();
    }
  })

}


window.addEventListener('load', app);











