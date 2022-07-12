import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from 'react-spring'
//import { useDrag } from 'react-use-gesture'
import './styles.css'
import Countdown from "react-countdown";

//get the subset of random words
const randomCards = (arr, size) => {
  var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}



const allitems  = [
        {kazakh: 'жаңбыр', russian: 'дождь', correct: false}, 
        {kazakh: 'жарайды', russian: 'хорошо', correct: false}, 
        {kazakh: 'көлік', russian: 'машина', correct: false}, 
        {kazakh: 'әшекей', russian: 'украшение', correct: false}, 
        {kazakh: 'дәрумен', russian: 'витамин', correct: false}, 
        {kazakh: 'жылқы', russian: 'лошадь', correct: false}, 
        {kazakh: 'тақта', russian: 'доска', correct: false}, 
        {kazakh: 'жаңғырық', russian: 'эхо', correct: false}, 
        {kazakh: 'қараңғы', russian: 'темно', correct: false}, 
        {kazakh: 'ағаш', russian: 'дерево', correct: false}, 
        {kazakh: 'аға', russian: 'брат', correct: false}, 
        {kazakh: 'орындық', russian: 'стульчик', correct: false}, 
        
        {kazakh: 'алып', russian: 'огромный', correct: false}, 
        {kazakh: 'қазақ', russian: 'казах', correct: false}, 
        {kazakh: 'тіл', russian: 'язык', correct: false}, 
        {kazakh: 'дене', russian: 'тело', correct: false}, 
        {kazakh: 'ойын', russian: 'игра', correct: false}, 
        {kazakh: 'еден', russian: 'пол', correct: false}, 

        {kazakh: 'қара', russian: 'черный', correct: false}, 
        {kazakh: 'терезе', russian: 'окно', correct: false}, 
        {kazakh: 'айна', russian: 'стекло', correct: false}, 
        {kazakh: 'кірпіш', russian: 'кирпич', correct: false}, 
        {kazakh: 'көше', russian: 'улица', correct: false}, 
        {kazakh: 'сұр', russian: 'серый', correct: false}, 
        
        {kazakh: 'көйлек', russian: 'рубашка', correct: false}, 
        {kazakh: 'қалта', russian: 'карман', correct: false}, 
        {kazakh: 'мең', russian: 'родинка', correct: false}, 
        {kazakh: 'ауру', russian: 'болезнь', correct: false}, 
        {kazakh: 'шөп', russian: 'трава', correct: false}, 
        {kazakh: 'тамақ', russian: 'еда', correct: false}, 

        {kazakh: 'көк', russian: 'синий', correct: false}, 
        {kazakh: 'сәлем', russian: 'привет', correct: false}, 
        {kazakh: 'жарық', russian: 'свет', correct: false}, 
        {kazakh: 'көзәйнек', russian: 'очки', correct: false}, 
        {kazakh: 'ерін', russian: 'губ', correct: false}, 
        {kazakh: 'пернетақта', russian: 'клавиатура', correct: false}, 

        
        
        
]




const russianWords = [
  'снег', "ветер", "светло", "тепло", "солнце", "стул", "чайник", "русский", "ассимиляция", "нация", "город",
  "кубик", "школа", "заведение", "свет", "цвет", "квадрат", "клубника", "поиск", "улыбка"
]





// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -1, scale: 1, rot: -5 + Math.random() * 10, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

let time = 10;

function Deck() {
  /*const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState()
  )
  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  const handleClick = (x, y) => {
    dispatch({ type: 'CLICK', payload: { x, y } })
  }*/

  const [date, setDate] = useState(Date.now())
  //const [seconds, setSeconds] = useState(10);
  const [items, setItems] = useState(randomCards(allitems, 20));
  //const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [gone, setGone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  
  const [props, set] = useSprings(items.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above



  React.useEffect(() => {
    const swipe = e => {
      const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : null
      if (!dir) return

      const index = (Array.from(gone).pop() || items.length) - 1
      gone.add(index)
      console.log("correct: ", dir===sides[index].correctSide)
      
      if (dir===sides[index].correctSide) {
        document.getElementById('root').style.backgroundColor = '#018001'
        setTimeout(() => {document.getElementById('root').style.backgroundColor = 'lightblue'}, 100)
      } else {
        document.getElementById('root').style.backgroundColor = '#ff6666'
        setTimeout(() => {document.getElementById('root').style.backgroundColor = 'lightblue'}, 100)
      }
      

      setItems(items.map((item, id) =>{
        if (id === index){
          return {kazakh: item.kazakh, russian: item.russian, correct: dir===sides[index].correctSide}
        }
        return item
      }))
      setScore((prev) => prev + (dir===sides[index].correctSide ? 1 : 0))
      /* setScore(items.reduce((total, item) => total+(item.correct ? 1 : 0),
                           0));*/
      console.log("score: ", score);
  
      set(i => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const x = (200 + window.innerWidth) * dir
        const rot = 10 + dir * 100 // How much the card tilts, flicking it harder makes it rotate faster
        const scale = 1.1 // Active cards lift up a bit
    


        

        return { x, rot, scale, delay: undefined, config: { friction: 50, tension: 200 } }
      })
      if (gone.size === items.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
    }
    //if (seconds !== 0) {window.addEventListener('keydown', swipe)}
    window.addEventListener('keydown', swipe)

    return () => window.removeEventListener('keydown', swipe)
  })

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity


  const restart = () => {
    window.location.reload()
  }

  const chooseSide = () => {
    return Math.floor(Math.random() * 2);
  }

  const sides = items.map((item) =>{
      const side = chooseSide()
      const randWord = russianWords[Math.floor((russianWords.length) * Math.random())];
      return {left: side===0 ? item.russian : randWord, 
              right: side!==0 ? item.russian : randWord, 
              correctSide: side===0 ? -1 : 1}
  })
  console.log(sides)
  //console.log(Date.now())



  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  if (time!==0){
  return ( 
   <>
      <h1 style={{position: "absolute", margin: "5% 20%", color: "purple"}}>SCORE: {score}</h1> 
      
      <h1 style={{position: "absolute", margin: "5% 70%", color: "purple"}}>YAQIT:<Countdown date={date + 10000} renderer={({seconds})=> {
            time = seconds
            if (seconds === 0){setScore(prev => prev+1-1)}
            return <span>{seconds }</span>}} /> </h1>

          {props.map(({ x, y, rot, scale }, i) => (
            <div className='whole'>
            
            <animated.div className = 'outer' key={i} style={{ x, y }}>
              {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
              
              <animated.div className = 'inner'  style={{ transform: interpolate([rot, scale], trans) }}>
                  <span className = "side">{sides[i].left}</span>
                  <span>{items[i].kazakh}</span>
                  <span className = "side">{sides[i].right}</span>

              </animated.div>
              
            </animated.div>
          
            </div>)
          )}:<></>
      </>
      
)}
else {
  return (
  <div className = "resultdiv row">
      <h1 style={{  margin: "20px", color: "purple", width: "100wv"}}>NATIZHE:{ score}/25</h1> 
      <button style={{  color: "purple", width: "10wv"}} 
          onClick = {restart}><h1>Qaitadan</h1></button>
  </div>)
}
  
}

render(<Deck />, document.getElementById('root'))

