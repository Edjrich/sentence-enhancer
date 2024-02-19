import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

// const BASEURL = 'https://api.datamuse.com'
const BASEURL = 'https://api.datamuse.com/words'

function App() {
  const [input, setInput] = useState('')
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)

  // test "submit"
  function changeWordOnSubmit(event: FormEvent) {
    event.preventDefault()
    setIsFormSubmitted(true)
    // testCall()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.currentTarget.value)
    setInput(event.currentTarget.value)
  }

  function testCall() {
    axios({
      method: 'GET',
      url: BASEURL,
      params: {
        // related words
        rel_syn: input,
      },
    }).then((res) => {
      console.log(res, res.data)
    })
  }

  //see if all criteria is met
  useEffect(() => {
    if (isFormSubmitted && Object.keys(input)) {
      console.log(isFormSubmitted)
      testCall()
      setIsFormSubmitted(false)
      setInput('')
    }
  }, [isFormSubmitted, input])

  return (
    <>
      <h1 className="text-blue-700 font-bold  text-normal">The Sentence Enhancer</h1>
      <h2 className="text-red-700 font-bold  text-normal">
        Guaranteed to uhh... Well we'll change the words for you that's the only guarantee.
      </h2>
      <form onSubmit={changeWordOnSubmit}>
        <label htmlFor="sentence">Sentence to ruin</label>
        <input type="text" id="sentence" onChange={handleChange} />
        <button type="submit">Let's gooooo</button>
      </form>
    </>
  )
}

export default App
