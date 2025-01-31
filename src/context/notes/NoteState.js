import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
   const notesInitial = [
    {
      "_id": "67935cd418cfec2aefa43586",
      "user": "67933f31fb583fb08093f070",
      "title": "My title",
      "description": "Hello Bro how are you",
      "tag": "presional",
      "date": "2025-01-24T09:26:44.880Z",
      "__v": 0
    },
    {
      "_id": "67960c636910fae638d21242",
      "user": "67933f31fb583fb08093f070",
      "title": "My title",
      "description": "Hello Bro how are you",
      "tag": "presional",
      "date": "2025-01-26T10:20:19.705Z",
      "__v": 0
    },
    {
      "_id": "679611b19f07f6a22558f7be",
      "user": "67933f31fb583fb08093f070",
      "title": "Indipandant Day",
      "description": "Hello Todat is indipandent day",
      "tag": "India",
      "date": "2025-01-26T10:42:57.249Z",
      "__v": 0
    },
    {
      "_id": "679612129f07f6a22558f7c1",
      "user": "67933f31fb583fb08093f070",
      "title": "Love Marige",
      "description": "Hello i haed love marig",
      "tag": "suseela",
      "date": "2025-01-26T10:44:34.052Z",
      "__v": 0
    }
  ]

  const [notes, setNotes] = useState(notesInitial)
    return(
        <NoteContext.Provider value={{notes, setNotes}}>
        {props.children}
    </NoteContext.Provider>
    )
}

export default NoteState;