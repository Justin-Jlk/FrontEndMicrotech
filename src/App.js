import "./App.css";
import { Table, Tag } from "antd";
import React, { useState, useEffect } from "react";

function App() {
  const [getAllStatus, setGetAllStatus] = useState([]);

  useEffect(() => {
    fetch("https://microtechbackend.onrender.com/get_all_stage_completions/")
      .then((response) => response.json())
      .then((data) => {
        setGetAllStatus(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const columns = [
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "Process 1",
      dataIndex: "qr1_completed_time",
      key: "qr1_completed_time",
      render: (text) => (
        <>
          {text ? (
            <>
              <Tag color="green">Completed</Tag>
              <div>{new Date(text).toLocaleString()}</div>
            </>
          ) : (
            <Tag color="volcano">Pending</Tag>
          )}
        </>
      ),
    },
    {
      title: "Process 2",
      dataIndex: "qr2_completed_time",
      key: "qr2_completed_time",
      render: (text) => (
        <>
          {text ? (
            <>
              <Tag color="green">Completed</Tag>
              <div>{new Date(text).toLocaleString()}</div>
            </>
          ) : (
            <Tag color="volcano">Pending</Tag>
          )}
        </>
      ),
    },
    {
      title: "Process 3",
      dataIndex: "qr3_completed_time",
      key: "qr3_completed_time",
      render: (text) => (
        <>
          {text ? (
            <>
              <Tag color="green">Completed</Tag>
              <div>{new Date(text).toLocaleString()}</div>
            </>
          ) : (
            <Tag color="volcano">Pending</Tag>
          )}
        </>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { qr1_completed, qr2_completed, qr3_completed }) => {
        const tags = [];
        if (qr1_completed) tags.push("QR1 Completed");
        if (qr2_completed) tags.push("QR2 Completed");
        if (qr3_completed) tags.push("QR3 Completed");
        return (
          <>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Tag color="green" key={tag}>
                  {tag}
                </Tag>
              ))
            ) : (
              <Tag color="volcano">Pending</Tag>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Table dataSource={getAllStatus} columns={columns} rowKey="serial_number" />
  );
}

export default App;
