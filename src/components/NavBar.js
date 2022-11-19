import { Navbar, Text } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function NavBar() {
	const { data: session, status } = useSession();

	return (
		<Navbar isBordered variant={"static"}>
			<Navbar.Brand>
				<Text b color="inherit">
					Imageify
				</Text>
			</Navbar.Brand>
			<Navbar.Content>
				{status === "authenticated" ? (
					<p>signed in</p>
				) : (
					<Navbar.Link color="inherit" href="#">
						Login
					</Navbar.Link>
				)}
			</Navbar.Content>
		</Navbar>
	);
}
