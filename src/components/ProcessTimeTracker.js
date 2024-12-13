import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin } from 'antd';

const StagesComponent = () => {
  const [stagesData, setStagesData] = useState({
    Lower: [],
    Upper: [],
    Assemble: [],
  });

  const [processData, setProcessData] = useState({
    LowerProcesses: [],
    UpperProcesses: [],
    AssembleProcesses: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    Promise.all([
      fetch('https://microtechbackend-zdib.onrender.com/all_stages/').then((response) => response.json()),
      fetch('https://microtechbackend-zdib.onrender.com/master/').then((response) => response.json()),
    ])
      .then(([stagesData, processData]) => {
        setStagesData(stagesData);
        setProcessData(processData);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const formatProcessStatus = (process) => {
    return process && process.completed ? 'Completed' : 'Pending';
  };

  const aging = (aging) => {
    return aging ? aging : 'All Process Done';
  };

  const getProcessName = (processId, processes) => {
    const process = processes.find((p) => p.id === processId);
    return process ? process.process : 'All Process Done';
  };

  const generateColumns = (processes) => {
    const columns = [
      {
        title: 'Part Number',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        fixed: 'left',
        width: 150, 
      },
      {
        title: 'Last Completed Process Name',
        dataIndex: 'processName',
        key: 'processName',
        fixed: 'left',
        width: 250, // Specify width for Last Completed Process Name column
      },
      {
        title: 'Aging',
        dataIndex: 'aging',
        key: 'aging',
        fixed: 'left',
        width: 200, // Specify width for Aging column
      },
    ];
  
    processes.forEach((process) => {
      columns.push({
        title: process.process,
        dataIndex: `process${process.id}`,
        key: `process${process.id}`,
        width: 150, 
        render: (text) => (
          <Tag color={text === 'Completed' ? 'green' : 'red'}>{text}</Tag>
        ),
      });
    });
  
    return columns;
  };
  

  const generateData = (stage, processes) => {
    const data = {
      key: stage.SerialNumber,
      serialNumber: stage.SerialNumber,
      processName: getProcessName(stage.last_process_id, processes),
      aging: aging(stage.Aging),
    };

    processes.forEach((process) => {
      const processData = stage.Stage.find((p) => p.process === process.id);
      data[`process${process.id}`] = formatProcessStatus(processData);
    });

    return data;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Ageing</h2>

      <h3>LOWER</h3>
      <Table
        columns={generateColumns(processData.LowerProcesses)}
        dataSource={stagesData.Lower.map((stage) =>
          generateData(stage, processData.LowerProcesses)
        )}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <h3>UPPER</h3>
      <Table
        columns={generateColumns(processData.UpperProcesses)}
        dataSource={stagesData.Upper.map((stage) =>
          generateData(stage, processData.UpperProcesses)
        )}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <h3>ASSEMBLE</h3>
      <Table
        columns={generateColumns(processData.AssembleProcesses)}
        dataSource={stagesData.Assemble.map((stage) =>
          generateData(stage, processData.AssembleProcesses)
        )}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default StagesComponent;
