// src/components/Commons/UserMenu.jsx
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginWithGoogle, logoutAction } from "@/src/redux/userSlice";
import { iconMap } from "@/src/utils/Icon";
import IconButton from "../../Commons/IconButton";
import Dropdown from "../../Commons/Dropdown";

const UserMenu = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const status = useSelector((state) => state.user.status);

  if (!userInfo) {
    return (
      <IconButton
        icon={iconMap.google} 
        title="Đăng nhập với Google"
        onClick={() => dispatch(loginWithGoogle())}
        className="text-[#202124] dark:text-[#e8eaed] p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        size="w-10 h-10"
        loading={status === "loading"} 
      />
    );
  }


  const userOptions = [
    {
      label: "Đăng xuất",
      onClick: () => dispatch(logoutAction()),
    },
  ];

  return (
    <div className="relative">
      <Dropdown
        options={userOptions}
        width="200px"
        right="0"
        trigger={
          <img
            src={userInfo.photoURL}
            alt={userInfo.displayName}
            className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-gray-300 transition-shadow"
            title={`${userInfo.displayName} (${userInfo.email})`}
          />
        }
      />
    </div>
  );
};

export default UserMenu;
