interface ErrorProps {
	errorMessage: string;
	infoText: string;
}

export const ErrorMessage = ({ errorMessage, infoText }: ErrorProps) => {
	return (
		<div className="error">
			<div>{errorMessage}</div>
			<button
				type="button"
				aria-label="Error occured, click to reload"
				onClick={() => window.location.reload()}
				className="button error__button"
				data-type="primary"
			>
				{infoText}
			</button>
		</div>
	);
};
