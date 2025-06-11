"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPost } from "@/app/_queryOptions/post";
import type { Props } from "./type";
import { motion, useScroll } from "framer-motion";
import useStore from "@/app/_hooks/useStore";
import MDEditor from "@uiw/react-md-editor";
import useObservable from "@/app/_hooks/useObservable";
import { interval, scan } from "rxjs";

export default function View({ postId }: Props) {
  const { scrollYProgress } = useScroll();
  const { data: post } = useSuspenseQuery(getPost(postId));
  const { titleTransitionRect } = useStore();

  const count = useObservable(
    (initial) => interval(1000).pipe(scan((acc) => acc - 1, initial)),
    100
  );

  return (
    <motion.main
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${scrollYProgress.get() * 100}%` }}
        className="fixed top-0 right-0 left-0 h-1 bg-blue-500"
      />
      <motion.h1
        className="view-transition-title font-bold text-3xl"
        initial={
          titleTransitionRect !== null
            ? {
                position: "absolute",
                x: titleTransitionRect.x,
                y: titleTransitionRect.y,
                width: titleTransitionRect.width,
                height: titleTransitionRect.height,
              }
            : undefined
        }
        animate={{
          position: "static",
          x: 0,
          y: 0,
          width: "100%",
          height: "auto",
        }}
        transition={{ duration: 0.3 }}
      >
        {post.title}
      </motion.h1>
      <div className="mt-4">
        <MDEditor.Markdown
          source={post.body}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>
    </motion.main>
  );
}
