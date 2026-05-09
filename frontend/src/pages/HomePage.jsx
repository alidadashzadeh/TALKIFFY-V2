import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar/Sidebar";

function HomePage() {
	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<div className="w-[80px] shrink-0 border-r border-muted shadow-sm  md:w-[320px] ">
				<Sidebar />
			</div>

			<div className="min-w-0 flex-1">
				<MainContent />
			</div>
		</div>
	);
}

export default HomePage;
