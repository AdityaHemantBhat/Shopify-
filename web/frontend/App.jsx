import { useState, useCallback } from "react";
import { AppProvider, Frame } from "@shopify/polaris";
import { NavMenu } from "@shopify/app-bridge-react";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { AppBridgeProvider } from "./components/providers/AppBridgeProvider.jsx";
import IndexPage from "./pages/Index.jsx";
import HistoryPage from "./pages/History.jsx";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("index");

  const handleNavigation = (page) => {
    console.log("navigating to: " + page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (currentPage == "history") {
      return <HistoryPage onNavigate={(p) => handleNavigation(p)} />;
    } else if (currentPage == "index") {
      return <IndexPage onNavigate={(p) => handleNavigation(p)} />;
    } else {
      return <IndexPage onNavigate={(p) => handleNavigation(p)} />;
    }
  };

  return (
    <AppBridgeProvider>
      <AppProvider i18n={enTranslations}>
        <Frame>
          {renderPage()}
        </Frame>
      </AppProvider>
    </AppBridgeProvider>
  );
}
