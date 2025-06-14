"use client";

import { useState } from "react";
import papaparse from "papaparse";
import { Marker } from "@/app/_types";
import {
  isKoreanAddressRegex,
  isLatitude,
  isLongitude,
} from "@/app/_libs/utils";
import { Button, Flex, List, Typography, Upload, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";

export default function View() {
  const [data, setData] = useState<Marker[]>([]);

  const onChange = ({ file }: UploadChangeParam<UploadFile>) => {
    if (file.originFileObj === undefined) return;

    const fileReader = new FileReader();
    fileReader.onload = ({ target }) => {
      const text = target?.result as string;
      const { data } = papaparse.parse<Marker>(text, {
        header: true,
        transform: (value) => {
          if (isKoreanAddressRegex(value)) return value;
          if (isLatitude(value)) return value;
          if (isLongitude(value)) return value;
        },
      });

      const processedData = data.map((row) => {
        const marker: Marker = { address: "", latitude: "", longitude: "" };
        Object.entries(row).forEach(([_, value]) => {
          if (value === null) return;
          if (isKoreanAddressRegex(value)) marker.address = value;
          if (isLatitude(value)) marker.latitude = value;
          if (isLongitude(value)) marker.longitude = value;
        });
        return marker;
      }).filter(({ address, latitude, longitude }) => address !== "" && latitude !== "" && longitude !== "");

      setData(processedData);
    };

    fileReader.readAsText(file.originFileObj, "EUC-KR");
  };

  return (
    <main className="max-w-[800px] mx-auto my-0 p-4">
      <Upload
        listType="picture-card"
        maxCount={1}
        accept=".csv"
        onChange={onChange}
        iconRender={() => <UploadOutlined />}
      >
        <UploadOutlined />
      </Upload>
      <List
        header={<Flex justify="space-between" align="center">
          <Typography.Text strong>{data.length}개의 마커가 있습니다.</Typography.Text>
          <Button variant="filled" color="primary">
            적용하기
          </Button>
        </Flex>}
        dataSource={data}
        renderItem={({ address, latitude, longitude }) => (
          <List.Item>
            <List.Item.Meta className="text-center" title={address} />
            <List.Item.Meta className="text-center" title={latitude} />
            <List.Item.Meta className="text-center" title={longitude} />
          </List.Item>
        )}
      />
    </main>
  );
}
