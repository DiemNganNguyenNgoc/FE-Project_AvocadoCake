import "@glints/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./app/assets/css/reset.css";
import "./app/assets/css/style.css";
import "./index.css";
import "./lib/i18n/config";
import { store } from "./app/redux/store";


const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </React.StrictMode>
);
