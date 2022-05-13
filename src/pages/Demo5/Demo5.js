import { React, useCallback, useEffect, useState, useRef } from 'react';
import styles from './Demo5.module.scss';
import { Table, Tag, Space, Button, Result } from 'antd';
import * as localForage from 'localforage';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '../../utils';
import G6 from '@antv/g6';
import { tab } from '@testing-library/user-event/dist/tab';

var store = localForage.createInstance({
  name: 'demo5',
});

const getItemList = async () => {
  const itemKeys = await store.keys();
  let itemList = {};
  for (let key of itemKeys) {
    let value = await store.getItem(key);
    itemList[key] = value;
  }
  return itemList;
};

const data = {
  nodes: [
    {
      id: '0',
      label: '开始',
    },
    {
      id: '1',
      label: '+',
    },
    {
      id: '2',
      label: '+',
    },
    {
      id: '3',
      label: '审批人1',
    },
    {
      id: '4',
      label: '审批人2',
    },
    {
      id: '5',
      label: '+',
    },
    {
      id: '6',
      label: 'x',
    },
    {
      id: '7',
      label: '审批人3',
    },
    {
      id: '8',
      label: '审批人4',
    },
    {
      id: '9',
      label: 'x',
    },
    {
      id: '10',
      label: '+',
    },
    {
      id: '11',
      label: '结束',
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
    },
    {
      source: '1',
      target: '2',
    },
    {
      source: '2',
      target: '3',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '3',
      target: '5',
    },
    {
      source: '4',
      target: '5',
    },
    {
      source: '5',
      target: '6',
    },
    {
      source: '6',
      target: '11',
    },
    {
      source: '6',
      target: '7',
    },
    {
      source: '7',
      target: '10',
    },
    {
      source: '10',
      target: '11',
    },
    {
      source: '1',
      target: '8',
    },
    {
      source: '8',
      target: '9',
    },
    {
      source: '9',
      target: '10',
    },
    {
      source: '9',
      target: '11',
    },
  ],
};

const PENGDING_COLOR = '#8F8F8F';
const FINISH_COLOR = '#86BA90';
const PROCESSING_COLOR = '#8FB8DE';

