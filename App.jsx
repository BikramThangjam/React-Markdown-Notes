import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import { nanoid } from "nanoid"
import { onSnapshot, addDoc,  doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase"


export default function App() {

    const [notes, setNotes] = React.useState([])

    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(() => {
       const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            //Sync up our local notes array with the snapshot data
           // console.log("onSnapshot rendering");
            const notesArr = snapshot.docs.map(doc => ({  //Creating and returning new obj for each doc in docs array
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
            
       })

       return unsubscribe //cleanup function

    }, [])

    React.useEffect(()=>{
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    },[notes])

    React.useEffect(()=>{
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    //Implementing Debouncing so that it updates the text notes in db after certain miliseconds and not on evry keystroke.
    React.useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText)
            }
        },500)

        return ()=>clearTimeout(timeoutId)

    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        
       const newNoteRef =  await addDoc(notesCollection, newNote)//Adding new note to firestore db
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for (let oldNote of oldNotes){
        //         if(oldNote.id === currentNoteId){
        //             newArray.unshift({...oldNote, body: text})
        //         }else{
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })

        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }

    async function deleteNote(noteId) {
       const docRef = doc(db, "notes", noteId)
       await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />

                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                        
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
