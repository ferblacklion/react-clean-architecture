import React from "react";
import styled from "styled-components";

import Button from "../../../shared/ui/components/Button";
import Spinner from "../../../shared/ui/components/Spinner";

import { useCounterViewModel } from "../presenter/counterViewModel";
import { useCounterStoreImplementation } from "../../domain/store/counterStoreImplementation";

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
