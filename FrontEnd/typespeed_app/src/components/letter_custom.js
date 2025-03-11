import React from "react"

let Letter = function(props){
    let color = props.color
    let style = {
        color : color == 0 ? "grey" : color == 1 ? "green" : "red"
    }
    return (
        <span id = {props.id} style = {style} color = {props.color} >{props.character}</span>
    )
}

export default Letter