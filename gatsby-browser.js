// gatsby-browser.js

import "./src/styles/globals.css";
import AuthProvider from "./src/components/AuthProvider";

export const wrapRootElement = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);