import NavBar from "./NavBar";

export default function Layout({ children }) {
	return (
		<div className="bg-[#080808] text-white">
			<NavBar></NavBar>
			<div className="h-screen">{children}</div>
		</div>
	);
}
