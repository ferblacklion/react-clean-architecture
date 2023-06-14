import { Provider } from "react-redux";
import CounterView from "../../../counter/infrastructure/view/CounterView";

import { appStoreImplementation } from "../../domain/store/appStoreImplementation";

function AppView() {
  return (
    <Provider store={appStoreImplementation}>
      <CounterView />
    </Provider>
  );
}

export default AppView;
