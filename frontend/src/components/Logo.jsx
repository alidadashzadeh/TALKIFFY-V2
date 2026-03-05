function Logo({ size }) {
	return (
		<div className={`w-${size} relative overflow-hidden`}>
			<div className="absolute inset-0 before:absolute before:content-[''] before:w-1/4 before:h-full before:bg-background__primary/20 before:blur-sm before:transform before:skew-x-12 before:animate-shine"></div>
			<img src="logo.png" />
		</div>
	);
}

export default Logo;
