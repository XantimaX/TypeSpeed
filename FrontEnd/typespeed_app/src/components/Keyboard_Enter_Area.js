//This file is to create the KeyboardArea, where the user will be typing the words.
import React from "react"
import words from "../words/words"
import "../components/Keyboard_Enter_Area.css"
import Letter from "./letter_custom"

const Main_Style = {margin : "0 auto" , height : "200px" ,width : "600px"} //Will be used for the typing area if tailwind classes are not enough 

let KeyboardArea = function(){

    //created words_jsx which is a state. This will carry the words that will be displayed to the user
    let [words_jsx, words_jsx_setter] = React.useState([])
    let [current_word_pointer, current_word_pointer_setter] = React.useState(0)
    let [last_matched_letter_pointer, last_matched_letter_pointer_Setter] = React.useState(0)
    let [input_value, input_value_setter] = React.useState("")
    let [keys_pressed, keys_pressed_setter] = React.useState("")

    //Detecting change in the input value. This input value is the value typed by the user. Then this will be checked with the current value if it is correct or not.
    let check_input_value = function(event){
        const new_input_value = event.target.value
        input_value_setter(new_input_value)
    }

    //increment, decremenet and set to zero operations for letter pointer
    let increment_letter_pointer = function(){
        last_matched_letter_pointer_Setter((old) => old + 1)
    }
    let decrement_letter_pointer = function(value){
        last_matched_letter_pointer_Setter((old) => old ? old : old-1)
    }
    let set_letter_pointer = function(){
        last_matched_letter_pointer_Setter(0)
    }

    //increment and decrement operations for word pointer
    let increment_word_pointer = function(){
        current_word_pointer_setter((old) => old + 1)
    }
    let decrement_word_pointer = function(){
        current_word_pointer_setter((old) =>old-1)
    }

    //detect keys pressed by the user
    let track_keys = function(event) {
        const new_key = event.key
        console.log(new_key)
        keys_pressed_setter(new_key)
        let current_word_elements = words_jsx[current_word_pointer].props.children
        const input_last_char = input_value.charAt(input_value.length-1) //last character of the input
        

        if (last_matched_letter_pointer == current_word_elements.length){
            set_letter_pointer()
            increment_word_pointer()
            return
        }

        if (input_value.length < last_matched_letter_pointer){
            decrement_letter_pointer(input_last_char.length-1)
            return
        }
        
        // console.log(current_word_elements)
        const curr_char = current_word_elements[last_matched_letter_pointer].props.character //last matched character of the current word
        console.log(curr_char + " " + input_last_char)

        
        if (input_last_char == curr_char ){
            increment_letter_pointer()
        }
        
       
    }
    
    //Runs only once at the beginning
    let new_words_jsx = words.map((i) => {
       let word_jsx = []
        for (let index = 0 ; index < i.length; index++){
            const currChar = i.charAt(index);

            word_jsx = [...word_jsx, <Letter character = {currChar} correct  = {false} incorrect = {false}></Letter>]
        }
    
        

        return (
            <div className = "word pl-2">{word_jsx}</div>
        )
    })
    
    //to update the words_jsx
    let changeWordsJSX = function() {
        words_jsx_setter(new_words_jsx)
    }

    //Used to load the words on load
   React.useEffect( () => {
        window.addEventListener("load", changeWordsJSX)

        return (() =>{
            window.removeEventListener("load", changeWordsJSX)
        })
    }
   )    
    
    return(
        <>
            <div style = {Main_Style} id = "main_word_area" className = "bg-main-color flex flex-wrap ">
                {words_jsx}
            </div>
            <input type="text" id ="typing-input" autoFocus onChange={check_input_value} onKeyDown={track_keys}></input>
        </>
    )
}


export default KeyboardArea