async function processData(data) {
  let itemList = await getItemList();
  let dataCopy = JSON.parse(JSON.stringify(data));

  // set node color
  // make logic node orange
  for (let node of dataCopy.nodes) {
    if (node.label === 'x' || node.label === '+') {
      node.color = '#F1AB86';
    }
  }
  // make start green
  dataCopy.nodes[0].color = FINISH_COLOR;

  dataCopy.nodes[3].color = PROCESSING_COLOR;
  dataCopy.nodes[4].color = PROCESSING_COLOR;
  dataCopy.nodes[8].color = PROCESSING_COLOR;

  if (itemList['approve1'] === 'processing') {
    dataCopy.nodes[3].color = PROCESSING_COLOR;
  } else {
    dataCopy.nodes[3].color = FINISH_COLOR;
  }
  if (itemList['approve2'] === 'processing') {
    dataCopy.nodes[4].color = PROCESSING_COLOR;
  } else {
    dataCopy.nodes[4].color = FINISH_COLOR;
  }

  if (itemList['approve4'] !== 'pending') {
    if (itemList['approve4'] === 'processing') {
      dataCopy.nodes[8].color = PROCESSING_COLOR;
    } else {
      dataCopy.nodes[8].color = FINISH_COLOR;
    }
  }

  if (
    itemList['approve3'] === 'agreed' ||
    itemList['approve3'] === 'rejected'
  ) {
    dataCopy.nodes[7].color = FINISH_COLOR;
  }
  if (itemList['approve3'] === 'processing') {
    dataCopy.nodes[7].color = PROCESSING_COLOR;
  }

  if (
    (itemList['approve1'] !== 'processing' &&
      itemList['approve2'] !== 'processing' &&
      (itemList['approve1'] === 'rejected' ||
        itemList['approve2'] === 'rejected')) ||
    itemList['approve4'] === 'rejected' ||
    (itemList['approve4'] === 'agreed' &&
      (itemList['approve3'] === 'rejected' ||
        itemList['approve3'] === 'agreed'))
  ) {
    dataCopy.nodes[11].color = FINISH_COLOR;
  }

  // set edge color
  for (let index of [0, 1, 2, 3, 11]) {
    dataCopy.edges[index].color = '#8FB8DE';
  }

  if (itemList['approve1'] !== 'processing') {
    dataCopy.edges[4].color = PROCESSING_COLOR;
  }
  if (itemList['approve2'] !== 'processing') {
    dataCopy.edges[5].color = PROCESSING_COLOR;
  }

  if (itemList['approve4'] !== 'processing') {
    dataCopy.edges[12].color = PROCESSING_COLOR;
    if (itemList['approve4'] === 'rejected') {
      dataCopy.edges[14].color = PROCESSING_COLOR;
    } else {
      dataCopy.edges[13].color = PROCESSING_COLOR;
      if (
        itemList['approve3'] === 'rejected' ||
        itemList['approve3'] === 'agreed'
      )
        dataCopy.edges[10].color = PROCESSING_COLOR;
    }
  }

  if (
    itemList['approve1'] !== 'processing' &&
    itemList['approve2'] !== 'processing'
  ) {
    dataCopy.edges[6].color = PROCESSING_COLOR;
    if (
      itemList['approve1'] === 'rejected' ||
      itemList['approve2'] === 'rejected'
    ) {
      dataCopy.edges[7].color = PROCESSING_COLOR;
    } else {
      dataCopy.edges[8].color = PROCESSING_COLOR;
    }
  }

  if (
    itemList['approve3'] === 'agreed' ||
    itemList['approve3'] === 'rejected'
  ) {
    dataCopy.edges[9].color = PROCESSING_COLOR;
  }
  return dataCopy;
}

async function operateApprove(approveName, operation) {
  const approver1 = '审批人1';
  const approver2 = '审批人2';
  const approver3 = '审批人3';
  const approver4 = '审批人4';
  const reject = 'reject';
  const agree = 'agree';
  if (approveName === approver1) {
    if (operation === agree) {
      store.setItem('approve1', 'agreed');
    } else {
      store.setItem('approve1', 'rejected');
    }
    if ((await store.getItem('approve2')) !== 'processing') {
      if (
        (await store.getItem('approve1')) === 'agreed' &&
        (await store.getItem('approve2')) === 'agreed'
      ) {
        store.setItem('approve3', 'processing');
      }
    }
  }
  if (approveName === approver2) {
    if (operation === agree) {
      store.setItem('approve2', 'agreed');
    } else {
      store.setItem('approve2', 'rejected');
    }
    if ((await store.getItem('approve1')) !== 'processing') {
      if (
        (await store.getItem('approve1')) === 'agreed' &&
        (await store.getItem('approve2')) === 'agreed'
      ) {
        store.setItem('approve3', 'processing');
      }
    }
  }
  if (approveName === approver3) {
    if (operation === agree) {
      store.setItem('approve3', 'agreed');
    } else {
      store.setItem('approve3', 'rejected');
    }
  }
  if (approveName === approver4) {
    if (operation === agree) {
      store.setItem('approve4', 'agreed');
    } else {
      store.setItem('approve4', 'rejected');
    }
  }
}

async function getTableData() {
  let itemList = await getItemList();
  if (itemList['Started'] !== 'true') return null;
  let tableData = [
    {
      key: '1',
      name: '审批人1',
      status: itemList['approve1'],
      action: null,
    },
    {
      key: '2',
      name: '审批人2',
      status: itemList['approve2'],
      action: null,
    },
    {
      key: '3',
      name: '审批人3',
      status: itemList['approve3'],
      action: null,
    },
    {
      key: '4',
      name: '审批人4',
      status: itemList['approve4'],
      action: null,
    },
  ];
  return tableData;
}

