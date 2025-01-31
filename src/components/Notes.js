import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';

const Notes = () => {
const context = useContext(noteContext);
  const {notes, setNotes} = context;
  return (
    
    <div className="container my-3">
        <div className="row">
            <h1>Your Notes</h1>
            {notes.map((note)=>{
                return <Noteitem note={note}/>
            })}
        </div>
    </div>
  )
}

export default Notes
