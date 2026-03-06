import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar/Sidebar";

function HomePage() {
	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<div className="w-[320px] shrink-0 border-r">
				<Sidebar />
			</div>

			<div className="min-w-0 flex-1">
				<MainContent />
			</div>
		</div>
	);
}

export default HomePage;
