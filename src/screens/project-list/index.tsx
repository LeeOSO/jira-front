import React, { useEffect, useState } from "react";
import { SearchPanel } from "./search-panel";
import { List, Project } from "./list";
import {
  cleanObject,
  useDebounce,
  useDocumentTitle,
  useMount,
} from "../../utils";
import qs from "qs";
import { useHttp } from "../../utils/http";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useAsync } from "../../utils/use-async";
import { useProjects } from "../../utils/project";
import { useUser } from "../../utils/user";
import { useUrlQueryParam } from "../../utils/url";

const apiURL = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  // const [users, setUsers] = useState([]);

  // const [, setParam] = useState({
  //   name: "",
  //   personId: "",
  // });
  // const [keys] = useState<('name'|'personId')[]>(['name', 'personId']);
  // 基本类型、组件状态可以放到依赖中。非组件状态对象不能放到依赖。
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);

  // const [list, setList] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);

  const debounceParam = useDebounce(param, 500);
  // const client = useHttp();

  // useEffect(() => {
  //   // setLoading(true);
  //   // client("projects", { data: cleanObject(debounceParam) }).then(setList).catch((error) => {
  //   //   setList([]);
  //   //   setError(error);
  //   // }).finally(() => {
  //   //   setLoading(false);
  //   // });
  //
  //   run(client("projects", { data: cleanObject(debounceParam) }));
  // }, [debounceParam]);

  // useMount(() => {
  //   client("users").then(setUsers);
  // });

  // 使用自定义Hook封装异步操作
  const { error, isLoading: loading, data: list } = useProjects(debounceParam);
  const { data: users } = useUser(debounceParam);

  useDocumentTitle("项目列表", false);
  return (
    <Container>
      <h2>项目列表</h2>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List dataSource={list || []} users={users || []} loading={loading} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
