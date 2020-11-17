import React from "react";
import Tabs from "antd/lib/tabs";
import { useHistory, useRouteMatch } from "react-router";
import { TemplateManagerController } from "@/shared/template-manager/template-manager-controller";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import { CommonMargin } from "@/shared/common/common-margin";
import { ApiTokensController } from "../api-tokens/view/api-tokens-controller";

const { TabPane } = Tabs;

export const ManagerTabs: React.FC = () => {
  const match = useRouteMatch<{ tab: string }>("/templates/:tab");
  const history = useHistory();
  const onChange = (activeKey: string) => {
    history.push(`/templates/${activeKey}`);
  };
  return (
    <ContentPadding>
      <h1>Template Manager</h1>
      <Tabs defaultActiveKey={match?.params.tab || "email"} onChange={onChange}>
        <TabPane tab="Email" key="email">
          <CommonMargin />
          <TemplateManagerController />
        </TabPane>
        <TabPane tab="Settings & API Tokens" key="settings">
          <CommonMargin />
          <ApiTokensController />
        </TabPane>
      </Tabs>
    </ContentPadding>
  );
};
