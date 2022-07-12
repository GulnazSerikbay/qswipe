import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import './styles.css'

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
        {kazakh: 'жаңбыр', russian: 'дождь'}, 
        {kazakh: 'жарайды', russian: 'хорошо'}, 
        {kazakh: 'көлік', russian: 'машина'}, 
        {kazakh: 'әшекей', russian: 'украшение'}, 
        {kazakh: 'дәрумен', russian: 'витамин'}, 
        {kazakh: 'жылқы', russian: 'лошадь'}, 
        {kazakh: 'тақта', russian: 'доска'}, 
        {kazakh: 'жаңғырық', russian: 'эхо'}, 
        {kazakh: 'қараңғы', russian: 'темно'}, 
        {kazakh: 'ағаш', russian: 'дерево'}, 
        {kazakh: 'аға', russian: 'брат'}, 
        {kazakh: 'орындық', russian: 'стульчик'}, 
]

const russianWords = [
  'снег', "ветер", "светло"
]


const items = randomCards(allitems, 10);
console.log(items)

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  
  const [props, set] = useSprings(items.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above

  React.useEffect(() => {
    const swipe = e => {
      const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : null
      if (!dir) return
      const index = (Array.from(gone).pop() || items.length) - 1
      gone.add(index)
      set(i => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const x = (200 + window.innerWidth) * dir
        const rot = 10 + dir * 100 // How much the card tilts, flicking it harder makes it rotate faster
        const scale = 1.1 // Active cards lift up a bit
        return { x, rot, scale, delay: undefined, config: { friction: 50, tension: 200 } }
      })
      if (gone.size === items.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
    }
    window.addEventListener('keydown', swipe)

    return () => window.removeEventListener('keydown', swipe)
  })

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(({ args: [index], down, movement: [mx], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === items.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })


  const chooseSide = () => {
    console.log(Math.floor(Math.random() * 2))
    return Math.floor(Math.random() * 2);
  }

  const sides = items.map((item) =>{
      const side = chooseSide()
      const randWord = russianWords[Math.floor((russianWords.length) * Math.random())];
      return {left: side===0 ? item.russian : randWord, 
              right: side!==0 ? item.russian : randWord, 
              correct: side }
  })
  console.log(sides)

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return ( 
   
      
      props.map(({ x, y, rot, scale }, i) => (
        <div className='whole row'>
        
        <animated.div className = 'outer' key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          
          <animated.div className = 'inner' {...bind(i)} style={{ transform: interpolate([rot, scale], trans) }}>
              <span className = "side">{sides[i].left}</span>
              <span>{items[i].kazakh}</span>
              <span className = "side">{sides[i].right}</span>

          </animated.div>
          
        </animated.div>
      
        </div>)
      )
      
)
  
}

render(<Deck />, document.getElementById('root'))

