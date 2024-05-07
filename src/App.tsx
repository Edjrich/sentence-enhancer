import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import './App.css'

function App() {
  interface DisplayedWords {
    word: string
    typo: boolean
    suggestion?: string
  }

  const [baseURL, setBaseURL] = useState('https://api.datamuse.com/words?rel_syn=')
  const [originalSentence, setOriginalSentence] = useState('')
  // TODO review if state is redundant now
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  // flag for looping over all words in a sentence
  const [loopComplete, setLoopComplete] = useState<boolean>(false)
  // flag to change word from most common, to least common, to a random word
  const [wordFrequency, setWordFrequency] = useState<number>(0)
  // flag to change from rel_syn to ML (expand on this later)
  const [mlSwitched, setMlSwitched] = useState<boolean>(false)
  // TODO rename
  const [tempNewSentence, setTempNewSentence] = useState<DisplayedWords[]>([])
  // TODO rename
  // const [replaceSuggestionCode, setReplaceSuggestionCode] = useState<number | string[]>([])
  const [sassyError, setSassyError] = useState<boolean>(false)

  // form submission
  function handleFormSubmit(event: FormEvent) {
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
    // Add additional error handling?
  }

  // track user input
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setOriginalSentence(event.currentTarget.value)
  }

  // toggle choice of more/less commonly used words (or random)
  function handleWordFrequency(event: ChangeEvent<HTMLInputElement>) {
    setWordFrequency(Number(event.currentTarget.value))
  }

  // TODO rename
  // handle changing from syn_rel to ML enabling true chaos
  function handleMlSwitch(event: ChangeEvent<HTMLInputElement>) {
    setMlSwitched(event.currentTarget.checked)
  }

  // TODO rename
  // change baseURL for queries when required
  useEffect(() => {
    if (mlSwitched) {
      setBaseURL(`https://api.datamuse.com/words?ml=`)
    } else {
      setBaseURL(`https://api.datamuse.com/words?rel_syn=`)
    }
  }, [mlSwitched])

  // test call to see if words are available to replace it

  // get replacement word
  async function testCall(word: string, typo: boolean) {
    typo = false
    // change to support different URLS in future
    const response = await fetch(`${baseURL}${word}`)
    const data = await response.json()

    // take first word (default setting)
    if (data.length >= 1 && wordFrequency === 0) {
      return { word: data[0].word, typo }
    }
    // take least common word
    else if (data.length >= 1 && wordFrequency === 1) {
      // use length of array minus 1
      const lastWord = data.length - 1
      return { word: data[lastWord].word, typo }
    }
    // take a random word
    else if (data.length >= 1 && wordFrequency === 2) {
      // roll random number inclusive of 0
      const randomNumber = Math.floor(Math.floor(Math.random() * data.length))
      return { word: data[randomNumber].word, typo }
    }
    // if no option is returned, return original word and move on
    else {
      console.log('else', word)
      const response = await fetch(`https://api.datamuse.com/sug?s=${word}`)
      // const response = await fetch(`${baseURL}${word}`)
      const data = await response.json()
      console.log('else data response', data)

      if (data.length > 0) {
        const mostCommonSuggestion = data[0].word

        // check if top returned word is same. If not, flag as possible typo.
        // While this is a fairly simple approach, it is quick light weight, and so far fairly successful
        // eventually account for words like y'all

        if (mostCommonSuggestion !== word) {
          console.log('initial suggestion is different:', data[0].word, word)
          return { word: word, typo: true, suggestion: mostCommonSuggestion }
        } else {
          console.log(
            'they are the same (this is probably a commonly used word that isnt normally replaced)',
            data[0].word,
            word
          )
          return { word: word, typo: true }
        }
      }
    }
  }

  // TODO refine this
  // async function simpleCall(word: string) {
  //   // change to support different URLS in future
  //   const response = await fetch(`https://api.datamuse.com/words?ml=${word}`)
  //   const data = await response.json()

  //   // if there is anything returned,
  //   console.log('data', data)
  //   // if nothing is return, flag as typo
  //   if (data.length >= 1) {
  //   }
  // }

  // parse sentence and separate sentence into words
  async function parseWords() {
    // TODO make sure sentence is in fact, a string
    // TODO check for special characters and numbers

    // split sentence
    const parsedSentence = originalSentence.split(' ')

    // loop over sentence
    for (let i = 0; i < parsedSentence.length; i++) {
      let wordToReplace = parsedSentence[i]
      let typo = false // Example condition to determine if it's a typo or not
      let newWord = await testCall(wordToReplace, typo)
      if (newWord) {
        setTempNewSentence((previousArray) => [...previousArray, newWord])
      }

      // check if word was not replaced
      // if (newWord === wordToReplace) {
      //   console.log('this is it!', i, newWord, wordToReplace)
      //   simpleCall(wordToReplace)
      //   // if not replaced, check if replacement is available with check test search
      //   // TODO refine how URLS are handled later
      // }
    }
    // flag for when loop is complete to show new information (this is useful because the words may not change)
    setLoopComplete(true)
  }

  // reset everything
  // TODO split into two resets one hard (like this) one soft (keep user settings)
  function handleReset() {
    setIsFormSubmitted(false)
    setOriginalSentence('')
    setLoopComplete(false)
    setWordFrequency(0)
    setMlSwitched(false)
    setTempNewSentence([])
  }

  // TODO this is purposely meta, but go over this again

  // TO-DO: sanitize sentence
  // step 0: Make sure user has actually inputted at least one word
  // step 1: split sentences into individual words
  // step 2: highlight errors
  // step 3: handle names, brands, and proper nouns
  // step 4: how the fuck do curse words work?
  // step 5: handle the input of all of that hip slang
  // step 6: consider checking if the word is already used in that sentence to avoid doubles?
  // step 7: Add note if word CAN be changed or CANT be changed if not in pure chaos mode

  // TO-DO:
  // // step 0: Display results
  // step 1: clear input after submission
  // step 2: Visible error handling
  // step 3: Some sort of simple design
  // step 4: settings for how chaotic it should get (use score)
  useEffect(() => {
    console.log(tempNewSentence)
  }, [tempNewSentence])

  return (
    <>
      <h1 className="text-blue-700 font-bold  text-normal">The Sentence Enhancer</h1>
      <h2 className="text-red-700 font-bold  text-normal">
        Guaranteed to uhh... Well we'll change the words for you that's the only guarantee.
      </h2>
      <form onSubmit={handleFormSubmit}>
        {/* settings */}
        <div>
          <legend>Frequency of use</legend>
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
        {/* consider adding detection for slang, swearing, ect */}

        <label htmlFor="originalSentence">Sentence to ruin</label>
        <input
          type="text"
          id="originalSentence"
          className="border"
          onChange={handleChange}
          value={originalSentence}
          spellCheck="true"
        />
        {/* Show button before submission */}
        {!isFormSubmitted && <button type="submit">Let's gooooo</button>}
      </form>

      {/*  */}
      {isFormSubmitted && loopComplete && (
        <div>
          <button type="button" onClick={handleReset}>
            Let's gooooo again
          </button>
          <p>{originalSentence}</p>
          <p>becomes</p>
          {/* running three maps here is stupid, but I am leaving until I refactor everything and make some real decisions */}
          <p>{tempNewSentence.map((word, index) => word.word).join(' ')}</p>
          <p>{tempNewSentence.map((word, index) => word.typo).join(' ')}</p>
          {/* if typo is true, show suggestion */}
          <p>
            It looks like this might be a mistake, did you mean
            {tempNewSentence.map((word, index) => word.suggestion).join(' ')}?
          </p>

          {/* <p>{replaceSuggestionCode}</p> */}
        </div>
      )}

      {/* Errors bud */}
      {sassyError && <p>Please enter a word</p>}

      <footer>
        <p>Datamuse API, ect. If you are reading this, hire me. This footer is here so I don't forget about it.</p>
      </footer>
    </>
  )
}

export default App
