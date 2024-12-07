import "../Styles/Card.css";

export default function Card({gif, onPlay}) {
    return (
        <button className={gif.isClicked ? 'card clicked' : 'card'} onClick={() => onPlay(gif.id)}>
            <img src={gif.url} alt={gif.title} draggable='false'></img>
            <h2>{gif.title}</h2>
        </button>
    );
}
