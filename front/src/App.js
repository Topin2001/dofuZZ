import Game from './Game.js';

function App(props) {
  return (
    <Game onProgress={props.onProgress} playerId={props.playerId} gameId={props.gameId} backendUrl={props.backendUrl} />
  );
}

export default App;
