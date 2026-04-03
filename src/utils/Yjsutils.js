import * as Y from "yjs";

export const encodeSnapshot = (ydoc) => {
  const uint8 = Y.encodeStateAsUpdate(ydoc);

  const CHUNK = 8192;
  let binary = "";
  for (let i = 0; i < uint8.length; i += CHUNK) {
    binary += String.fromCharCode(...uint8.subarray(i, i + CHUNK));
  }
  return btoa(binary);
};

export const decodeSnapshot = (base64) => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

export const getCaptainId = (awareness) => {
  const states = Array.from(awareness.getStates().entries());
  if (states.length === 0) return null;

  const owner = states.find(([_, state]) => state.user?.isOwner);
  if (owner) return owner[0];

  const online = states.map(([id]) => id);
  return Math.min(...online);
};

export const isCaptain = (awareness) => {
  return awareness.clientID === getCaptainId(awareness);
};
