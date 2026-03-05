import MainContent from "../components/MainContent";
import Sidebar from "../components/sidebar/Sidebar";

function HomePage() {
	return (
		<div className="flex ">
			<aside className="w-80">
				<Sidebar />
			</aside>

			<main className="flex-1 min-h-dvh">
				<MainContent />
			</main>
		</div>
	);
}

export default HomePage;
