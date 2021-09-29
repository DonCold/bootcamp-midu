import { useState, useEffect } from 'react'

import Notes from './components/Notes'
import Login from './components/Login'

import { setToken, submitNotes, token, getAllNotes } from './services/notes'
import { handleLogout } from './services/login'

import FormNotes from './components/FormNotes'
import Togglable from './components/Togglable'

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userSession = localStorage.getItem('user')
    if (userSession) {
      const userArray = JSON.parse(userSession)
      setUser(userArray)
      setToken(userArray.token)
    }
  }, [])

  const noteSubmit = async ({ title, content }) => {
    const noteToAddToState = {
      title,
      content
    }

    await submitNotes(noteToAddToState, { token })
    const newNotes = await getAllNotes()
    setNotes(newNotes)
  }

  return (
    <>
      {
      user
        ? <div>
            <FormNotes sendNote={noteSubmit} />
            <button onClick={() => { handleLogout(setUser) }}>Cerrar Sesion</button>
          </div>
        : <Togglable showLabel="Login" hiddenLabel="Cancelar">
            <Login setUser={ setUser } />
          </Togglable>
      }
      <Notes notes={notes} setNotes={setNotes} />
    </>
  )
}

export default NotesPage
