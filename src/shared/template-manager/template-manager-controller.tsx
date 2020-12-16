import { useEmailTemplates } from "@/shared/template-manager/hooks/use-email-templates";
import React, { useState } from "react";
import Row from "antd/lib/grid/row";
import Col from "antd/lib/grid/col";
import Button from "antd/lib/button";
import Select from "antd/lib/select";
import Card from "antd/lib/card";
import { useHistory, useLocation } from "react-router";
import { EmailTemplateFormController } from "./email-template-form-controller";
import { CommonMargin } from "../common/common-margin";
import { EmailPreview } from "./email-preview";

const newTemplate = {
  id: "",
  description: "",
  fromEmail: "",
  replyToEmail: "",
  subject: "",
  plainTextBody: "",
  mainContent: "",
  mainCta: "",
  secondaryContent: "",
  secondaryCta: "",
};

const IS_NEW_ID = "_create_new_template";

export const TemplateManagerController: React.FC = () => {
  const { templates } = useEmailTemplates();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const [curId, setCurId] = useState(id || "");
  const template = templates?.find((t) => t.id === curId);
  const setCurIdPushHistory = (val: string) => {
    setCurId(val);
    history.push({
      pathname: location.pathname,
      search: `?id=${val}`,
    });
  };
  const tmplInEdit = id === IS_NEW_ID ? newTemplate : template;
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Select
              style={{ width: "250px" }}
              showSearch
              placeholder="👋 start by selecting a template"
              optionFilterProp="children"
              onChange={setCurIdPushHistory}
              defaultValue={id || undefined}
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {(templates || []).map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.id}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setCurIdPushHistory(IS_NEW_ID);
              }}
            >
              New Template
            </Button>
          </Col>
        </Row>
      </Card>

      <CommonMargin />

      {tmplInEdit && (
        <Row gutter={8}>
          <Col span={12}>
            <Card>
              <EmailTemplateFormController
                template={tmplInEdit}
                setTemplateId={(templateId) => {
                  setCurIdPushHistory(templateId);
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            {id === IS_NEW_ID ? (
              <Card>
                <h2>Submit to preview</h2>
              </Card>
            ) : (
              <EmailPreview templateId={curId} />
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
