import React from "react";
import { PersistGate } from "redux-persist/integration/react";

export default function Provider() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
