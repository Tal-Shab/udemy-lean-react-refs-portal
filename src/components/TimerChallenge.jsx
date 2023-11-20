import React, { useState, useRef } from 'react'
import ResultModal from './ResultModal';

//we cannot declare let timer here, because it will be shared across components 
//tip: if ypu have a value that must be managed, but is not a state - the timer had no direct impact in the UI - we only care 
//whether a timer eas started, but we don't want to update the UI when the timer is stopped - so we have a value that does not directly 
//update the UI, but we need it to not reset when the component is rerendered - than it is a sign to use refs
// keep in mind - you cannot pass ref a prop - to do that you need to use forwardRef

export default function TimerChallenge({title, targetTime}) {
  const timerRef = useRef(); //refs don't get lost when a component rerenders. that is why we are using refs and not a variable
  const dialogRef = useRef();
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);
  const timerIsActive = (timeRemaining > 0 && timeRemaining < targetTime * 1000);
  
  if(timeRemaining <= 0 ) {
    clearInterval(timerRef.current);
    dialogRef.current.open();
  }

  function handleReset() {
    setTimeRemaining(targetTime * 1000); 
    //setting the state inside the component is dangerous!
    //calling set will re render the component - and if we call it inside the component it might cause an infinite loop.
    //but here its ok since we trigger it from ResultModal.
  }

  function handleStart() {
    timerRef.current = setInterval(() => {
      setTimeRemaining( prevTimeRemaining =>  prevTimeRemaining - 10);
    }, 10);
  }

  function handleStop() {
    dialogRef.current.open();
    clearInterval(timerRef.current);
  }

  return (
    <>
    <ResultModal 
      ref={dialogRef} 
      remainingTime={timeRemaining} 
      targetTime={targetTime} 
      onReset={handleReset}/>
    <section className='challenge'>
      <h2>{title}</h2>
      <p className='challenge-time'>
        {targetTime} second{targetTime > 1 ? 's' : ''}
      </p>
      <p>
        <button onClick={timerIsActive ? handleStop : handleStart}>
          {timerIsActive ? 'Stop' : 'Start'} Challenge
        </button>
      </p>
      <p className={timerIsActive ? 'active' : undefined}>
      {timerIsActive ? 'Time is Running...' : 'Timer Inactive'}
      </p>
    </section>
    </>
  )
}


