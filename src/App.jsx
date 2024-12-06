import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card";
import Scoreboard from "./Components/Scoreboard";

let isFetched = false;

async function getData() {
    const data = await fetch(
        "https://api.giphy.com/v1/gifs/search?q=tits&api_key=ye59SPZvMwW370lhurUWyHjgptH7sAjG&limit=12",
        { mode: "cors" }
    );
    const fetchedData = await data.json();
    return fetchedData;
}

function App() {
    const [gifs, setGifs] = useState([]);
    const [clickedId, setClickedId] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);


    function handleClick(selectedId) {
        const alreadySelected = clickedId.some((id) => selectedId === id);
        if (!alreadySelected) {
            setClickedId((prev) => [...prev, selectedId]);
            setScore((prev) => {
              const newScore = prev + 1;
              if (newScore > bestScore) {
                setBestScore(newScore);
              }
              return newScore;
        });
        } else {
            setClickedId([]);
            setScore(0);
        }
        console.log(score, bestScore);
    }

    useEffect(() => {
        if (!isFetched) {
            isFetched = true;
            getData().then((response) => {
                console.log(response);
                const urls = [];
                response.data.forEach((gif) => {
                    urls.push({
                        id: gif.id,
                        title: gif.title,
                        url: gif.images.fixed_width.url,
                    });
                });
                setGifs(urls);
            });
        }
    }, []);
    return (
        <>
            <Scoreboard score={score} bestScore={bestScore} />
            <div className="grid-container">
                {gifs.map((element) => {
                    return (
                        <Card
                            key={element.id}
                            gif={element}
                            onPlay={handleClick}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default App;

// api.giphy.com/v1/gifs/search&q=boobs&api_key=ye59SPZvMwW370lhurUWyHjgptH7sAjG
