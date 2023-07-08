 let countsSpan = document.querySelector('.question-count span')
 let bulletsSpanContainer = document.querySelector('.bullets .spans')
 let bullets = document.querySelector(".bullets")
 let quizArea = document.querySelector(".quiz-area")
 let asnwerArea = document.querySelector(".answer-area")
 let submitButton = document.querySelector(".submit-button")
 let resultContainer = document.querySelector(".results")
 let countDownElement = document.querySelector(".countdown")
 




 
 let currentIndex=0
 let rightAnswers = 0
 let countDownInterval;
 function getQuestions()
 {
   let myRequest = new XMLHttpRequest()

    myRequest.onreadystatechange=function()
    {
        if(this.readyState === 4 && this.status===200)
        {
            
            let questionsObject = JSON.parse(this.responseText)
            let questionCount = questionsObject.length
            createBullets(questionCount)
            addQuestions(questionsObject[currentIndex],questionCount)
            countDown(5,questionCount)
            

            submitButton.onclick= ()=>
            {
                let rightAnswer = questionsObject[currentIndex].right_answer
                currentIndex++
                checkAnswer(rightAnswer,questionCount)

                quizArea.innerHTML=''
                asnwerArea.innerHTML=''
                addQuestions(questionsObject[currentIndex],questionCount)
              
                handleBullets()
                clearInterval(countDownInterval)
                countDown(5,questionCount)
                showResults(questionCount)
               
            }
        } 
    }

    myRequest.open("GET","html_questions.json",true)
    myRequest.send()
 }
 getQuestions()

 function createBullets(num)
 
 {
    countsSpan.innerHTML = num

    for(let x=0 ; x<num ; x++)
    {
        let theBullet = document.createElement("span")
        console.log(num,x)
        if(x===0)
        {
            theBullet.className = "on"
        }
      
        bulletsSpanContainer.appendChild(theBullet)
    }
 }


 function addQuestions(obj, count)
 {
   if(currentIndex <count)
   {
     //add question title
     let questionTitle = document.createElement("h3")
     let questionText = document.createTextNode(obj.title)
 
     questionTitle.appendChild(questionText)
     quizArea.appendChild(questionTitle)
 
     //add answers
 
     for(let x=1 ; x<5 ; x++)
     {
         let  maindiv = document.createElement("div")
             maindiv.className = 'answer'
 
 
         let radioInput = document.createElement("input") 
             radioInput.name='question'
             radioInput.type='radio'
             radioInput.id=`answer_${x}`
             radioInput.dataset.answer = obj[`answer_${x}`]
 
             if(x===1)
             {
                 radioInput.checked = true
             }
 
         let label = document.createElement("label")
             label.htmlFor=`answer_${x}`
         
         let labelText=document.createTextNode(obj[`answer_${x}`])
         label.appendChild(labelText)
 
 
         maindiv.appendChild(radioInput)
         maindiv.appendChild(label)
         
 
 
         asnwerArea.appendChild(maindiv)
     }
   }

 }


 function checkAnswer(rAnswer,count)
 {
    let answers = document.getElementsByName("question")
    let choosenAnswer
    for(let x = 0; x<answers.length; x++)
    {
        if(answers[x].checked)
        {
            choosenAnswer = answers[x].dataset.answer
        }
    }
    console.log("right answer "+rAnswer)
    console.log("choosenAnswer "+choosenAnswer)

    if(rAnswer===choosenAnswer){
        rightAnswers++
        console.log("good :"+rightAnswers)
    }
 }

 function handleBullets()
 {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletsSpans)
    arrayOfSpans.forEach((span,index)=>{
        console.log(span, index)
        if(currentIndex===index)
        {
            span.className='on'
        }
    })

    console.log(bulletsSpans,arrayOfSpans)
 }

 function showResults(count)
 {
    let theResults
    if(currentIndex ===count)
    {
        quizArea.remove()
        asnwerArea.remove()
        submitButton.remove()
        bullets.remove()

        if(rightAnswers > (count / 2) && rightAnswers<count)
        {
            theResults = ` <span class="good">Good</span> : ${rightAnswers} from ${count} `
        }
        else if(rightAnswers === count)
        {
            theResults = ` <span class="perfect">perfect</span> : ${rightAnswers} from ${count} `
        }
        else
        {
            theResults = ` <span class="bad">Bad</span> : ${rightAnswers} from ${count} `
        }
        console.log(theResults)
        resultContainer.innerHTML = theResults
        resultContainer.style.padding = '10px'
        resultContainer.style.backgroundColor = 'white'
        resultContainer.style.marginTop = '10px'
  
    }
 }

 function countDown(duration,qcount)
 {
    if(currentIndex < qcount)
    {
        let minutes,seconds;
        countDownInterval = setInterval(() => {

            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ?`0${seconds}`: seconds;

            console.log(minutes,seconds)
            countDownElement.innerHTML = `${minutes}: ${seconds}`

            --duration
            if(duration<0)
            {
                clearInterval(countDownInterval);
                console.log("finished")
                submitButton.click()
            }
            
        }, 1000);
    }
 }