import React from 'react';
import styles from './index.less';
import marked from './helpers/marked';
import 'highlight.js/styles/tomorrow.css';

const MdEditor = ({ value }) => (
  <div className={styles['markdown']} dangerouslySetInnerHTML={{ __html: marked(value) }} />
);

export default MdEditor;
