import { Avatar, Dropdown, Navbar, Text } from "@nextui-org/react";
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
					<Dropdown placement="bottom-left">
						<Dropdown.Trigger>
							<Avatar
								bordered
								size="lg"
								as="button"
								color="primary"
								src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
							/>
						</Dropdown.Trigger>
						<Dropdown.Menu color="primary" aria-label="Avatar Actions">
							<Dropdown.Item key="profile" css={{ height: "$18" }}>
								<Text b color="inherit" css={{ d: "flex" }}>
									Signed in as
								</Text>
								<Text b color="inherit" css={{ d: "flex" }}>
									{session.user.username}
								</Text>
							</Dropdown.Item>
							<Dropdown.Item key="my_settings" withDivider>
								My Settings
							</Dropdown.Item>
							<Dropdown.Item key="analytics">Analytics</Dropdown.Item>
							<Dropdown.Item key="system_settings" withDivider>
								System Settings
							</Dropdown.Item>
							<Dropdown.Item key="logout" color="error" withDivider>
								Log Out
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				) : (
					<Navbar.Link color="inherit" href="/api/auth/signin">
						Login
					</Navbar.Link>
				)}
			</Navbar.Content>
		</Navbar>
	);
}
