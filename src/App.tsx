import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import './App.css'

// const BASEURL = 'https://api.datamuse.com'
// const BASEURL = 'https://api.datamuse.com/words/'

function App() {
  const [baseURL, setBaseURL] = useState('https://api.datamuse.com/words?rel_syn=')
  const [originalSentence, setOriginalSentence] = useState('')
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const [loopComplete, setLoopComplete] = useState<boolean>(false)
  // flag to change word from most common, to least common, to a random word
  const [wordFrequency, setWordFrequency] = useState<number>(0)
  // flag to change from rel_syn to ML (expand on this later)
  const [mlSwitched, setMlSwitched] = useState<boolean>(false)
  const [tempNewSentence, setTempNewSentence] = useState<string[]>([])
  const [sassyError, setSassyError] = useState<boolean>(false)

  // test "submit"
  function changeWordOnSubmit(event: FormEvent) {
    // prevent page refresh because MUH LEGACY INTERNET
    event.preventDefault()

    // check if user has actually typed anything in. If not, sassy error.
    if (originalSentence.length === 0) {
      setSassyError(true)
    }
    // If you user has interacted submit form and try returning something
    else if (originalSentence.length > 0) {
      // remove error(s)
      setSassyError(false)
      // proceed with rest of application
      setIsFormSubmitted(true)
      parseWords()
    }
  }

  // track user input
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setOriginalSentence(event.currentTarget.value)
  }

  // toggle choice of more/less commonly used words (or random)
  function handleWordFrequency(event: ChangeEvent<HTMLInputElement>) {
    setWordFrequency(Number(event.currentTarget.value))
  }

  // handle changing from syn_rel to ML enabling true chaos
  function handleMlSwitch(event: ChangeEvent<HTMLInputElement>) {
    setMlSwitched(event.currentTarget.checked)
  }

  // change baseURL for queries when required
  useEffect(() => {
    if (mlSwitched) {
      setBaseURL(`https://api.datamuse.com/words?ml=`)
    } else {
      setBaseURL(`https://api.datamuse.com/words?rel_syn=`)
    }
  }, [mlSwitched])

  // get replacement word
  async function testCall(word: string) {
    // change to support different URLS in future
    const response = await fetch(`${baseURL}${word}`)
    const data = await response.json()

    console.log(data)

    // take first word
    if (data.length >= 1 && wordFrequency === 0) {
      // console.log(data)
      console.log(data[0].word)
      return data[0].word
    }
    // take least common word
    if (data.length >= 1 && wordFrequency === 1) {
      // console.log(data)
      // console.log(data[0].word)
      const lastWord = data.length - 1
      console.log('lastWord', lastWord)
      return data[lastWord].word
    }
    // take a random word
    else if (data.length >= 1 && wordFrequency === 2) {
      // console.log(data, 'CHAOS')
      // console.log(data.length)
      // roll random number
      // return data[0].word'
      // DOES ONE HAVE TO BE THEREERRREERERERE>???????
      const randomNumber = Math.floor(Math.floor(Math.random() * data.length))
      // console.log('randomNumber', randomNumber)
      return data[randomNumber].word
    } else {
      console.log('else')
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
    }
    console.log('loop complete')
    setLoopComplete(true)
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
    setWordFrequency(0)
    setMlSwitched(false)
    setTempNewSentence([])
  }

  // TO-DO: sanitize sentence
  // step 0: Make sure user has actually inputted at least one word
  // step 1: split sentences into individual words
  // step 2: highlight errors
  // step 3: handle names, brands, and proper nouns
  // step 4: how the fuck do curse words work?
  // step 5: handle the input of all of that hip slang
  // step 6: consider checking if the word is already used in that sentence to avoid doubles?

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
          <label htmlFor="chaos">Use less common words</label>

          <label htmlFor="chaos">Common words? 0 = Most Common 1 = Least Common 2 = RANDOM BABY</label>
          <input
            type="range"
            id="word"
            name="word"
            min={0}
            max={2}
            value={wordFrequency}
            onChange={handleWordFrequency}
          />
          <legend>Means like instead of </legend>
          <label htmlFor="ml">
            Enable chaos mode (Means like instead of syn_rel) This will handle swearwords, and change key words like
            "THE". This is often less accurate and will make your sentence sound even more broken.
          </label>
          <input type="checkbox" id="ml" name="ml" onChange={handleMlSwitch} checked={mlSwitched} />
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
            {originalSentence} becomes {tempNewSentence}
          </p>
        </div>
      )}

      {/* Errors bud */}
      {sassyError && <p>Go fuck yourself</p>}

      <footer>
        <p>Datamuse API, ect. If you are reading this, hire me.</p>
      </footer>

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
