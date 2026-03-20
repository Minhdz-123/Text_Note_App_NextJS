"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTerm } from "@/src/redux/uiSlice";

export const SearchProvider = ({ children }) => {
  return <>{children}</>;
};

export const useSearch = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.ui?.searchTerm || "");
  const setTerm = (term) => dispatch(setSearchTerm(term));

  return { searchTerm, setSearchTerm: setTerm };
};
