import React  from 'react';
import { Modal, Button } from 'antd';

export default class insertComment extends React.Component{
  constructor(props) {
    super(props);

  }

  handleOk = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  render(){
    const { insertVisible } = this.state;
    return(
      <div>
        <Button type="primary" onClick={this.showModal}>Open</Button>
        <Modal
          title="Basic Modal"
          visible='true'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
