"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Config = {
  name: string;
  base_url: string;
  theme: string;
  features: {
    enableAppointments: boolean;
    enableChatbot: boolean;
    enablePayments: boolean;
    enableCRMModules: boolean;
  };
};

const defaultConfig: Config = {
  name: "NovaCore",
  base_url: "http://localhost:3000",
  theme: "#2563eb",
  features: {
    enableAppointments: true,
    enableChatbot: true,
    enablePayments: true,
    enableCRMModules: true,
  },
};

const ConfigContext = createContext<Config>(defaultConfig);
export const useConfig = () => useContext(ConfigContext);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from("config").select("*").eq("id", 1).single();
      if (data) setConfig(data);
      if (error) console.error("❌ Supabase Config Error:", error);
    };
    fetchConfig();
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}
