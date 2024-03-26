import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

// const BASEURL = 'https://api.datamuse.com'
const BASEURL = 'https://api.datamuse.com/words'

function App() {
  const [sentence, setSentence] = useState('')
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const [newWord, setNewWord] = useState('')

  // test "submit"
  function changeWordOnSubmit(event: FormEvent) {
    event.preventDefault()
    setIsFormSubmitted(true)
    parseWords()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSentence(event.currentTarget.value)
  }

  function testCall() {
    axios({
      method: 'GET',
      url: BASEURL,
      params: {
        // related words
        rel_syn: sentence,
      },
    }).then((res) => {
      console.log(res, res.data)

      if (res.status === (200 || '200')) {
        if (res.data && res.data.length >= 1) {
          console.log('it exists AND there is at least one word')
          // console.log(res.data[0].word)
          setNewWord(res.data[0].word)
        } else {
          console.log('no words found')
        }
      }
    })
  }

  // parse sentence and separate sentence into words
  function parseWords() {
    console.log(sentence)
    // make sure sentence is in fact, a string
    const parsedSentence = sentence.split(' ')
    console.log(parsedSentence)
    testCall()
    // check for special characters and numbers
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

  function handleReset() {
    setIsFormSubmitted(false)
    setSentence('')
    setNewWord('')
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
        <label htmlFor="sentence">Sentence to ruin</label>
        <input type="text" id="sentence" className="border" onChange={handleChange} value={sentence} />
        {/* Show button before submission */}
        {!isFormSubmitted && <button type="submit">Let's gooooo</button>}
      </form>

      {/*  */}
      {isFormSubmitted && newWord && (
        <div>
          <button type="button" onClick={handleReset}>
            Let's gooooo again
          </button>
          <p>Success message</p>
          <p>
            {sentence} becomes {newWord}
          </p>
        </div>
      )}

      {/* Too strict, but fine for testing until real error handling is done */}
      {isFormSubmitted && sentence && (
        <div>
          <button type="button" onClick={handleReset}>
            Let's gooooo again
          </button>
          <p>Error message indicating there are no words</p>
          <p>
            Hmm... It looks like we couldn't find a replacement word for
            {sentence}
          </p>
        </div>
      )}
    </>
  )
}

export default App
