import React, { useState } from 'react';
import { AiOutlineProduct, AiOutlineUser } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { MdDeleteOutline, MdOutlineQrCodeScanner } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FaBars, FaChevronLeft } from "react-icons/fa";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./layout.css";
import { Button } from "antd";
import Home from "../pages/admin/home";
import Report from "../pages/admin/report";
import Inventory from "../pages/admin/inventory";
import Deleted from "../pages/admin/deleted";
import Kirim from "../pages/operator/kirim";
import SellProduct from "../pages/operator/sell";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      {role === "admin" && (
        <aside className={isSidebarOpen ? 'open' : ''}>
          <div className="links">
            <Link
              className={location.pathname === "/" ? "active" : ""}
              to="/"
              onClick={() => setIsSidebarOpen(false)}
            >
              <AiOutlineUser />
              Админ
            </Link>
            <Link
              className={location.pathname === "/report" ? "active" : ""}
              to="/report"
              onClick={() => setIsSidebarOpen(false)}
            >
              <TbReportAnalytics />
              Oтчет
            </Link>
            <Link
              className={location.pathname === "/inventory" ? "active" : ""}
              to="/inventory"
              onClick={() => setIsSidebarOpen(false)}
            >
              <AiOutlineProduct />
              Склад
            </Link>
            <Link
              className={location.pathname === "/deleted" ? "active" : ""}
              to="/deleted"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MdDeleteOutline />
              Удаленные данные
            </Link>
          </div>
        </aside>
      )}
      <main>
        <nav>
          {role === "admin" && (
            <Button
              onClick={toggleSidebar}
              style={{ background: "#26944a" }}
              type="primary"
              className="lg:hidden"
            >
              <FaBars />
            </Button>
          )}
          <b>
            Роль:{" "}
            {role === "admin"
              ? "Админ"
              : role === "worker"
                ? "Оператор"
                : "Неизвестный"}
          </b>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                localStorage.removeItem("role");
                localStorage.removeItem("access_token");
                window.location.reload();
              }}
              style={{ background: "#26944a" }}
              type="primary"
            >
              <ImExit /> Выход
            </Button>
            {role === "worker" && location.pathname !== "/sell" ? (
              <Button
                onClick={() => navigate("/sell")}
                style={{ background: "#26944a" }}
                type="primary"
              >
                <MdOutlineQrCodeScanner />
                Продать
              </Button>
            ) : (
              role === "worker" && (
                <Button
                  onClick={() => navigate(-1)}
                  style={{ background: "#26944a" }}
                  type="primary"
                >
                  <FaChevronLeft />
                  Назад
                </Button>
              )
            )}
          </div>
        </nav>
        <div className="routes">
          <Routes>
            {role === "admin" ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<Report />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/deleted" element={<Deleted />} />
              </>
            ) : role === "worker" ? (
              <>
                <Route path="/" element={<Kirim />} />
                <Route path="/sell" element={<SellProduct />} />
              </>
            ) : (
              <p>404</p>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Layout;