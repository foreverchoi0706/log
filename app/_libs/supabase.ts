import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export const uploadFile = (file: File, path: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				supabase.storage
					.from(`images${path ?? ""}`)
					.upload(file.name, file, { upsert: true })
					.then(({ data }) => {
						if (data) resolve(data.fullPath);
					});
			} else {
				reject(new Error("Failed to convert file to blob"));
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsArrayBuffer(file);
	});
};

export default supabase;