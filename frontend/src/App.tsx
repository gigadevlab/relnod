import React from 'react';
import { tokenService } from "./api/services";
import Graph from './components/Graph';

function App() {
  const [hasToken, setHasToken] = React.useState<boolean>(false);

  React.useEffect(() => {
    tokenService({callback: (status: boolean) => setHasToken(status)});
  }, []);

  return (
    <div>
      {hasToken && <Graph/>}
    </div>
  );
}

export default App;
