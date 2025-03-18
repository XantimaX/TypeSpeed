//This file is to create the KeyboardArea, where the user will be typing the words.
import React from "react"
import "../components/Keyboard_Enter_Area.css"
import Letter from "./letter_custom"

const Main_Style = {margin : "0 auto" , height : "200px" ,width : "600px"} //Will be used for the typing area if tailwind classes are not enough 

let limit = 3 //how many incorrect letters to show up in the word


let KeyboardArea = function(){
    function add_letter(word_id, letter){
        let new_words_objects_array = word_objects_array.map((i)=>{
            if (i.word_id === word_id){
                let new_letter = { letter_id : i.letters.length, letter : letter, color : 2}
                i.letters = [...i.letters, new_letter]
            }
            return i
        })

        word_objects_array_setter(new_words_objects_array)
    }

    function changeColor(word_id, letter_id, color){
        let new_words_objects_array = word_objects_array.map((word_object) => {
            if (word_object.word_id === word_id){
                let new_letters = word_object.letters.map((letter_object) => {
                    if (letter_id === letter_object.letter_id){
                        
                        return {...letter_object, color : color}
                    }
                    return letter_object
                })
                return {...word_object, letters : new_letters}
            }
            return word_object
        })
        word_objects_array_setter(new_words_objects_array)
    }

    function is_alpha_num(input_string){
        let c = input_string.charAt(0)
        return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')
    }

    function delete_letter(word_id, letter_id){
        let new_word_objects_array = word_objects_array.map((word) => {
            if (word.word_id === word_id){
               word.letters.pop()
            }
            return word
        })
        word_objects_array_setter(new_word_objects_array)
    }

    //created words_jsx which is a state. This will carry the words that will be displayed to the user
    let [word_objects_array, word_objects_array_setter] = React.useState([])
    let [words_jsx, words_jsx_setter] = React.useState([])
    let [current_word_pointer, current_word_pointer_setter] = React.useState(0)
    let [letter_pointer, letter_pointer_setter] = React.useState(0)
    let [input_value, input_value_setter] = React.useState("")
    
    React.useEffect( () => {
        
        let api_call = async function(){
             const url = "https://random-word-api.herokuapp.com/word?number=100"
             const response = await fetch(url)
             const data = await response.json()
             let new_words_objects = []

             for (let i = 0 ; i < data.length; i++){
                new_words_objects[i] = {
                    word_id : i,
                    word : data[i],
                    letters : [] ,
                    actual_word_size : 0
                }

                for (let j = 0 ; j < data[i].length; j++){
                    new_words_objects[i].letters[j] = {
                        letter_id : j,
                        letter : data[i].charAt(j),
                        color : 0
                    }
                }
                new_words_objects[i].actual_word_size = new_words_objects[i].letters.length
             }

             word_objects_array_setter(new_words_objects)
        }
        
        api_call().catch(console.error)
    }, []
    ) 
    React.useEffect( () => {
        words_jsx_setter(() => change_words_JSX())
        
    }, [word_objects_array]
    ) 
    
    
    // let [keys_pressed, keys_pressed_setter] = React.useState("")

    //Detecting change in the input value. This input value is the value typed by the user. Then this will be checked with the current value if it is correct or not.
    let check_input_value = function(event){
        const new_input_value = event.target.value
        input_value_setter(new_input_value)
    }

    //increment letter pointer
    let increment_letter_pointer = function(){
        letter_pointer_setter((old) => old < word_objects_array[current_word_pointer].actual_word_size + limit ? old+1 : old)
    }
    let decrement_letter_pointer = function(){
        let new_value = letter_pointer-1
        changeColor(current_word_pointer, new_value, 0, words_jsx) //changing the color of letter to grey

        if (new_value === -1) {
            if (current_word_pointer === 0)
                    letter_pointer_setter(() => 0)
            else if (current_word_pointer !== 0){ 
                
                letter_pointer_setter(() => {
                    let previous_word_pointer = current_word_pointer-1
                    return words_jsx[previous_word_pointer].props.children.length
                })
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
    
            const new_key = event.key
            let current_word = word_objects_array[current_word_pointer]
            let current_letters = current_word.letters
        
            let current_letter = current_letters[letter_pointer] && current_letters[letter_pointer].letter
            
            //Backspace functionality
            if (new_key === "Backspace"){
                //if this is wrongly typed letter, remove it
                if (letter_pointer > current_word.actual_word_size) delete_letter(current_word_pointer, letter_pointer)
                decrement_letter_pointer()   
                
                return 
            }
            else if (new_key === " "){

                letter_pointer_setter(0)
                increment_word_pointer()
                return
            }
        
        if (new_key.length != 1 || !is_alpha_num(new_key)){return}
        
        
        
        
            
        
        if (!current_letter && ((letter_pointer+1) - current_word.actual_word_size  <= limit )){
            add_letter(current_word_pointer, new_key)
        }
        if(current_letter == new_key){
            changeColor(current_word_pointer, letter_pointer, 1, words_jsx) //1 -> green
        }
        else if (current_letter != new_key ){
            changeColor(current_word_pointer, letter_pointer, 2, words_jsx)
        }
        
        
        increment_letter_pointer()
        
        
    }
    
    //Runs only once at the beginning
    
    //to update the words_jsx
    
    

    let change_words_JSX = function() {
        let id = 1;

        let new_words_jsx = word_objects_array.map((i) => {
            let word_jsx = []
            let letters = i.letters;
             for (let index = 0 ; index < letters.length; index++){
                 const currChar = letters[index].letter, currID = letters[index].letter_id, color = letters[index].color;
     
                 word_jsx = [...word_jsx, <Letter id = {currID} character = {currChar} color = {color} ></Letter>]
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
            <input type="text" id ="typing-input"  autoFocus onChange={check_input_value} onKeyDown={track_keys}></input>
        </>
    )
}


export default KeyboardArea