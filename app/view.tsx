"use client";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  List,
  notification,
  Typography,
} from "antd";
import useEventCallback from "@/app/_hooks/useEventCallback";
import { useEffect, useState, type ChangeEvent } from "react";
import { debounceTime, distinctUntilChanged, map } from "rxjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostList } from "@/app/_queryOptions/post";
import useStore from "@/app/_hooks/useStore";
import { motion } from "framer-motion";
import {
  useKakaoLoader,
  Map,
  MapMarker,
  _MapProps,
} from "react-kakao-maps-sdk";
import papaparse from "papaparse";

const isKoreanAddressRegex = (value: string) =>
  /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s*(특별시|광역시|도)?\s*[^\d\s]{1,20}(시|군|구)\s*[^\d\s]{1,20}(동|읍|면|리)?/.test(
    value
  );

const isFloat = (num: number) => Number.isFinite(num) && num % 1 !== 0;

const isLatitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 33 && number <= 38;
};

const isLongitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 124 && number <= 132;
};

export default function View() {
  useKakaoLoader({ appkey: "7c0a4bba1131d1334ee3dc75b1cc374f" });
  const { push } = useRouter();
  const [markerList, setMarkerList] = useState<
    {
      address: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);
  const [api, contextHolder] = notification.useNotification();

  const { position, setPosition, setTitleTransitionRect } = useStore();

  const [onSearchChange, keyword] = useEventCallback<
    ChangeEvent<HTMLInputElement>,
    string
  >(
    ($event) =>
      $event.pipe(
        map(({ target }) => target.value),
        distinctUntilChanged(),
        debounceTime(500)
      ),
    ""
  );

  const { data: postList, isLoading } = useQuery(getPostList(keyword));

  useEffect(() => {
    const { data } = papaparse.parse(
      `연번,행정동,주소,위도,경도,데이터기준일자
      1,신대방1동,서울특별시 동작구 신대방길 59,37.4885436800,126.9094842000,2024-12-12
      2,신대방1동,서울특별시 동작구 신대방길 80,37.4893758400,126.9098258000,2024-12-12
    3,신대방1동,서울특별시 동작구 신대방1길 24,37.4867591500,126.9103197000,2024-12-12
`,
      {
        header: true,
        transform(value) {
          if (isKoreanAddressRegex(value)) return value;
          if (isLatitude(value)) return Number(value);
          if (isLongitude(value)) return Number(value);
          return null;
        },
        complete({ data }) {
          const res = data.map((item) => {
            return Object.values(item).forEach((value) => {
              const item2 = {};

              if (isKoreanAddressRegex(value)) item2["address"] = value;
              if (isLatitude(value)) item2["latitude"] = Number(value);
              if (isLongitude(value)) item2["longitude"] = Number(value);

              console.log(item2);

              return item2;
            });
          });

          console.log(res);
        },
      }
    );
    setMarkerList([]);

    if (!window.navigator.geolocation)
      return api.error({ message: "Geolocation이 지원되지 않습니다" });

    window.navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (error) => {
        api.error({
          message:
            "위치 조회에 실패했습니다 브라우저 설정 내 위치 허용을 확인해주세요",
          description: error.message,
        });
      }
    );
  }, []);

  return (
    <Flex>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="basis-3/4 relative"
      >
        <Flex
          vertical
          gap={10}
          className="bg-white w-[600px] z-10 absolute top-6 left-[25%] rounded-xl p-4 shadow-lg"
        >
          <Input
            autoFocus
            className="w-full"
            addonBefore={<SearchOutlined />}
            placeholder="검색"
            onChange={onSearchChange}
            size="large"
          />
          <Flex gap={10}>
            <Checkbox>의류</Checkbox>
            <Checkbox>폐건전지</Checkbox>
            <Checkbox>재활용품</Checkbox>
          </Flex>
        </Flex>
        <Map className="w-full h-full" center={position} level={3}>
          {markerList.map(({ address, latitude, longitude }) => (
            <MapMarker
              key={latitude + longitude}
              position={{
                lat: latitude,
                lng: longitude,
              }}
            >
              {address}
            </MapMarker>
          ))}
        </Map>
        <Flex
          vertical
          gap={10}
          className="bg-white z-10 absolute bottom-6 right-6 rounded-xl p-4 shadow-lg"
        >
          <Button type="primary">현재위치로</Button>
        </Flex>
      </motion.div>
      <Flex className="basis-1/4 h-screen overflow-y-auto">
        {contextHolder}
        <List
          loading={isLoading}
          dataSource={postList}
          renderItem={({ id, title, body }) => (
            <List.Item
              className="margin-0 aspect-square cursor-pointer overflow-hidden"
              onClick={({ currentTarget }) => {
                setTitleTransitionRect(currentTarget.getBoundingClientRect());
                push(`/post/${id}`);
              }}
            >
              <motion.div className="p-2" whileHover={{ scale: 1.05 }}>
                <Typography.Title
                  level={5}
                  className="view-transition-title font-bold text-lg"
                >
                  {title}
                </Typography.Title>
                <Typography.Text className="text-gray-500 text-sm">
                  {body}
                </Typography.Text>
              </motion.div>
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
}
