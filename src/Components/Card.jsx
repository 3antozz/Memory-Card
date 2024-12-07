import "../Styles/Card.css";

export default function Card({gif, onPlay}) {
    return (
        <button className='card' onClick={() => onPlay(gif.id)}>
            <img src={gif.url} alt={gif.title} draggable='false'></img>
        </button>
    );
}
