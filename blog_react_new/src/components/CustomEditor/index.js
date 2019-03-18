import React, { PureComponent } from 'react';
import RcUeditor from 'react-ueditor-wrap';
import { editorPrefix } from '@/defaultSettings';

export default class CustomEditor extends PureComponent {
  render() {
    const { onChange, value } = this.props;
    const editorConfig = {
      initialFrameWidth: '100%',
      serverUrl: `${editorPrefix}/ueditor/jsp/controller.jsp`,
    }
    return (
      <RcUeditor
        onChange={onChange}
        value={value}
        editorConfig={editorConfig}
        ueditorUrl={`${editorPrefix}/ueditor/ueditor.all.js`}
        ueditorConfigUrl={`${editorPrefix}/ueditor/ueditor.config.js`}
      />
    );
  }
}
