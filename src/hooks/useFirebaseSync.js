import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";
import { setUser, clearUser } from "@/src/redux/userSlice";
import { setAllData } from "@/src/redux/noteSlice";

export const useFirebaseSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const noteState = useSelector((state) => state.note);
  const isInitialMount = useRef(true);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(userData));

        try {
          if (typeof window !== "undefined" && !window.navigator.onLine) {
            console.log("Browser is offline, skipping Firestore fetch.");
            return;
          }
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setAllData(data));
          }
        } catch (error) {
          if (error.code === 'unavailable' || error.message.includes('offline')) {
            console.log("Firestore is offline, using local data.");
          } else {
            console.error("Error fetching user data from Firestore:", error);
          }
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, "users", user.uid), {
          notes: noteState.notes,
          archived: noteState.archived,
          trash: noteState.trash,
          labels: noteState.labels,
          lastUpdated: Date.now(),
        });
        console.log("Data synced to Firestore successfully");
      } catch (error) {
        console.error("Error syncing data to Firestore:", error);
      }
    }, 2000); 

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [noteState, user]);
};
