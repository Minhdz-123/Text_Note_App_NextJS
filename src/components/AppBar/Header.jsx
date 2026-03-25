// src/components/Header.jsx
import ToggleDarkMode from "./ToggleDarkMode";
import UserMenu from "../features/users/UserMenu"; // Import UserMenu

function Header() {
  return (
    <header className="...">
      <div className="flex items-center gap-2">
        <ToggleDarkMode />
        <UserMenu />
      </div>
    </header>
  );
}
export default Header;
