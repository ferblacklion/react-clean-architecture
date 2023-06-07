import { Provider } from "react-redux";
import CounterView from "../../counter/view/CounterView";

import { appStoreImplementation } from "../store/appStoreImplementation";

function AppView() {
  return (
    <Provider store={appStoreImplementation}>
      <CounterView />
    </Provider>
  );
}

export default AppView;
