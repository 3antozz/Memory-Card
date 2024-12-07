import "../Styles/Scoreboard.css";

export default function Scoreboard({score, bestScore}) {
    return (
        <div className="scoreboard">
            <h1>Score: {score}</h1>
            <h2>Best Score: {bestScore}</h2>
        </div>
    );
}
