import React from 'react'
import { Upload, Icon, Modal, Button, message } from 'antd';

export default class EditUploadResource extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    imageUrl:'',
    fileList: this.props.fileList,
  };
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    if (fileList.length !== 0) {
      if (fileList[0].status === "error") {
        message.error("图片上传失败");
      }
      if (fileList[0].status === "done") {
        const that = this;
        that.props.onImgUrl(fileList[0].response);
        message.success("图片上传成功");
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { disabled } =this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name="files"
          action="http://101.132.194.204:9090/producer/fileUpload/imge"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          disabled={disabled}
          //data={this.getImgUrl}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img id = "123" alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
