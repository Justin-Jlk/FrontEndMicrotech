import React, { useState, useEffect } from "react";
import { Table, Typography, Tag, message, Spin } from "antd";

const { Title } = Typography;

const StatusChecker = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterResponse = await fetch("https://microtechbackend-zdib.onrender.com/master/");
        const response = await fetch("https://microtechbackend-zdib.onrender.com/get_stage_status/");
        

        if (!response.ok || !masterResponse.ok) {
          throw new Error("Failed to fetch data from the server");
        }

        const data = await response.json();
        const masterData = await masterResponse.json();

        if (!data || typeof data !== "object" || !masterData || typeof masterData !== "object") {
          throw new Error("Invalid data structure received");
        }

        const stages = ["Lower", "Upper", "Assemble"];
        const processedData = stages.map((stage) => {
          const stageData = data[stage];
          const masterProcesses = masterData[`${stage}Processes`] || [];

          const processes = Object.entries(stageData.process_status).map(
            ([processId, status]) => {
              const masterProcess = masterProcesses.find(
                (proc) => proc.id.toString() === processId
              );
              return {
                key: `${stage}_${processId}`,
                process: masterProcess ? masterProcess.process : `Process ${processId}`,
                totalParts: stageData.total_parts, // Inherited from stage
                usedParts: stageData.used_parts,
                completed: status.completed,
                pending: status.pending,
              };
            }
          );

          
          const [firstProcess, ...remainingProcesses] = processes;

          return {
            key: stage,
            stage,
            process: firstProcess.process,
            totalParts: stageData.total_parts,
            usedParts: stageData.used_parts,
            completed: firstProcess.completed,
            pending: firstProcess.pending,
            children: remainingProcesses,
          };
        });

        setStatusData(processedData);
        setExpandedRowKeys([processedData]); 
      } catch (error) {
        message.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      align: "left",
      render: (stage, record) => (record.children ? stage : ""),
    },
    {
      title: "Process",
      dataIndex: "process",
      key: "process",
      align: "center",
    },
    {
      title: "Total Parts",
      dataIndex: "totalParts",
      key: "totalParts",
      align: "center",
      render: (totalParts) => (totalParts),
    },
    {
      title: "Used Parts",
      dataIndex: "usedParts",
      key: "usedParts",
      align: "center",
      render: (usedParts) => (usedParts),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      align: "center",
      render: (completed) => <Tag color="green">{completed}</Tag>,
    },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
      align: "center",
      render: (pending) => <Tag color="volcano">{pending}</Tag>,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      
      {loading ? (
        
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (<>
        <Title level={3}>Status Checker</Title>
        <Table
          dataSource={statusData}
          columns={columns}
          bordered
          pagination={false}
          rowKey="key"
          style={{ marginTop: "20px" }}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              setExpandedRowKeys(expanded ? [record.key] : []);
            },
          }}

        />
        </>
      )}
    </div>
  );
};

export default StatusChecker;
