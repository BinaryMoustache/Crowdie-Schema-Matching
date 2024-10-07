import { Outlet } from "react-router-dom";
import Header from "../components/Layout/Header";
import SideBar from "../components/Layout/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RootLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const showSidebarHandler = () => {
    setShowSidebar(true);
  };

  const hideSideBarHandler = () => {
    setShowSidebar(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    
    return navigate("/auth");
  };


useEffect(() => {
  const handleClickOutside = (event) => {
    if (showSidebar && !event.target.closest('.sidebar')) {
      hideSideBarHandler();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showSidebar]);
  return (
    <>
      <Header onClick={showSidebarHandler} onLogout={logoutHandler}/>
    <SideBar active={showSidebar} onClick={hideSideBarHandler} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
