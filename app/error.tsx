"use client";

import { Result } from "antd";

export default function GloablError({ error }: { error: Error }) {
  return <Result status="500" title="500" subTitle={error.message} />;
}
