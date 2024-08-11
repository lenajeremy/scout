import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import store from "./store";
import router from "./router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
