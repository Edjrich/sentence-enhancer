import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import './App.css'

// const BASEURL = 'https://api.datamuse.com'
// const BASEURL = 'https://api.datamuse.com/words/'

function App() {
  const [originalSentence, setOriginalSentence] = useState('')
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const [loopComplete, setLoopComplete] = useState<boolean>(false)
  const [checkedFrequency, setCheckedFrequency] = useState<boolean>(false)
  const [tempNewSentence, setTempNewSentence] = useState<string[]>([])

  // test "submit"
  function changeWordOnSubmit(event: FormEvent) {
    event.preventDefault()
    setIsFormSubmitted(true)
    parseWords()
  }

  // track user input
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setOriginalSentence(event.currentTarget.value)
  }

  function handleCheckedFrequency(event: ChangeEvent<HTMLInputElement>) {
    console.log('event', event.currentTarget.checked)
    setCheckedFrequency(event.currentTarget.checked)
  }

  // get replacement word
  async function testCall(word: string) {
    // change to support different URLS in future
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
    const data = await response.json()

    if (data.length >= 0 && !checkedFrequency) {
      console.log(data)
      return data[0].word
    } else if (data.length >= 0 && checkedFrequency) {
      console.log(data, 'CHAOS')
      console.log(data.length)
      // roll random number
      // return data[0].word'
      // DOES ONE HAVE TO BE THEREERRREERERERE>???????
      const randomNumber = Math.floor(Math.floor(Math.random() * data.length + 1))
      console.log('randomNumber', randomNumber)
      return data[randomNumber].word
    } else {
      return word
    }
  }

  // parse sentence and separate sentence into words
  async function parseWords() {
    console.log(originalSentence)
    // make sure sentence is in fact, a string
    const parsedSentence = originalSentence.split(' ')
    // console.log(parsedSentence)
    // console.log(parsedSentence.length)
    // let sentenceLength = parsedSentence.length

    // check for special characters and numbers

    for (let i = 0; i < parsedSentence.length; i++) {
      console.log(parsedSentence[i], i)
      let wordToReplace = parsedSentence[i]

      console.log(wordToReplace)
      // testCall(wordToReplace)

      let newWord = await testCall(wordToReplace)
      if (newWord) {
        console.log(newWord)

        setTempNewSentence((previousArray) => [...previousArray, newWord])
      }
      console.log('loop complete')
      setLoopComplete(true)
    }
  }

  useEffect(() => {
    // console.log('Form submitted status:', isFormSubmitted)
    if (isFormSubmitted) {
      console.log('Form submitted')
      // testCall()
    } else if (!isFormSubmitted) {
      console.log('now false')
    }
  }, [isFormSubmitted])

  useEffect(() => {
    // console.log('Form submitted status:', isFormSubmitted)
    // if (tempNewSentence.length > 0) {
    console.log(tempNewSentence, 'tempNewSentence')
    // }
  }, [tempNewSentence])

  function handleReset() {
    setIsFormSubmitted(false)
    setOriginalSentence('')
    setLoopComplete(false)
  }

  // TO-DO: sanitize sentence
  // step 0: Make sure user has actually inputted at least one word
  // step 1: split sentences into individual words
  // step 2: highlight errors
  // step 3: handle names, brands, and proper nouns
  // step 4: how the fuck do curse words work?
  // step 5: handle the input of all of that hip slang

  // TO-DO:
  // // step 0: Display results
  // step 1: clear input after submission
  // step 2: Visible error handling
  // step 3: Some sort of simple design
  // step 4: settings for how chaotic it should get (use score)

  return (
    <>
      <h1 className="text-blue-700 font-bold  text-normal">The Sentence Enhancer</h1>
      <h2 className="text-red-700 font-bold  text-normal">
        Guaranteed to uhh... Well we'll change the words for you that's the only guarantee.
      </h2>
      <form onSubmit={changeWordOnSubmit}>
        {/* settings */}
        <div>
          <legend>Frequency of use</legend>
          <label htmlFor="chaos">Enable chaos mode</label>
          <input type="checkbox" id="chaos" name="chaos" onChange={handleCheckedFrequency} checked={checkedFrequency} />
        </div>
        {/* consider adding setting for slang, swearing */}

        <label htmlFor="originalSentence">Sentence to ruin</label>
        <input type="text" id="originalSentence" className="border" onChange={handleChange} value={originalSentence} />
        {/* Show button before submission */}
        {!isFormSubmitted && <button type="submit">Let's gooooo</button>}
      </form>

      {/*  */}
      {isFormSubmitted && loopComplete && (
        <div>
          <button type="button" onClick={handleReset}>
            Let's gooooo again
          </button>
          {/* <p>Success message</p> */}
          <p>
            {originalSentence} becomes {tempNewSentence.map((word) => word)}
          </p>
        </div>
      )}

      {/* Too strict, but fine for testing until real error handling is done */}
      {/* {isFormSubmitted && originalSentence && (
        <div>
          <button type="button" onClick={handleReset}>
            Let's gooooo again
          </button>
          <p>Error message indicating there are no words</p>
          <p>
            Hmm... It looks like we couldn't find a replacement word for
            {originalSentence}
          </p>
        </div>
      )} */}
    </>
  )
}

export default App
