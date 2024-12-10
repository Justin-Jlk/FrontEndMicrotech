import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { HomeOutlined, DashboardOutlined, SearchOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from "react-router-dom";

const { Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory(); // Use history to programmatically navigate
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear any user authentication data (e.g., from localStorage)
    localStorage.removeItem("user"); // Example: remove user data from localStorage
    // Redirect to login page
    history.push("/login"); // Assuming your login route is '/login'
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          width={250}
          theme="dark"
        >
          <div className="logo" style={{ color: "white", padding: "16px", fontSize: "24px" }}>
            My App
          </div>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<SearchOutlined />}>
              <Link to="/search">Search</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
            
            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: "#fff",
              }}
            >
              <Switch>
                <Route path="/" exact>
                  <h1>Home Page</h1>
                  <p>Content for home page.</p>
                </Route>
                <Route path="/dashboard">
                  <h1>Dashboard</h1>
                  <p>Content for dashboard page.</p>
                </Route>
                <Route path="/search">
                  <h1>Search</h1>
                  <p>Content for search page.</p>
                </Route>
                <Route path="/settings">
                  <h1>Settings</h1>
                  <p>Content for settings page.</p>
                </Route>
                <Route path="/login">
                  <h1>Login</h1>
                  <p>Login page content.</p>
                </Route>
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Sidebar;
