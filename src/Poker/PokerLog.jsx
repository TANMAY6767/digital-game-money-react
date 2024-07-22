import { useState } from "react";
import stylo from './poker.module.css'
import aaudio from './cash.mp3'
import remove from './remove.mp3'
import added from './added.mp3'

function PokerLog() {
    const [players, setPlayers] = useState([]);
    const [pname, setPname] = useState("");
    const [pbal, setPbal] = useState("");


    function playSound1() {
        const audio = new Audio(aaudio); // The path relative to the public directory
        audio.play();
    }
    function playSound2() {
        const audio = new Audio(remove); // The path relative to the public directory
        audio.play();
    }
    function playSound3() {
        const audio = new Audio(added); // The path relative to the public directory
        audio.play();
    }
    


    function Addplayer() {
        if (pname.trim() !== "" && pbal.trim() !== "") {
            const capitalizedPname = pname.charAt(0).toUpperCase() + pname.slice(1);
            const NewPlayer = { name: capitalizedPname, balance: parseFloat(pbal), transaction: { amount: "", receiver: "" } };
            setPlayers(p => [...p, NewPlayer]);
            setPname("");
            setPbal("");
            playSound3();
        } else {
            window.alert("Please enter Both :-PlayerName and Balance!!");
        }
    }

    function HandlePnameChange(event) {
        setPname(event.target.value);
    }

    function HandlePbalChange(event) {
        setPbal(event.target.value);
    }

    function HandleAmountChange(event, index) {
        const newPlayers = [...players];
        newPlayers[index].transaction.amount = event.target.value;
        setPlayers(newPlayers);
    }

    function HandleReceiverChange(event, index) {
        const newPlayers = [...players];
        newPlayers[index].transaction.receiver = event.target.value;
        setPlayers(newPlayers);
    }
    function RemovePlayer(index){
        setPlayers(players.filter((player,i)=>i!==index));
        playSound2()
    }

    function Transact(senderIndex) {
        const amount = parseFloat(players[senderIndex].transaction.amount);
        const receiverName = players[senderIndex].transaction.receiver;

        if (amount <= 0 || isNaN(amount)) {
            window.alert("Please enter a valid amount!");
            return;
        }

        const senderPlayer = players[senderIndex];
        const receiverPlayer = players.find(player => player.name === receiverName);

        if (!receiverPlayer) {
            window.alert("Please select a valid receiver!");
            return;
        }

        if (senderPlayer.balance < amount) {
            window.alert("Insufficient balance!");
            return;
        }

        const updatedPlayers = players.map(player => {
            if (player.name === senderPlayer.name) {
                return { ...player, balance: player.balance - amount ,transaction: { ...player.transaction, amount: "" }};
            }
            if (player.name === receiverPlayer.name) {
                return { ...player, balance: player.balance + amount };
            }
            return player;
        });

        setPlayers(updatedPlayers);
        playSound1();
    }

    return (
        <><div className={stylo['container']}>
            <div className={stylo["header-container"]}>
                <h1 className={stylo['heading']}>Game Money</h1>
                <input
                    type="text"
                    placeholder="Player Name..."
                    value={pname}
                    onChange={HandlePnameChange}
                />
                <input
                    type="number"
                    placeholder="Balance..."
                    value={pbal}
                    onChange={HandlePbalChange}
                />
                <button className={stylo["adderBtn"]} onClick={Addplayer}>Add player</button>
            </div>
            <div className={stylo["Players-Container"]}>
                {players.map((player, index) => (
                    <div className={stylo["P-Container"]} key={index}>
                        <div className={stylo['status']}><span className={stylo["p-name"]}>{player.name}</span>
                        <span className={stylo["p-balance"]}> ${player.balance}</span></div>
                        <select
                            placeholder="Select receiver"
                            value={player.transaction.receiver}
                            onChange={event => HandleReceiverChange(event, index)}
                        >
                            <option value="" disabled>
                                Select receiver
                            </option>
                            {players
                                .filter(p => p.name !== player.name)
                                .map((p, idx) => (
                                    <option key={idx} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                        </select>
                        <input
                            className={stylo["amount"]}
                            type="number"
                            max={player.balance}
                            value={player.transaction.amount}
                            onChange={event => HandleAmountChange(event, index)}
                            placeholder="Amount"
                        />
                        <button className={stylo["sendBtn"]} onClick={() => Transact(index)}>Send money</button>
                        <button className={stylo["delBtn"]} onClick={()=>RemovePlayer(index)}>remove Player</button>
                    </div>
                ))}
            </div>
            </div>
        </>
    );
}

export default PokerLog;
