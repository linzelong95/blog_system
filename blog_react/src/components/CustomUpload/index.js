
import React from "react";
import { Upload, Icon, Modal } from "antd";

class CustomUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => this.setState({ previewImage: file.url || file.thumbUrl, previewVisible: true });

  handleChange = ({ fileList }) => this.props.handleUpload(fileList);

  render() {
    const { previewVisible, previewImage } = this.state;
    const { action, listType = "picture-card", multiple = false, maxNum = 1, fileList = [], withCredentials = true } = this.props;
    return (
      <div className="clearfix">
        <Upload
          action={action}
          multiple={multiple}
          withCredentials={withCredentials}
          listType={listType}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {
            fileList.length < maxNum &&
            <div>
              <Icon type="plus" />
              <div style={{ marginTop: "8px", color: "#666" }}>上传图片</div>
            </div>
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="图片" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default CustomUpload;