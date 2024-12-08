
let Letter = function(props){
    return (
        <span className = {`text-text-color ${props.correct && "text-green-600"}`}>{props.character}</span>
    )
}

export default Letter