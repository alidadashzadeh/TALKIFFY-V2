import { Search } from "lucide-react";
import { useContactContext } from "../../contexts/ContactContext";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import AccountSheet from "../Accountheet";
function Sidebarheader() {
	const { setFilteredBy } = useContactContext();
	const handleChange = (e) => {
		setFilteredBy(e.target.value);
	};

	return (
		<div className="flex items-center gap-2 px-2">
			<AccountSheet />
			<InputGroup className="m-2">
				<InputGroupInput placeholder="Search" onChange={handleChange} />
				<InputGroupAddon align="inline-start">
					<Search />
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}

export default Sidebarheader;
