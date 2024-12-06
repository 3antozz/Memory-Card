export default function Card({gif, onPlay}) {
    return (
        <button className="card" onClick={() => onPlay(gif.id)}>
            <img src={gif.url} alt={gif.title}></img>
            <h2>{gif.title}</h2>
        </button>
    );
}
