import { createContext, useState } from "react";

// 1️⃣ Create the context
export const CloseContext = createContext();

// 2️⃣ Create the provider component
export function CloseProvider({ children }) {
  const [able, setAble] = useState(false); 
  const [able2, setAble2] = useState(false); 
  const [SelectedJob, setSelectedJo] = useState(null); 

  return (
    // 3️⃣ Provide theme and toggle function to all child components
    <CloseContext.Provider value={{ able, setAble ,able2,setAble2,setSelectedJo,SelectedJob}}>
      {children}
    </CloseContext.Provider>
  );
}
