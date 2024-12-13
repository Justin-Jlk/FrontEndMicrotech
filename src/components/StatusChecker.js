import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Spin } from 'antd';

const StatusChecker = () => {
  const [masterData, setMasterData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setLoading(true); 


    fetch('https://microtechbackend-zdib.onrender.com/master/')
      .then(response => response.json())
      .then(data => {
        setMasterData(data);
        
      })
      .catch(error => {
        console.error('Error fetching master data:', error);
        setLoading(false); 
      });


    fetch('https://microtechbackend-zdib.onrender.com/get_stage_status/')
      .then(response => response.json())
      .then(data => {
        setProcessData(data);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching process data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (<div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Spin size="large" tip="Loading..." />
    </div>); 
  }

 
  const renderStatus = (completed, pending) => {
    return (
      <Space>
        {completed > 0 && (
          <Tag color="green">
            Completed: {completed}
          </Tag>
        )}
        {pending > 0 && (
          <Tag color="red">
            Pending: {pending}
          </Tag>
        )}
        {pending === 0 && completed === 0 && (
          <span>No Pending</span>
        )}
      </Space>
    );
  };


  const renderTable = (stage, processes) => {
    if (!processData || !processData[stage]) {
      return null;
    }

    const stageData = processData[stage];

    const columns = [
      {
        title: 'Stage',
        dataIndex: 'process',
        key: 'process',
        fixed: 'left', 
        render: (text) => <strong>{text}</strong>,
        width: 250,
      },
      
      ...processes.map((process) => ({
        title: process.process,
        dataIndex: process.process,
        key: process.id,
        render: (value, record) => (
          <Space size="middle">
            {renderStatus(
              record[process.id]?.completed || 0,
              record[process.id]?.pending || 0
            )}
          </Space>
        ),
        width: 200, 
      })),
      // {
      //   title: 'Total Parts',
      //   dataIndex: 'totalParts',
      //   key: 'totalParts',
      //   fixed: 'left',
      //   render: () => stageData.used_parts, 
      //   width: 150,
      // },

    ];

    const completedData = [
      {
        key: '1',
        process: 'Completed',
        ...processes.reduce((acc, process) => {
          acc[process.id] = {
            completed: stageData.process_status[process.id]?.completed || 0,
            pending: 0,  
          };
          return acc;
        }, {}),
        totalParts: stageData.used_parts, 
      },
    ];

    const pendingData = [
      {
        key: '2',
        process: 'Pending',
        ...processes.reduce((acc, process) => {
          acc[process.id] = {
            completed: 0, 
            pending: stageData.process_status[process.id]?.pending || 0,
          };
          return acc;
        }, {}),
        totalParts: stageData.used_parts,
      },
    ];

    return (
      <div style={{ marginBottom: '20px' }}>
        <h2>{stage} Body</h2>
        <h4> Total Parts : {stageData.used_parts}</h4>
        <Table
          columns={columns}
          dataSource={[...completedData, ...pendingData]}
          pagination={false}
          scroll={{ x: 'max-content' }} 
        />
      </div>
    );
  };

  return (
    <div>
      {masterData && masterData.LowerProcesses && renderTable('Lower', masterData.LowerProcesses)}
      {masterData && masterData.UpperProcesses && renderTable('Upper', masterData.UpperProcesses)}
      {masterData && masterData.AssembleProcesses && renderTable('Assemble', masterData.AssembleProcesses)}
    </div>
  );
};

export default StatusChecker;
