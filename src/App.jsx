import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card";
import Scoreboard from "./Components/Scoreboard";

let isFetched = false;

async function getData() {
    const data = await fetch(
        "https://pixabay.com/api/?key=47508495-5a51e18d60bb21275eb142c00&q=boobs+sexy&min_height=5000&per_page=15",
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
    const [isGameOver, setGameOver] = useState(false);
    const [result, setResult] = useState(false);

    function restartGame () {
        setGameOver(false);
        setClickedId([]);
        setScore(0);
    }

    function handleClick(selectedId) {
        const alreadySelected = clickedId.some((id) => selectedId === id);
        const shuffle = shuffleCards(selectedId);
        if (shuffle === true) {
            setClickedId([]);
            setScore((prev) => {
                setBestScore(prev+1);
                return prev;
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
            setGameOver(true);
            setResult(false);
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
        const cards = document.querySelectorAll(".card")
        cards.forEach((card) => {
            card.style.animation = "none"; 
            void card.offsetWidth;
            card.style.animation = ""; 
        })
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
                const randomIndex = Math.floor(Math.random() * 9);
                displayed[randomIndex] = unclickedCard.id;
            }
            return displayed;
        } else {
            setGameOver(true);
            setResult(true);
            return true;
        }
    }

    useEffect(() => {
        if (!isFetched) {
            isFetched = true;
            getData().then((response) => {
                const urls = [];
                response.hits.forEach((gif) => {
                    urls.push({
                        id: gif.id,
                        title: gif.tags,
                        url: gif.webformatURL
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
            <dialog open={isGameOver}>
                <div style={{borderLeft: `20px solid ${result ? 'green' : 'red'}`}}>
                    <h1 style={{color: `${result ? 'green' : 'red'}`}}>You have {result ? 'Won' : 'Lost'}</h1>
                    <button onClick={restartGame}>Restart</button>
                </div>
            </dialog>
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

