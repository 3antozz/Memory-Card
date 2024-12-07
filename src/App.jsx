import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card";
import Scoreboard from "./Components/Scoreboard";

let isFetched = false;

async function getData() {
    const data = await fetch(
        "https://api.giphy.com/v1/gifs/search?q=tits&api_key=ye59SPZvMwW370lhurUWyHjgptH7sAjG&limit=10",
        { mode: "cors" }
    );
    const fetchedData = await data.json();
    return fetchedData;
}

function App() {
    const [gifs, setGifs] = useState([]);
    const [clickedId, setClickedId] = useState([]);
    const [displayedId, setDisplayedId] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    function handleClick(selectedId) {
        const index = gifs.findIndex((element) => element.id === selectedId);
        setGifs((prev) => {
            prev[index] = { ...prev[index], isClicked: true };
            return prev;
        });
        const alreadySelected = clickedId.some((id) => selectedId === id);
        const shuffle = shuffleCards(selectedId);
        if (shuffle === true) {
            setClickedId([]);
            setScore((prev) => {
                setBestScore(prev+1);
                return 0;
            });
            return;
        }
        setDisplayedId(shuffle);
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
    }

    function shuffleAlgo(array) {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function shuffleCards(selectedId) {
        const gifsArray = gifs.slice();
        const shuffled = shuffleAlgo(gifsArray);
        const newClickedIds = clickedId.slice();
        newClickedIds.push(selectedId);
        const unclickedCard = shuffled.find(
            (gif) => !newClickedIds.includes(gif.id)
        );
        if (unclickedCard) {
            const displayed = [];
            for (let i = 0; i < 9; i++) {
                displayed.push(shuffled[i].id);
            }
            const check = displayed.every((id) => newClickedIds.includes(id));
            if (check) {
                console.log("Checked!");
                const randomIndex = Math.floor(Math.random() * 9);
                displayed[randomIndex] = unclickedCard.id;
            }
            return displayed;
        } else {
            return true;
        }
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
                const displayedIds = [];
                for (let i = 0; i < 9; i++) {
                    displayedIds.push(urls[i].id);
                }
                setDisplayedId(displayedIds);
            });
        }
    }, []);
    return (
        <>
            <Scoreboard score={score} bestScore={bestScore} />
            <div className="grid-container">
                {gifs
                    .filter((gif) => displayedId.includes(gif.id))
                    .map((element) => {
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
