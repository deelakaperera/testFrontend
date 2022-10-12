import React, { useContext } from "react";

export const IntervalMsContext = React.createContext({
  intervalMs: 1000,
  setIntervalMs: () => {},
});
