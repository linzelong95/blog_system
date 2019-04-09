import React from 'react';
import { Table, Alert } from 'antd';
import LangConfig from '@/assets/LangConfig';
import styles from './index.less';

const { CommonLang: { CLEAR } } = LangConfig;


const StandardTable = ({ cleanSelectedItem, number,columns, lang = "zh_CN", ...restProps }) => {
  const scroll={ x: !columns[0].width.toString().endsWith("%") ? columns.reduce((width, column) => width + column.width, 0) : undefined }
  return (
    <div className={styles.standardTable}>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: "15px" }}
        message={
          <span>
            {lang === "zh_CN"
              ? <span>已选择 <a style={{ fontWeight: 600 }}>{number}</a> 项</span>
              : <span>Has selected <a style={{ fontWeight: 600 }}>{number}</a> items</span>
            }
            &nbsp;&nbsp;
            <a onClick={cleanSelectedItem} style={{ marginLeft: 24 }}>{CLEAR[lang]}</a>
          </span>
        }
      />
      <Table columns={columns} scroll={scroll} {...restProps} />
    </div>
  );
}



export default StandardTable;