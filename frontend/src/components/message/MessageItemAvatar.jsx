import AvatarGenerator from "../AvatarGenerator";

function MessageItemAvatar({ isGroup, avatar, username }) {
	return (
		<div className=" w-8 h-8 shrink-0">
			{!isGroup ? (
				<AvatarGenerator avatar={avatar} name={username} size="w-8 h-8" />
			) : null}
		</div>
	);
}

export default MessageItemAvatar;
