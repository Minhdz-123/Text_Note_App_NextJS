"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPageTitle } from "@/src/redux/uiSlice";

export const PageTitleProvider = ({ children }) => {
  return <>{children}</>;
};

export const usePageTitle = () => {
  const dispatch = useDispatch();
  const pageTitle = useSelector(state => state.ui?.pageTitle || "");
  const setTitle = title => dispatch(setPageTitle(title));

  return { pageTitle, setPageTitle: setTitle };
};
