import { Fragment } from "react";
import { getSeatClass, SeatType, useBooking } from "../hooks/useBooking";
import { ErrorMessage } from "./ErrorMessage";

interface BookingProps {
	selectedMovieId: number;
	selectedMovieRows: number;
	selectedMovieColumns: number;
	selectedMoviePrice: number;
}

export const Booking = ({
	selectedMovieId,
	selectedMovieRows,
	selectedMovieColumns,
	selectedMoviePrice,
}: BookingProps) => {
	const {
		status,
		selectedMovieSeats,
		selectedSeatCount,
		formData,
		formRef,
		totalPrice,
		errorMessage,
		handleOnToggleSeat,
		handleOnNameChange,
		handleOnEmailChange,
		handleOnSubmit,
	} = useBooking(
		selectedMovieId,
		selectedMoviePrice,
		selectedMovieRows,
		selectedMovieColumns,
	);

	if (status === "error" && errorMessage) {
		return (
			<ErrorMessage errorMessage={errorMessage} infoText="Reload application" />
		);
	}

	return (
		<>
			<div className="seats">
				{selectedMovieSeats.map((row, rowIndex) => (
					<Fragment key={rowIndex}>
						{row.map((seat, seatIndex) => (
							<button
								type="button"
								aria-label="Select seat"
								className={getSeatClass(seat)}
								key={`${rowIndex}-${seatIndex}`}
								disabled={status === "loading" || status === "submit"}
								onClick={
									seat !== SeatType.Occupied
										? () => handleOnToggleSeat(rowIndex, seatIndex)
										: undefined
								}
							/>
						))}
					</Fragment>
				))}
			</div>
			{selectedSeatCount > 0 && (
				<>
					<p className="seats__text">
						You have selected{" "}
						<span id="count" className="seats__text-accent">
							{selectedSeatCount}
						</span>{" "}
						seats for a price of $
						<span id="total" className="seats__text-accent">
							{totalPrice}
						</span>
					</p>
					<form
						className="form grid-auto-fit"
						name="form"
						onSubmit={handleOnSubmit}
						ref={formRef}
						noValidate
					>
						<input type="hidden" name="form-name" value="form" />
						<div className="form__field">
							<label htmlFor="name" className="form__label">
								Name *
							</label>
							<input
								id="name"
								name="name"
								type="text"
								className="form__input"
								placeholder="Your Name"
								autoComplete="name"
								required
								minLength={2}
								maxLength={50}
								pattern="[A-Za-zÅÄÖåäö\s]+"
								title="Name should only contain letters"
								onChange={handleOnNameChange}
								value={formData.name}
							/>
							<span className="form__error-message"></span>
						</div>
						<div className="form__field">
							<label htmlFor="email" className="form__label">
								Email *
							</label>
							<input
								id="email"
								name="email"
								type="email"
								className="form__input"
								placeholder="Your Email Address"
								autoComplete="email"
								required
								title="Please enter a valid email address"
								pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
								onChange={handleOnEmailChange}
								value={formData.email}
							/>
							<span className="form__error-message"></span>
						</div>
						<button
							className="button form__button"
							data-type="primary"
							type="submit"
						>
							Send
						</button>
					</form>
				</>
			)}
		</>
	);
};
