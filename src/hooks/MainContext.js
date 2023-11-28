import React, { createContext, useState, useEffect } from "react";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") || false);

  const [cardTitle, setCardTitle] = useState("");
  const [cardProject, setCardProject] = useState("");
  const [cardPriority, setCardPriority] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardDate, setCardDate] = useState("");

  return (
    <MainContext.Provider
      value={{
        userId,
        setUserId,
        isAuth,
        setIsAuth,
        user,
        setUser,
        cardTitle,
        cardProject,
        cardPriority,
        cardDescription,
        cardDate,
        setCardTitle,
        setCardProject,
        setCardPriority,
        setCardDescription,
        setCardDate,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
