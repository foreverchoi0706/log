import type { Post } from "./type";
import { queryOptions } from "@tanstack/react-query";

export const getPost = (postId: string) =>
	queryOptions({
		queryKey: ["post", postId],
		queryFn: async () => {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
			if (!response.ok) throw new Error(response.statusText);
			return response.json() as Promise<Post>;
		},
	});

export const getPostList = (keyword?: string) =>
	queryOptions({
		queryKey: ["post", "list", keyword],
		queryFn: async () => {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts${keyword ? `?q=${keyword}` : ""}`);
			if (!response.ok) throw new Error(response.statusText);
			return response.json() as Promise<Post[]>;
		},
	});
