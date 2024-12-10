import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin } from 'antd';
import moment from 'moment';

const Observation = () => {
  const [stagesData, setStagesData] = useState({ Lower: [], Upper: [], Assemble: [] });
  const [processData, setProcessData] = useState({ LowerProcesses: [], UpperProcesses: [], AssembleProcesses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stageResponse = await fetch('https://microtechbackend-zdib.onrender.com/all_stages/');
        const processResponse = await fetch('https://microtechbackend-zdib.onrender.com/master/');

        if (!stageResponse.ok || !processResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const stages = await stageResponse.json();
        const processes = await processResponse.json();

        setStagesData(stages);
        setProcessData(processes);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatProcessStatus = (process) => {
    return process && process.completed ? `Completed ${process.completed_time}` : 'Pending';
  };

  const generateColumns = (processes) => {
    const columns = [
      {
        title: 'Serial Number',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        fixed: 'left',
      },
    ];

    processes.forEach((process) => {
      columns.push({
        title: process.process,
        dataIndex: `process${process.id}`,
        key: `process${process.id}`,
        render: (text) => {
          const [status, timestamp] = text.split(" ");
          const istTime = timestamp ? moment(timestamp).utcOffset("+05:30").format("YYYY-MM-DD HH:mm") : null;
          return (
            <>
              {status.includes("Completed") ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
              {istTime && <Tag color="blue">{istTime}</Tag>}
            </>
          );
        },
      });
    });

    return columns;
  };

  const generateData = (stage, processes) => {
    const data = {
      key: stage.SerialNumber,
      serialNumber: stage.SerialNumber,
    };

    processes.forEach((process) => {
      const processData = stage.Stage?.find((p) => p.process === process.id);
      data[`process${process.id}`] = formatProcessStatus(processData);
    });

    return data;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Stages Information</h2>

      <h3>LOWER</h3>
      <Table
        columns={generateColumns(processData.LowerProcesses)}
        dataSource={stagesData.Lower.map((stage) => generateData(stage, processData.LowerProcesses))}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <h3>UPPER</h3>
      <Table
        columns={generateColumns(processData.UpperProcesses)}
        dataSource={stagesData.Upper.map((stage) => generateData(stage, processData.UpperProcesses))}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <h3>ASSEMBLE</h3>
      <Table
        columns={generateColumns(processData.AssembleProcesses)}
        dataSource={stagesData.Assemble.map((stage) => generateData(stage, processData.AssembleProcesses))}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default Observation;
