import { useState } from "react";
import { useEffect } from "react";

import ListGroup from 'react-bootstrap/ListGroup';

import './Dashboard.css'

function HUD(props) {
    const [isShown, setIsShown] = useState(true);

    function Crosshair() {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px",
                    border: "1px solid white",
                    borderRadius: "50%",
                    transition: "opacity 0.2s",
                    color: "white",
                    zIndex: 1000
                }}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
            />
        );
    }

    // function SpellsMenu that displays 2 spells that you can think of:)
    function SpellsMenu(props) {
        return (
            <ListGroup as="ul" style={{zIndex: 1000, position: "absolute", top: "50%", left: "0%", transform: "translate(0%, -50%)", color:"white"}}>
                <ListGroup.Item as="li" key={0} style={{backgroundColor: props.hoverMode === 0 ? "lightgreen" : "transparent", color: props.hoverMode === 0 ? "black" : "lightgreen"}}>Attack 1 (1 Range, 20 Damage)</ListGroup.Item>
                <ListGroup.Item as="li" key={1} style={{backgroundColor: props.hoverMode === 1 ? "lightgreen" : "transparent", color: props.hoverMode === 1 ? "black" : "lightgreen"}}>Attack 2 (2 Range, 10 Damage)</ListGroup.Item>
            </ListGroup>
        );
    }

    function Message(props) {
        const [isVisible, setIsVisible] = useState(true);
      
        useEffect(() => {
          const timer = setTimeout(() => {
            setIsVisible(false);
          }, 5000);
      
          return () => clearTimeout(timer);
        }, []);
      
        return (
          <div className={`message ${isVisible ? 'visible' : ''}`}>
            {props.message}
          </div>
        );
      }

    function DashboardMenu(props) {
        return (
            <ListGroup as="ul" style={{zIndex: 1000, position: "absolute", top: "50%", right: "0%", transform: "translate(0%, -50%)", color:"white"}}>
                <ListGroup.Item as="li" key={0} style={{backgroundColor: "transparent", color: "lightgreen"}}>Game State: {props.gameState}</ListGroup.Item>
                <ListGroup.Item as="li" key={1} style={{backgroundColor: "transparent", color: "lightgreen"}}>Turn: {props.turn}</ListGroup.Item>
                <ListGroup.Item as="li" key={2} style={{backgroundColor: "transparent", color: "lightgreen"}}>Player: {props.playerId}</ListGroup.Item>
                <ListGroup.Item as="li" key={3} style={{backgroundColor: "transparent", color: "lightgreen"}}>Game: {props.gameId}</ListGroup.Item>
                <ListGroup.Item as="li" key={4} style={{backgroundColor: "transparent", color: "lightgreen"}}>{props.errorMessage}</ListGroup.Item>
            </ListGroup>
        );
    }

    return (
        <>
            <Crosshair />
            <SpellsMenu hoverMode={props.hoverMode} />
            <DashboardMenu playerId={props.playerId} gameId={props.gameId} errorMessage={props.errorMessage} gameState={props.gameState} turn={props.turn} />
        </>
    );

}

export default HUD;