import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Observation from "../src/components/Observation";
import StatusChecker from "../src/components/StatusChecker";
import ProcessTimeTracker from "../src/components/ProcessTimeTracker";
import Login from "./Login/login";
import Logout from "./Login/logout";
import { Avatar, Layout, Menu, Spin, Typography } from "antd";
import image from "./components/assets/download.jpg"
import { HomeOutlined, SearchOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Text } = Typography;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("name");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("isAuthenticated") === "true") {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    

  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && (
          <Sider
            width={250}
            theme="dark"
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={image} alt="MicroTech Logo" style={{ width: "50px", height: "50px",paddingLeft:"5%" }} />
              <div className="logo" style={{ color: "white", padding: "16px", fontSize: "24px", marginLeft: "16px" }}>
                MicroTech<br/>
                <Text strong style={{ color: "white" }}>{userName?.name || "Narendra"}</Text>
                <br/>
                <Text style={{ color: "white" }}>{userRole?.role || "Admin"}</Text>
              </div>
             
            </div>

            <Menu theme="dark" mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/observation">Current Operation</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<SearchOutlined />}>
                <Link to="/status-checker">overall work Process(WIP)</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<SettingOutlined />}>
                <Link to="/process-timetracker">Ageing</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<LogoutOutlined />}>
                <Link to="/logout">Logout</Link>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Content style={{ margin: "16px" }}>
            <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
              <Routes>
                <Route
                  path="/login"
                  element={<Login setIsAuthenticated={handleLogin} />}
                />
                <Route
                  path="/observation"
                  element={isAuthenticated ? <Observation /> : <Navigate to="/login" />}
                />
                <Route
                  path="/status-checker"
                  element={isAuthenticated ? <StatusChecker /> : <Navigate to="/login" />}
                />
                <Route
                  path="/process-timetracker"
                  element={isAuthenticated ? <ProcessTimeTracker /> : <Navigate to="/login" />}
                />
                <Route
                  path="/logout"
                  element={<Logout setIsAuthenticated={handleLogout} />}
                />
                <Route
                  path="/"
                  element={isAuthenticated ? <Navigate to="/observation" /> : <Navigate to="/login" />}
                />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
