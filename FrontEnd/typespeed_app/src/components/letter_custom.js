import React from "react"

let Letter = function(props){
    let [correct, setCorrect] = React.useState(0)

    return (
        <span id = {props.id} className = {"text-text-color"}>{props.character}</span>
    )
}

export default Letter