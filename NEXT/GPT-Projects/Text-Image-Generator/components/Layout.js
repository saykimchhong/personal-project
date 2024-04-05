import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

function Layout({ children }) {
  return <div className={`${inter.className}`}>{children}</div>;
}

export default Layout;
