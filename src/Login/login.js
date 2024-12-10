import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const Login = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const onFinish = (values) => {
      setLoading(true);
      fetch("https://microtechbackend-zdib.onrender.com/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            message.success("Login successful!");
           
            localStorage.setItem("name", JSON.stringify(data.name));
            localStorage.setItem("role", JSON.stringify(data.role));
            localStorage.setItem("isAuthenticated", "true"); 
            setIsAuthenticated(true); 
            navigate("/observation"); 
          } else {
            message.error("Invalid credentials. Please try again.");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Login error:", error);
          message.error("An error occurred during login.");
          setLoading(false);
        });
    };
  
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Form
          name="login"
          onFinish={onFinish}
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Login</h2>
          <Form.Item name="user" rules={[{ required: true, message: "Please input your username!" }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  
  
  

export default Login;
