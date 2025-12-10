import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <span className="material-symbols-outlined text-[1.2rem] fill-current">
          dark_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-[1.2rem] fill-current">
          light_mode
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
