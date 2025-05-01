import React from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./style.css";
import App from "./components/App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <NextUIProvider>
      <ToastContainer />
      <main className="dark text-foreground bg-background min-h-screen">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
