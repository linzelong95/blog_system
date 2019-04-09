import React from 'react';
import { connect } from 'dva';
import { Card, Upload, Icon, Modal } from 'antd';
import Editor from 'for-editor';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class DistributionMode extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    value: '',
  };

  componentDidMount = () => {};

  handleOnclick = () => {
    console.log(this.smde.value);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList }, console.log(fileList));

  markDownChange = value => this.setState({ value }, console.log(value));

  render() {
    const { previewVisible, previewImage, fileList, value } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderLayout>
        <Card>
          <div className="clearfix">
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
          <Editor value={value} height="1000px" preview expand onChange={this.markDownChange} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default DistributionMode;
