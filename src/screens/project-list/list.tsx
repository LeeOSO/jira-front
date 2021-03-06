import React from "react";
import dayjs from "dayjs";
import { Dropdown, Menu, Modal, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { Pin } from "../../components/pin";
import { useDeleteProject, useEditProject } from "../../utils/project";
import { ButtonNoPadding } from "../../components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { Project } from "../../types/project";
import { User } from "../../types/user";

interface ListProps extends TableProps<Project> {
  // list: Project[];
  users: User[];
}

//loading处理：通过父组件透传属性到子组件的Table中
//取出users
//...props对象类型: type PropsType = Omit<ListProps, 'users'>;

//性能优化2：React.memo  大部分不需要使用
//渲染条件：props变化、redux变化
export const List = React.memo(({ users, ...props }: ListProps) => {
  // let object = { name: "jack", age: 3 };
  const { mutate } = useEditProject(useProjectsQueryKey());
  // const pinProject = (id: number, pin: boolean) => mutate({ id, pin });
  // 柯里化简化调用
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      //{/*{...object} === name={'jack'} age={8}*/}
      pagination={false}
      rowKey={"id"}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                // onCheckedChange={(pin) => pinProject(project.id, pin)}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return (
              <Link key={project.id} to={String(project.id)}>
                {project.name}
              </Link>
            );
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
});

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  // 柯里化简化调用
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确定删除这个项目吗?",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"edit"}>
            <ButtonNoPadding type={"link"} onClick={editProject(project.id)}>
              编辑
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key={"delete"}>
            <ButtonNoPadding
              type={"link"}
              onClick={() => confirmDeleteProject(project.id)}
            >
              删除
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