function ResultPanel({ instanceStatus }) {
  switch (instanceStatus) {
    case 'processing':
      return <Result title="流程进行中" />;
    case 'agreed':
      return <Result status="success" title="审批通过" />;
    case 'rejected':
      return <Result status="error" title="审批被拒绝" />;
    default:
      return <Result title="暂无流程" />;
  }
}

function Demo3() {
  const [componentKey, setComponentKey] = useState(Math.random());
  const progressContainer = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [oldGraph, setOldGraph] = useState(null);
  const [instanceStatus, setinstanceStatus] = useState(null);

  async function createInstance() {
    store.clear();
    await store.setItem('Started', 'true');
    await store.setItem('approve1', 'processing');
    await store.setItem('approve2', 'processing');
    await store.setItem('approve3', 'pending');
    await store.setItem('approve4', 'processing');
    setComponentKey(Math.random());
  }

  function clearInstance() {
    store.clear();
    if (oldGraph !== null) {
      console.log('destory');
      oldGraph.destroy();
    }
    setComponentKey(Math.random());
  }

  async function updateInstanceState(data) {
    if (!data) {
      setinstanceStatus(null);
    } else if (!data.nodes[11].color) setinstanceStatus('processing');
    else {
      const itemList = await getItemList();
      if (
        itemList['approve3'] === 'agreed' &&
        itemList['approve4'] === 'agreed'
      ) {
        setinstanceStatus('agreed');
      } else {
        setinstanceStatus('rejected');
      }
    }
  }

  useEffect(() => {
    if (!progressContainer) return;
    getItemList().then((itemList) => {
      if (itemList['Started'] !== 'true') {
        updateInstanceState(null);
        return;
      }
      const graph = new G6.Graph({
        container: 'progress-container',
        width: 800,
        height: 400,
        fitView: true,
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          controlPoints: true,
          nodesepFunc: () => 1,
          ranksepFunc: () => 1,
        },
        defaultNode: {
          size: [45, 20],
          type: 'rect',
          style: {
            lineWidth: 2,
            stroke: '#8F8F8F',
            fill: '#FFFFFF',
          },
        },
        defaultEdge: {
          type: 'polyline',
          size: 2,
          color: '#e2e2e2',
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#e2e2e2',
            },
            radius: 20,
          },
        },
      });
      processData(data).then((data) => {
        if (oldGraph !== null) oldGraph.destroy();
        graph.data(data);
        graph.render();
        setOldGraph(graph);
        updateInstanceState(data);
      });
    });
    getTableData().then((tableData) => {
      setTableData(tableData);
    });
  }, [progressContainer, componentKey]);

  const columns = [
    {
      title: '审批人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        switch (status) {
          case 'pending':
            return <Tag color={'grey'}>队列中</Tag>;
          case 'processing':
            return <Tag color={'geekblue'}>等待操作</Tag>;
          case 'agreed':
            return <Tag color={'green'}>通过</Tag>;
          case 'rejected':
            return <Tag color={'red'}>拒绝</Tag>;
          default:
            break;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.status === 'processing') {
          return (
            <Space size="middle">
              <a
                onClick={() =>
                  operateApprove(record.name, 'agree').then(
                    setComponentKey(Math.random())
                  )
                }
              >
                同意
              </a>
              <a
                onClick={() =>
                  operateApprove(record.name, 'reject').then(
                    setComponentKey(Math.random())
                  )
                }
              >
                拒绝
              </a>
            </Space>
          );
        }
      },
    },
  ];

  return (
    <div className={styles.main}>
      <div
        className={styles['progress-container']}
        id="progress-container"
        ref={progressContainer}
      ></div>
      <div className={styles['operation-container']}>
        <div>
          <div>
            <Button type="primary" onClick={() => createInstance()}>
              创建审批流程
            </Button>
            <Button onClick={() => clearInstance()}>清除审批流程</Button>
          </div>

          <Table columns={columns} dataSource={tableData} />
        </div>
        <ResultPanel instanceStatus={instanceStatus} />
      </div>
    </div>
  );
}

export default Demo3;
