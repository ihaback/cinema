const Logo = () => {
	return (
		<a
			href="/"
			aria-label="Navigate to home page"
			className="site-header__logo"
		>
			<span className="visually-hidden">Home: </span>CINEMA
		</a>
	);
};

const Toggle = ({
	isAdmin,
	handleOnToggleAdmin,
}: {
	isAdmin: boolean | null;
	handleOnToggleAdmin: () => void;
}) => {
	return (
		<>
			<span className="visually-hidden" id="select-mode">
				Select user or admin mode
			</span>
			<button
				className="site-header__toggle"
				type="button"
				role="switch"
				aria-checked={!isAdmin ? "true" : "false"}
				aria-labelledby="select-mode"
				onClick={handleOnToggleAdmin}
			>
				<span>user</span>
				<span>admin</span>
			</button>
		</>
	);
};

export const SiteHeader = ({
	isAdmin,
	handleOnToggleAdmin,
}: {
	isAdmin: boolean | null;
	handleOnToggleAdmin: () => void;
}) => {
	return (
		<header className="site-header">
			<div className="container container--narrow">
				<div className="site-header__inner">
					<Logo />
					{isAdmin !== null && (
						<Toggle
							isAdmin={isAdmin}
							handleOnToggleAdmin={handleOnToggleAdmin}
						/>
					)}
				</div>
			</div>
		</header>
	);
};
