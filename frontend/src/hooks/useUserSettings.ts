import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserSettingsState {
  zaapPort: number;
  setZaapPort: (zaapPort: number) => void;
  httpPort: number;
  setHttpPort: (httpPort: number) => void;
  clientPath: string;
  setClientPath: (clientPath: string) => void;
  clientToken: string;
  setClientToken: (clientToken: string) => void;
  authIp: string;
  setAuthIp: (authIp: string) => void;
  authPort: number;
  setAuthPort: (authPort: number) => void;
}

const useUserSettings = create<UserSettingsState>()(
  persist(
    (set) => ({
      zaapPort: 28000,
      setZaapPort: (zaapPort) => set(() => ({ zaapPort })),
      httpPort: 28001,
      setHttpPort: (httpPort) => set(() => ({ httpPort })),
      clientPath: "",
      setClientPath: (clientPath) => set(() => ({ clientPath })),
      clientToken: "",
      setClientToken: (clientToken) => set(() => ({ clientToken })),
      authIp: "127.0.0.1",
      setAuthIp: (authIp) => set(() => ({ authIp })),
      authPort: 5555,
      setAuthPort: (authPort) => set(() => ({ authPort })),
    }),
    {
      name: "divazaap-user-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserSettings;
