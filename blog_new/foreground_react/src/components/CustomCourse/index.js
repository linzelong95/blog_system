import React from 'react';
import { connect } from 'dva';
import { Timeline, Drawer, Icon, Pagination } from 'antd';
import { timeFormat, getRandomColor } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { UserCourseAPI } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class Course extends React.Component {
  state = {
    index: 1,
    size: 10,
    total: 0,
    list: []
  };

  componentDidMount = () => {
    const { request } = this.props;
    request({ index: 1, size: 10, conditionQuery: {}, netUrl: UserCourseAPI.LIST.url }, (res) => {
      this.setState({ ...res });
    }, false);
  }

  paginationChange = (index, size) => {
    const { request } = this.props;
    request({ index, size, conditionQuery: {}, netUrl: UserCourseAPI.LIST.url }, (res) => {
      this.setState({ ...res, index, size });
    }, false);
  }

  render() {
    const { list, index, size, total } = this.state;
    const { onClose, visible, width } = this.props;
    return (
      <Drawer
        visible={visible}
        title="归档"
        onClose={onClose}
        width={width || 500}
      >
        {visible && (
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              left: '-50px',
              top: '300px',
              height: '50px',
              width: '50px',
              background: '#1890FF',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: 'white',
              cursor: "pointer",
              borderRadius: "5px 0px 0px 5px"
            }}
          >
            <Icon type="close" style={{ fontWeight: 'bold', fontSize: '20px' }} />
          </div>
        )}
        <Timeline mode="alternate">
          {list.map(i => (
            <Timeline.Item color={getRandomColor()} key={i.id}>
              <b>{timeFormat(Number(new Date(i.updateDate)))}</b>
              <a
                href={`${window.location.origin}/article/${i.id}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{ display: "block" }}
              >
                {i.title}
              </a>
            </Timeline.Item>
          ))}
          {total > 0 &&
            <Timeline.Item color={getRandomColor()} key="pagination">
              <Pagination
                size="small"
                total={total}
                current={index}
                pageSize={size}
                onChange={this.paginationChange}
              />
            </Timeline.Item>
          }
        </Timeline>
      </Drawer>
    );
  }
}
export default Course;
