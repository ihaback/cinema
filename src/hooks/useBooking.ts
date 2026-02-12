import {
	type ChangeEvent,
	type FormEvent,
	useEffect,
	useReducer,
	useRef,
} from "react";
import { validateForm } from "../utils/utils";

export const SeatType = {
	Available: 0,
	Selected: 1,
	Occupied: 2,
} as const;

type SeatTypeValue = (typeof SeatType)[keyof typeof SeatType];

type Seats = SeatTypeValue[][];

interface IBooking {
	id: number;
	movieId: number;
	seats: number[][];
	name: string;
	email: string;
	totalPrice: 0;
}

export type BookingState = {
	selectedMovieSeats: Seats;
	showForm?: boolean;
	formData?: { name: string; email: string };
	errorMessage?: string;
} & (
	| {
			status: "idle";
	  }
	| {
			status: "loading";
	  }
	| {
			status: "success";
			selectedMovieSeats: Seats;
	  }
	| {
			status: "submit";
	  }
	| {
			status: "error";
			errorMessage: string;
	  }
);

export type BookingAction =
	| {
			type: "loading";
	  }
	| {
			type: "success";
			payload: Seats;
	  }
	| {
			type: "submit";
	  }
	| {
			type: "toggleSeat";
			payload: { rowIndex: number; columnIndex: number };
	  }
	| {
			type: "showForm";
	  }
	| {
			type: "updateName";
			payload: string;
	  }
	| {
			type: "updateEmail";
			payload: string;
	  }
	| {
			type: "error";
			payload: string;
	  };

export const getSeatClass = (seatType: number) => {
	switch (seatType) {
		case SeatType.Available:
			return "seats__item";
		case SeatType.Selected:
			return "seats__item seats__item--selected";
		case SeatType.Occupied:
			return "seats__item seats__item--occupied";
		default:
			return "";
	}
};

const generateSeats = (
	rows: number,
	columns: number,
	bookings: IBooking[],
): Seats => {
	const seats: Seats = Array.from({ length: rows }, () =>
		Array(columns).fill(SeatType.Available),
	);

	bookings.forEach((booking) => {
		booking.seats.forEach(([row, col]) => {
			if (row >= 0 && row < rows && col >= 0 && col < columns) {
				seats[row][col] = SeatType.Occupied;
			}
		});
	});

	return seats;
};

const getSelectedSeats = (movieSeats: Seats): number[][] => {
	return movieSeats.reduce<number[][]>((acc, row, rowIndex) => {
		row.forEach((seat, colIndex) => {
			if (seat === SeatType.Selected) {
				acc.push([rowIndex, colIndex]);
			}
		});
		return acc;
	}, []);
};

const initialFormData = { name: "", email: "" };

const bookingReducer = (
	state: BookingState,
	action: BookingAction,
): BookingState => {
	switch (action.type) {
		case "loading":
			return {
				...state,
				showForm: false,
				formData: undefined,
				status: "loading",
			};
		case "success": {
			return {
				...state,
				status: "success",
				selectedMovieSeats: action.payload,
			};
		}
		case "toggleSeat": {
			if (!state.selectedMovieSeats) return state;

			const { rowIndex, columnIndex } = action.payload;
			const updatedSeats = state.selectedMovieSeats.map((row, currentRow) =>
				currentRow === rowIndex
					? row.map((seat, currentCol) => {
							const isTargetSeat = currentCol === columnIndex;
							const isOccupied = seat === SeatType.Occupied;

							if (!isTargetSeat || isOccupied) return seat;

							return seat === SeatType.Selected
								? SeatType.Available
								: SeatType.Selected;
						})
					: row,
			);

			return {
				...state,
				selectedMovieSeats: updatedSeats,
				formData: { name: "", email: "" },
			};
		}
		case "showForm": {
			return {
				...state,
				showForm: !state.showForm,
				formData: {
					name: "",
					email: "",
				},
			};
		}
		case "updateName":
		case "updateEmail": {
			if (!state?.formData) return state;

			const field = action.type === "updateName" ? "name" : "email";
			return {
				...state,
				formData: {
					...state.formData,
					[field]: action.payload,
				},
			};
		}
		case "submit": {
			return {
				...state,
				status: "submit",
			};
		}
		case "error": {
			return {
				...state,
				status: "error",
				errorMessage: action.payload,
			};
		}
		default:
			return state;
	}
};

export const useBooking = (
	selectedMovieId: number,
	selectedMoviePrice: number,
	selectedMovieRows: number,
	selectedMovieColumns: number,
) => {
	const [state, dispatch] = useReducer(bookingReducer, {
		status: "idle",
		selectedMovieSeats: generateSeats(
			selectedMovieRows,
			selectedMovieColumns,
			[],
		),
		showForm: false,
		formData: undefined,
		errorMessage: undefined,
	});
	const formRef = useRef<HTMLFormElement>(null);

	const selectedSeats = getSelectedSeats(state.selectedMovieSeats);
	const selectedSeatCount = selectedSeats.length;
	const totalPrice = selectedSeatCount * (selectedMoviePrice ?? 0);

	useEffect(() => {
		dispatch({ type: "loading" });
	}, [selectedMovieId]);

	useEffect(() => {
		if (state.status === "loading") {
			const fetchData = async () => {
				try {
					const bookingResponse = await fetch(
						`${import.meta.env.VITE_API_URL}/bookings?movieId=${selectedMovieId}`,
					);

					if (!bookingResponse.ok) {
						throw new Error("Could not fetch bookings");
					}

					const json = await bookingResponse.json();

					dispatch({
						type: "success",
						payload: generateSeats(
							selectedMovieRows,
							selectedMovieColumns,
							json,
						),
					});
				} catch {
					dispatch({ type: "error", payload: "Could not fetch bookings" });
				}
			};

			fetchData();
		}
	}, [state.status]);

	const handleOnToggleSeat = (rowIndex: number, columnIndex: number) => {
		dispatch({
			type: "toggleSeat",
			payload: { rowIndex, columnIndex },
		});
	};

	const handleOnShowForm = () => {
		dispatch({
			type: "showForm",
		});
	};

	const handleOnNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updateName",
			payload: e.target.value,
		});
	};

	const handleOnEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updateEmail",
			payload: e.target.value,
		});
	};

	const handleOnSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm(formRef)) {
			return;
		}

		dispatch({
			type: "submit",
		});

		try {
			const bookingData = {
				movieId: selectedMovieId,
				customerName: state?.formData?.name,
				email: state?.formData?.email,
				seats: selectedSeats,
				totalPrice,
			};

			const bookingResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/bookings`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bookingData),
				},
			);

			if (!bookingResponse.ok) {
				throw new Error("Could not create booking");
			}

			dispatch({ type: "loading" });
		} catch {
			dispatch({ type: "error", payload: "Could not create booking" });
		}
	};

	return {
		status: state?.status,
		selectedMovieSeats: state?.selectedMovieSeats ?? [],
		selectedSeatCount,
		totalPrice,
		showForm: state?.showForm,
		formData: state?.formData ?? initialFormData,
		formRef,
		errorMessage: state?.errorMessage,
		handleOnToggleSeat,
		handleOnShowForm,
		handleOnNameChange,
		handleOnEmailChange,
		handleOnSubmit,
	};
};
