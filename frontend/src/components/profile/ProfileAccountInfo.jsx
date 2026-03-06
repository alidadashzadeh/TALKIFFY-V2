function ProfileAccountInfo({ createdAt }) {
	return (
		<div className="w-full pt-4">
			<p className="mb-3 text-base font-medium">Account Information</p>

			<div className="flex justify-between border-b border-border py-2 text-sm">
				<p>Member Since</p>
				<p>
					{createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : ""}
				</p>
			</div>

			<div className="flex justify-between py-2 text-sm">
				<p>Account Status</p>
				<p className="text-green-500">Active</p>
			</div>
		</div>
	);
}

export default ProfileAccountInfo;
