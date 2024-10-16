import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Header from "../components/Layout/Header";
import SideBar from "../components/Layout/Sidebar";

function RootLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  const showSidebarHandler = () => {
    setShowSidebar(true);
  };

  const hideSideBarHandler = () => {
    setShowSidebar(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        hideSideBarHandler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  return (
    <>
      <Header onClick={showSidebarHandler} onLogout={logoutHandler} />

      <SideBar
        ref={sidebarRef}
        active={showSidebar}
        onClick={hideSideBarHandler}
      />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
