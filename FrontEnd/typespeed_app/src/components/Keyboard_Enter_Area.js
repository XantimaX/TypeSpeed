//This file is to create the KeyboardArea, where the user will be typing the words.
import React from "react"
import "../components/Keyboard_Enter_Area.css"
import Letter from "./letter_custom"

const Main_Style = {margin : "0 auto" , height : "200px" ,width : "600px"} //Will be used for the typing area if tailwind classes are not enough 

let KeyboardArea = function(){
    function changeColor(word_pointer, letter_pointer, color, words_jsx){
        console.log(words_jsx[word_pointer])
    }
    //created words_jsx which is a state. This will carry the words that will be displayed to the user
    let [words_array, words_setter] = React.useState([])
    let [words_jsx, words_jsx_setter] = React.useState([])
    let [current_word_pointer, current_word_pointer_setter] = React.useState(0)
    let [letter_pointer, letter_pointer_setter] = React.useState(0)
    let [input_value, input_value_setter] = React.useState("")


    React.useEffect( () => {
        
        let api_call = async function(){
             const url = "https://random-word-api.herokuapp.com/word?number=100"
             const response = await fetch(url)
             const data = await response.json()
             words_setter(data)
        }
        
        api_call().catch(console.error)
    }, []
    ) 
    React.useEffect( () => {
        words_jsx_setter(() => change_words_JSX())
        
    }, [words_array]
    ) 
    
  
    
    // let [keys_pressed, keys_pressed_setter] = React.useState("")

    //Detecting change in the input value. This input value is the value typed by the user. Then this will be checked with the current value if it is correct or not.
    let check_input_value = function(event){
        const new_input_value = event.target.value
        input_value_setter(new_input_value)
    }

    //increment letter pointer
    let increment_letter_pointer = function(){
        letter_pointer_setter((old) => words_jsx[current_word_pointer].length !== old ? old+1 : old)
    }
    let decrement_letter_pointer = function(){
        let new_value = letter_pointer-1
        console.log(`letter pointer : ${new_value}`)
        if (new_value === -1) {
            if (current_word_pointer === 0)
                    letter_pointer_setter(() => 0)
            else if (current_word_pointer !== 0){ 
                
                letter_pointer_setter(() => {
                    let previous_word_pointer = current_word_pointer-1
                    console.log(`word pointer : ${previous_word_pointer}`)
                    console.log(words_jsx[previous_word_pointer])
                    return words_jsx[previous_word_pointer].props.children.length
                })
                console.log(`letter pointer : ${new_value}`)
                decrement_word_pointer()
            }
            return
        }
        letter_pointer_setter(new_value)
    }

    //increment and decrement operations for word pointer
    let increment_word_pointer = function(){
        current_word_pointer_setter((old) => old + 1)
    }
    let decrement_word_pointer = function(){
        current_word_pointer_setter((old) => old !== 0 ? old-1 : old)
    }

    //detect keys pressed by the user
    let track_keys = function(event) {
        
        // if (letter_pointer === current_word.length){
            //     increment_word_pointer()
            //     letter_pointer_setter(() => 0)
            //     return
            // }
            
            const new_key = event.key
            
            //Backspace functionality
            if (new_key === "Backspace"){
                decrement_letter_pointer()   
                
                return
            }
            else if (new_key === " "){
                letter_pointer_setter(() => 0)
                increment_word_pointer()
                return
            }
            
        let current_word = words_jsx[current_word_pointer].props.children
        console.log(letter_pointer)
        console.log(new_key)
        
        // console.log(current_word_pointer)
        // console.log(words_jsx[current_word_pointer])
        
        
        // console.log(current_word[letter_pointer])
        // console.log(current_word[letter_pointer])
        let current_letter = current_word[letter_pointer].props.character
        
        console.log(current_letter)
        console.log(current_word[letter_pointer])
        if(current_letter == new_key){
            changeColor(current_word_pointer, letter_pointer, 1, words_jsx)
            console.log("Matched")
        }
        
        increment_letter_pointer()
        
    }
    
    //Runs only once at the beginning
    
    //to update the words_jsx
    
    

    let change_words_JSX = function() {
        let id = 1;
        let new_words_jsx = words_array.map((i) => {
            let word_jsx = []
             for (let index = 0 ; index < i.length; index++){
                 const currChar = i.charAt(index);
     
                 word_jsx = [...word_jsx, <Letter id = {index+1} character = {currChar}></Letter>]
             }
             
             return <div className="word p-1" id = {id++}>{word_jsx}</div>
            })
            return new_words_jsx
    }

    
    return(
        <>
            <div style = {Main_Style} id = "main_word_area" className = "bg-main-color flex flex-wrap" >
                {words_jsx}
            </div>
            <input type="text" id ="typing-input" autoFocus onChange={check_input_value} onKeyDown={track_keys}></input>
        </>
    )
}


export default KeyboardArea