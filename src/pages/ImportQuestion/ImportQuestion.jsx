import React, { useState, useCallback } from "react";
import apiTestBankWithToken from "../../service/apiTestBankWithToken";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./ImportQuestion.module.scss";
import { useGlobalMessage } from "../../context/message";
import { APIS_TEST_BANK } from "../../config";

const ImportQuestion = () => {
  const message = useGlobalMessage();
  const [fileList, setFileList] = useState([]);

  const beforeUpload = useCallback(
    (file) => {
      const isDocx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        message.error("You can only upload DOCX files!");
        return Upload.LIST_IGNORE;
      }
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: "",
          originFileObj: file,
        },
      ]);
      return false; // Prevent Upload from auto uploading
    },
    [message]
  );

  const handleChange = useCallback(({ fileList }) => {
    setFileList(fileList);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!fileList.length) {
      message.warning("Please select a DOCX file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);
    try {
      await apiTestBankWithToken.post(APIS_TEST_BANK.uploadQuestions, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("File uploaded successfully!");
      setFileList([]);
    } catch (error) {
      message.error(error?.response?.data?.detail?.message || error?.message || "Upload failed!");
    }
  }, [fileList, message]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Import Questions (.docx)</h2>
      <div className={styles.uploadWrap}>
        <Upload
          accept=".docx"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          fileList={fileList}
          maxCount={1}
          showUploadList={{ showRemoveIcon: true }}
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Select DOCX File
          </Button>
        </Upload>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          disabled={!fileList.length}
          onClick={handleUpload}
        >
          Upload to Server
        </Button>
        <div className={styles.tips}>
          Only .docx files are accepted. Please upload your question file.
          <br />
          Max 1 file at a time.
        </div>
      </div>
    </div>
  );
};

export default ImportQuestion;
