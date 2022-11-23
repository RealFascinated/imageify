import { Button, Text } from "@nextui-org/react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="h-[89.9vh] flex flex-col items-center justify-center">
			<Text h1 className="font-bold text-4xl">
				Imageify
			</Text>
			<Text className="mt-2 text-xl">
				Free and open-source ShareX image host that you can self-host!
			</Text>

			<div className="mt-5">
				<Button auto className="bg-blue-600">
					<Link href="https://github.com/RealFascinated/imageify">Github</Link>
				</Button>
			</div>
		</div>
	);
}
