import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Props } from "./type";
import View from "./view";
import { getPost } from "@/app/_queryOptions/post";

export default async function Page({
	params,
}: {
	params: Promise<Props>;
}) {
	const { postId } = await params;
	const queryClient = new QueryClient();
	await queryClient.fetchQuery(getPost(postId));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<View postId={postId} />
		</HydrationBoundary>
	);
}
