import "./App.css";
import { Table, Tag } from "antd";
import React, { useState, useEffect } from "react";

function App() {
  const [getAllStatus, setGetAllStatus] = useState([]);

  useEffect(() => {
    
    fetch("https://microtechbackend.onrender.com/all-stages/")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const allData = {};

        
        data.stages.forEach(stage => {
          const serial = stage.serial_number;

          if (!allData[serial]) {
            allData[serial] = {
              serial_number: serial,
              part_name: 'nexus_top',
            };
          }

        
          allData[serial][`${stage.process.replace(/\s+/g, '_').toLowerCase()}_completed`] = stage.completed;
          allData[serial][`${stage.process.replace(/\s+/g, '_').toLowerCase()}_time`] = stage.completed_time;
        });

        const updatedData = Object.values(allData);
        setGetAllStatus(updatedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const processes = [
    "Receiving Inspection",
    "M6 Clinch Stud Assy in Sheet",
    "Earth Stud Assembly",
    "Corner Bracket Assembly",
    "Module Rail Assembly LH Riveting",
    "Module Rail Assembly RH Riveting",
    "Baffler Assembly",
    "Omega Bracket Assembly",
    "Bottom Plate M8 Clinch Stud Assy",
    "Washer Assembly in M8 Clinch",
    "Stud in Bottom Sheet",
    "Bottom Plate Riveting",
    "M4 & M6 Clinch Nut Assembly",
    "Washer Assembly in M6 Clinch Stud in Frame",
    "DYE PENETRATION",
    "CMM Inspection",
    "PDI Inspection",
    "Leak Testing",
    "Washing (Cleaning of Frame)",
    "Millipore Testing",
    "Final Inspection",
    "Packing & Dispatch",
  ];

  const columns = [
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      fixed: 'left',
      align: 'center',
      width: 150,
      render: (text) => <div style={{ padding: '10px' }}>{text}</div>,
    },
    {
      title: "Part Name",
      dataIndex: "part_name",
      key: "part_name",
      fixed: 'left',
      align: 'center',
      width: 200,
      render: (text) => <div style={{ padding: '10px' }}>{text}</div>,
    },
    ...processes.map((process) => ({
      title: process,
      key: process.replace(/\s+/g, '_').toLowerCase(),
      align: 'center',
      width: 200,
      render: (text, record) => {
        const processTimeField = `${process.replace(/\s+/g, '_').toLowerCase()}_time`;
        return (
          <>
            {record[`${process.replace(/\s+/g, '_').toLowerCase()}_completed`] ? (
              <>
                <Tag color="green">Completed</Tag>
                <div>{new Date(record[processTimeField]).toLocaleString()}</div>
              </>
            ) : (
              <Tag color="volcano">Pending</Tag>
            )}
          </>
        );
      },
    })),
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        const tags = processes.reduce((acc, process) => {
          if (record[`${process.replace(/\s+/g, '_').toLowerCase()}_completed`]) {
            acc.push(`${process} Completed`);
          }
          return acc;
        }, []);
        
        return (
          <>
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <Tag color="green" key={index}>
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
    <Table
      dataSource={getAllStatus}
      columns={columns}
      rowKey="serial_number"
      scroll={{ x: 'max-content' }}
      sticky
      style={{ padding: '10px' }}
    />
  );
}

export default App;
