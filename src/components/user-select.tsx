import { IdSelect } from "./id-selector";
import React from "react";
import { useUsers } from "../utils/user";
export const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props} />;
};
