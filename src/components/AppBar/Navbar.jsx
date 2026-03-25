"use client";
import { useSelector, useDispatch } from "react-redux";
import { LoginWithGoogle, Logout } from "@/src/redux/userSlice";
import { NAVBAR_ACTIONS } from "@/src/utils/Constants";
import { buildDropdownOptions } from "@/src/utils/buildDropdownOptions";
import { iconMap } from "../../utils/Icon";
import IconButton from "../Commons/IconButton";
import Dropdown from "@/src/components/Commons/Dropdown";
import useDarkMode from "@/src/hooks/useDarkMode";
import TextInput from "../Commons/TextInput";
import { useSearch } from "@/src/context/SearchContext";
import { usePageTitle } from "@/src/context/PageTitleContext";

const Navbar = ({ onToggleSidebar, onOpenShortcutModal }) => {
  const { toggleDark } = useDarkMode();
  const { setSearchTerm } = useSearch();
  const { pageTitle } = usePageTitle();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const status = useSelector((state) => state.user.status);

  const actionHandlers = {
    dark_mode: toggleDark,
    shortcut: onOpenShortcutModal,
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-[#5f6368] flex items-center px-4 justify-between z-1000 transition-colors">
      <div className="flex items-center">
        <IconButton
          icon={iconMap.menu}
          title="Trình đơn chính"
          onClick={onToggleSidebar}
        />
        {pageTitle ? (
          <span className="text-[#202124] dark:text-[#e8eaed] text-[20px] ml-2 font-medium">
            {pageTitle}
          </span>
        ) : (
          <div className="flex items-center ml-2 cursor-pointer">
            <img
              src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
              alt="Keep Logo"
              className="w-10 h-10"
            />
            <span className="text-[#5f6368] dark:text-[#e8eaed] text-[22px] ml-2 font-normal family-google-sans">
              Keep
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 max-w-180 ml-10 mr-auto">
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
            <IconButton
              icon={iconMap.search}
              title="Tìm kiếm"
              className="hover:bg-transparent w-6 h-6 dark:text-gray-400"
            />
          </div>
          <TextInput
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-full bg-[#f1f3f4] dark:bg-[#2d2e31] dark:text-[#e8eaed] border-transparent dark:border-transparent rounded-lg py-2.75 pl-14 pr-10 focus:bg-white dark:focus:bg-[#202124] focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] focus:border-transparent dark:focus:border-transparent transition-all duration-200 text-base font-['Google_Sans',Roboto,Arial,sans-serif]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {NAVBAR_ACTIONS.map((item) => {
          if (item.action === "open_dropdown" && item.dropdownKey) {
            return (
              <Dropdown
                key={item.id}
                options={buildDropdownOptions(item.dropdownKey, actionHandlers)}
                trigger={
                  <IconButton icon={iconMap[item.iconKey]} title={item.title} />
                }
              />
            );
          }
          return (
            <IconButton
              key={item.id}
              icon={iconMap[item.iconKey]}
              title={item.title}
              onClick={() => console.log(`Action: ${item.action}`)}
            />
          );
        })}

        <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
          {user ? (
            <Dropdown
              options={[
                { id: "email", title: user.email, disabled: true },
                { id: "logout", title: "Đăng xuất", onClick: () => dispatch(Logout()) },
              ]}
              trigger={
                <button title={user.displayName} className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                </button>
              }
            />
          ) : (
            <IconButton
              icon={iconMap.user || iconMap.ellipsis_vertical}
              title="Đăng nhập"
              onClick={() => dispatch(LoginWithGoogle())}
              disabled={status === "loading"}
              className={status === "loading" ? "opacity-50 cursor-not-allowed" : ""}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
