import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { AuthContextProvider } from "./contexts/AuthContext";
import { ContactContextProvider } from "./contexts/ContactContext.jsx";
import { MessagesContextProvider } from "./contexts/MessagesContext.jsx";
import { SettingContextProvider } from "./contexts/SettingContext.jsx";
import { SocketContextProvider } from "./contexts/SocketContext.jsx";
import { ConversationContextProvider } from "./contexts/ConversationContext";
import { SheetModalProvider } from "./contexts/SheetModalProvider";
import { QueryProvider } from "./lib/reactQuery";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<AuthContextProvider>
					<ConversationContextProvider>
						<ContactContextProvider>
							<MessagesContextProvider>
								<SettingContextProvider>
									<SocketContextProvider>
										<SheetModalProvider>
											<App />
											<Toaster />
										</SheetModalProvider>
									</SocketContextProvider>
								</SettingContextProvider>
							</MessagesContextProvider>
						</ContactContextProvider>
					</ConversationContextProvider>
				</AuthContextProvider>
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>,
);
