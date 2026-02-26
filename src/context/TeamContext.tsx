import { createContext, useContext, useState, ReactNode } from "react";

interface TeamContextType {
  team: string[];
  addToTeam: (name: string) => void;
  removeFromTeam: (name: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<string[]>([]);

  const addToTeam = (name: string) => {
    if (team.length >= 6 || team.includes(name)) return;
    setTeam([...team, name]);
  };

  const removeFromTeam = (name: string) => {
    setTeam(team.filter((p) => p !== name));
  };

  return (
    <TeamContext.Provider value={{ team, addToTeam, removeFromTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used inside TeamProvider");
  return context;
}
