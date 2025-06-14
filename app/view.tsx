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
import { debounceTime, distinctUntilChanged, map as rxMap } from "rxjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostList } from "@/app/_queryOptions/post";
import useStore from "@/app/_hooks/useStore";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  useKakaoLoader,
  Map,
  Roadview,
  MapMarker,
  type RoadViewProps,
} from "react-kakao-maps-sdk";
import { Marker } from "@/app/_types";

 function View() {
  const { push } = useRouter();
  const [markerList, setMarkerList] = useState<Marker[]>([]);
  const [api, contextHolder] = notification.useNotification();

  const { map, setMap, setTitleTransitionRect } = useStore();
  const [roadview, setRoadview] = useState<RoadViewProps | null>(null);

  const [onSearchChange, keyword] = useEventCallback<
    ChangeEvent<HTMLInputElement>,
    string
  >(
    ($event) =>
      $event.pipe(
        rxMap(({ target }) => target.value),
        distinctUntilChanged(),
        debounceTime(500)
      ),
    ""
  );

  const setGeolocationCoordinates = (isPanto: boolean = false) => {
    if (!window.navigator.geolocation)
      return api.error({ message: "Geolocation이 지원되지 않습니다" });

    window.navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMap({
          center: { lat: coords.latitude, lng: coords.longitude },
          isPanto,
        });
      },
      (error) =>
        api.error({
          message:
            "위치 조회에 실패했습니다 브라우저 설정 내 위치 허용을 확인해주세요",
          description: error.message,
        })
    );
  };

  const { data: postList, isLoading } = useQuery(getPostList(keyword));

  useEffect(() => {
    const abortController = new AbortController();
    window.document.addEventListener(
      "keydown",
      ({ key }) => {
        if (key === "Escape") setRoadview(null);
      },
      { signal: abortController.signal }
    );

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    // if (!map) return;

    // const ps = new window.kakao.maps.services.Places();
    // ps.keywordSearch("치킨", (data, status, pagination) => {
    //   if (status === window.kakao.maps.services.Status.OK) {
    //     console.log(data);
    //   }
    // });
  }, [map]);

  useEffect(() => {
    setGeolocationCoordinates();
  }, []);



  return (
    <Flex>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="basis-3/4 relative"
      >
        {roadview && (
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Roadview className="w-full h-full" {...roadview} />
          </motion.div>
        )}
        <Map
          {...map}
          className="w-full h-full"
        >
          <MapMarker position={map.center} />
          {markerList.map(({ address, latitude, longitude }) => (
            <MapMarker
              key={`marker-${address}-${latitude},${longitude}`}
              onClick={() => {
                setRoadview({
                  position: {
                    lat: Number(latitude),
                    lng: Number(longitude),
                    radius: 1000,
                  },
                });
              }}
              // onMouseOver={() => alert(address)}
              image={{
                src: "/trash.svg",
                size: {
                  width: 30,
                  height: 30,
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
          <Button
            type="primary"
            onClick={() => setGeolocationCoordinates(true)}
          >
            현재위치로{JSON.stringify(map)}
          </Button>
        </Flex>
      </motion.div>
      <Flex vertical className="basis-1/4 h-screen">
        {contextHolder}
        <Flex vertical gap={10} >
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
          className="overflow-y-auto"
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

export default function ViewContainer() {
  const [loading] = useKakaoLoader({ appkey: "7c0a4bba1131d1334ee3dc75b1cc374f" });

  if (loading) return null;
  return <View />;
}