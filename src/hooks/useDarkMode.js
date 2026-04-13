import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/src/redux/uiSlice";

const useDarkMode = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.ui.isDarkMode);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = () => dispatch(toggleDarkMode());

  return { isDark, toggleDark };
};

export default useDarkMode;
