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

  const owners = states.filter(([_, state]) => state.user?.isOwner);

  if (owners.length > 0) {
    return owners.sort((a, b) => {
      const timeDiff = (a[1].user?.joinedAt || 0) - (b[1].user?.joinedAt || 0);
      return timeDiff !== 0 ? timeDiff : a[0] - b[0];
    })[0][0];
  }

  return states.sort((a, b) => {
    const timeDiff = (a[1].user?.joinedAt || 0) - (b[1].user?.joinedAt || 0);
    return timeDiff !== 0 ? timeDiff : a[0] - b[0];
  })[0][0];
};

export const isCaptain = (awareness) => {
  return awareness.clientID === getCaptainId(awareness);
};
