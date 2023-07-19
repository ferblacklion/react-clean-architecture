import React from "react";
import styled from "styled-components";

import Button from "../../../shared/ui/components/Button";
import Spinner from "../../../shared/ui/components/Spinner";

import { useCounterViewModel } from "../presenter/counterViewModel";
import { useCounterStoreImplementation } from "../../domain/store/counterStoreImplementation";
import { fetchJSON } from "fetch-json-lightweight";

const Count = styled.span`
  font-size: 1.375rem;
  min-width: 4rem;
  display: inline-block;
`;

const CounterView = () => {
  const store = useCounterStoreImplementation();
  const {
    count,
    canDecrement,
    isLoading,
    getCounter,
    incrementCounter,
    decrementCounter,
  } = useCounterViewModel(store);

  React.useEffect(() => {
    getCounter();
    console.log(
      "fetchJSON",
      fetchJSON("https://pokeapi.co/api/v2/pokemon/ditto").then((r) =>
        console.log(r.parsedBody)
      )
    );
  }, [getCounter]);

  return (
    <div className="App">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Button onClick={decrementCounter} disabled={!canDecrement}>
            dec
          </Button>
          <Count>{count}</Count>
          <Button onClick={incrementCounter}>inc</Button>
        </>
      )}
    </div>
  );
};

export default CounterView;
