import "./styles.css";
import Grid from "./componets/grid";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>This is a web viewer for wikipedia</h1>
      <Grid></Grid>
    </div>
  );
}

export default App;
