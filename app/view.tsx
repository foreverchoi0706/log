"use client";

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
import Image from "next/image";
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

const isFloat = (number: number) => Number.isFinite(number) && number % 1 !== 0;

const isLatitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 33 && number <= 38;
};

const isLongitude = (value: string | number) => {
  const number = Number(value);
  return isFloat(number) && number >= 124 && number <= 132;
};

interface Marker {
  address: string;
  latitude: string;
  longitude: string;
}

export default function View() {
  useKakaoLoader({ appkey: "7c0a4bba1131d1334ee3dc75b1cc374f" });
  const { push } = useRouter();
  const [markerList, setMarkerList] = useState<Marker[]>([]);
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
    if (!window.navigator.geolocation)
      return api.error({ message: "Geolocation이 지원되지 않습니다" });

    window.navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
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

  useEffect(() => {
    const { data } = papaparse.parse<Marker>(
      `연번,행정동,주소,위도,경도,데이터기준일자
        1,신대방1동,서울특별시 동작구 신대방길 59,37.4885436800,126.9094842000,2024-12-12
        2,신대방1동,서울특별시 동작구 신대방길 80,37.4893758400,126.9098258000,2024-12-12
        3,신대방1동,서울특별시 동작구 신대방1길 24,37.4867591500,126.9103197000,2024-12-12`,
      {
        header: true,
        transform: (value) => {
          if (isKoreanAddressRegex(value)) return value;
          if (isLatitude(value)) return value;
          if (isLongitude(value)) return value;
          return null;
        },
      }
    );

    setMarkerList(
      data.map((row) => {
        const marker: Marker = { address: "", latitude: "", longitude: "" };
        Object.entries(row).forEach(([_, value]) => {
          if (value === null) return;
          if (isKoreanAddressRegex(value)) marker.address = value;
          if (isLatitude(value)) marker.latitude = value;
          if (isLongitude(value)) marker.longitude = value;
        });
        return marker;
      })
    );
  }, []);

  return (
    <Flex>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="basis-3/4 relative"
      >
        <Map className="w-full h-full" center={position} level={3} maxLevel={3}>
          <MapMarker position={position} />
          {markerList.map(({ address, latitude, longitude }) => (
            <MapMarker
              key={address}
              onMouseOver={() => alert(address)}
              image={{
                src: "/trash.svg",
                size: {
                  width: 20,
                  height: 20,
                },
              }}
              position={{
                lat: Number(latitude),
                lng: Number(longitude),
              }}
            />
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
      <Flex vertical className="basis-1/4 h-screen overflow-y-auto">
        {contextHolder}
        <Flex vertical gap={10} className="bg-white w-full sticky top-0 z-10">
          <Input
            autoFocus
            className="w-full"
            placeholder="검색"
            onChange={onSearchChange}
            size="large"
          />
          <Flex justify="space-around" gap={10}>
            <Checkbox className="flex">
              <Image
                className="mx-auto my-0"
                alt="의류"
                width={20}
                height={20}
                src="/trash.svg"
              />
              의류
            </Checkbox>

            <Checkbox className="flex">
              <Image
                className="mx-auto my-0"
                alt="의류"
                width={20}
                height={20}
                src="/battery.svg"
              />
              폐건전지
            </Checkbox>
            <Checkbox>
              <Image
                className="mx-auto my-0"
                alt="의류"
                width={20}
                height={20}
                src="/recycle.svg"
              />
              재활용품
            </Checkbox>
          </Flex>
        </Flex>
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
