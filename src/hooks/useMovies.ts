import {
	type ChangeEvent,
	type MouseEvent,
	useEffect,
	useReducer,
	useRef,
} from "react";
import { validateForm } from "../utils/utils";

export interface IMovie {
	id: number;
	title: string;
	price: number;
	rows: number;
	columns: number;
}

interface IFormData {
	title: string;
	price: number;
	rows: number;
	columns: number;
}

export type MovieState = {
	movies?: IMovie[];
	selectableMovies?: IMovie[];
	selectedMovieId?: number;
	selectedMovieTitle?: string;
	selectedMoviePrice?: number;
	selectedMovieRows?: number;
	selectedMovieColumns?: number;
	isAdmin: boolean;
	formData?: IFormData;
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
			movies: IMovie[];
	  }
	| {
			status: "create";
	  }
	| {
			status: "submitCreate";
	  }
	| {
			status: "submitUpdate";
	  }
	| {
			status: "submitDelete";
	  }
	| {
			status: "noMovies";
	  }
	| {
			status: "error";
			errorMessage: string;
	  }
);

export type MovieAction =
	| {
			type: "loading";
	  }
	| {
			type: "selectMovie";
			payload: number;
	  }
	| {
			type: "success";
			payload: IMovie[];
	  }
	| {
			type: "toggleAdmin";
	  }
	| {
			type: "updateTitle";
			payload: string;
	  }
	| {
			type: "updatePrice";
			payload: number;
	  }
	| {
			type: "updateRows";
			payload: number;
	  }
	| {
			type: "updateColumns";
			payload: number;
	  }
	| {
			type: "create";
	  }
	| {
			type: "submitCreate";
	  }
	| {
			type: "submitUpdate";
	  }
	| {
			type: "submitDelete";
	  }
	| {
			type: "error";
			payload: string;
	  };

const initialState = {
	status: "idle" as const,
	selectableMovies: undefined,
	movies: undefined,
	selectedMovieId: undefined,
	selectedMovieTitle: undefined,
	selectedMoviePrice: undefined,
	selectedMovieRows: undefined,
	selectedMovieColumns: undefined,
	isAdmin: false,
	formData: undefined,
	errorMessage: undefined,
};

const initialFormData = { title: "", price: 0, rows: 0, columns: 0 };

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
	switch (action.type) {
		case "loading":
			return {
				...state,
				...initialState,
				status: "loading",
				isAdmin: state?.isAdmin ? state.isAdmin : false,
				selectedMovieId: state?.selectedMovieId
					? state?.selectedMovieId
					: undefined,
			};
		case "success": {
			if (action.payload.length === 0) {
				return {
					...state,
					status: "noMovies",
					movies: [],
					selectableMovies: [],
					selectedMovieId: undefined,
					selectedMovieTitle: undefined,
					selectedMoviePrice: undefined,
					selectedMovieRows: undefined,
					selectedMovieColumns: undefined,
					isAdmin: state?.isAdmin ? state.isAdmin : false,
					formData: undefined,
				};
			}

			const movieToSelect =
				(state?.selectedMovieId
					? action.payload.find((m) => m.id === state.selectedMovieId)
					: undefined) ?? action.payload[0];

			return {
				...state,
				status: "success",
				movies: action.payload,
				selectableMovies: action.payload,
				selectedMovieId: movieToSelect.id,
				selectedMovieTitle: movieToSelect.title,
				selectedMoviePrice: movieToSelect.price,
				selectedMovieRows: movieToSelect.rows,
				selectedMovieColumns: movieToSelect.columns,
				isAdmin: state?.isAdmin ? state.isAdmin : false,
				formData: state?.isAdmin
					? {
							title: movieToSelect.title,
							price: movieToSelect.price,
							rows: movieToSelect.rows,
							columns: movieToSelect.columns,
						}
					: undefined,
			};
		}
		case "selectMovie": {
			const selectedMovie = state.movies?.find((m) => m.id === action.payload);
			if (!selectedMovie) return state;

			return {
				...state,
				selectedMovieId: selectedMovie.id,
				selectedMovieTitle: selectedMovie.title,
				selectedMoviePrice: selectedMovie.price,
				selectedMovieRows: selectedMovie.rows,
				selectedMovieColumns: selectedMovie.columns,
				formData: state?.isAdmin
					? {
							title: selectedMovie.title,
							price: selectedMovie.price,
							rows: selectedMovie.rows,
							columns: selectedMovie.columns,
						}
					: undefined,
			};
		}
		case "toggleAdmin": {
			if (state.status === "noMovies") {
				return { ...state, isAdmin: !state.isAdmin };
			}

			if (
				!state?.selectedMovieTitle ||
				!state?.selectedMoviePrice ||
				!state?.selectedMovieRows ||
				!state?.selectedMovieId ||
				!state?.selectedMovieColumns ||
				!state?.movies
			) {
				return state;
			}

			return {
				...state,
				isAdmin: !state.isAdmin,
				status: "success",
				movies: state.movies,
				formData: {
					title: state.selectedMovieTitle,
					price: state.selectedMoviePrice,
					rows: state.selectedMovieRows,
					columns: state.selectedMovieColumns,
				},
			};
		}
		case "updateTitle":
		case "updatePrice":
		case "updateRows":
		case "updateColumns": {
			if (!state?.formData) return state;

			let field = null;

			switch (action.type) {
				case "updateTitle":
					field = "title";
					break;
				case "updatePrice":
					field = "price";
					break;
				case "updateRows":
					field = "rows";
					break;
				case "updateColumns":
					field = "columns";
					break;
				default:
					field = null;
			}

			if (!field) {
				return state;
			}

			return {
				...state,
				formData: {
					...state.formData,
					[field]: action.payload,
				},
			};
		}
		case "create": {
			return {
				...state,
				status: "create",
				formData: initialFormData,
			};
		}
		case "submitCreate": {
			return {
				...state,
				status: "submitCreate",
				selectedMovieId: undefined,
			};
		}
		case "submitUpdate": {
			return {
				...state,
				status: "submitUpdate",
			};
		}
		case "submitDelete": {
			return {
				...state,
				status: "submitDelete",
			};
		}
		case "error": {
			return {
				...state,
				...initialState,
				status: "error",
				errorMessage: action.payload,
			};
		}
		default:
			return state;
	}
};

export const useMovies = () => {
	const [state, dispatch] = useReducer(movieReducer, initialState);
	const crudFormRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.status === "idle") {
			dispatch({ type: "loading" });
		}

		if (state.status === "loading") {
			const fetchMovies = async () => {
				try {
					const moviesResponse = await fetch(
						`${import.meta.env.VITE_API_URL}/movies?_sort=id&_order=desc`,
					);

					if (!moviesResponse.ok) {
						throw new Error("Could not fetch movies");
					}

					const jsonMovies = await moviesResponse.json();

					dispatch({
						type: "success",
						payload: jsonMovies,
					});
				} catch (err) {
					dispatch({
						type: "error",
						payload:
							err instanceof Error ? err.message : "Could not fetch movies.",
					});
				}
			};

			fetchMovies();
		}

		if (state.status === "submitUpdate") {
			const updateMovie = async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/movies/${state.selectedMovieId}`,
						{
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								title: state.formData?.title,
								price: state.formData?.price,
								rows: state.formData?.rows,
								columns: state.formData?.columns,
							}),
						},
					);

					if (!response.ok) {
						throw new Error("Could not update movie");
					}

					dispatch({ type: "loading" });
				} catch (err) {
					dispatch({
						type: "error",
						payload:
							err instanceof Error ? err.message : "Could not update movie",
					});
				}
			};

			updateMovie();
		}

		if (state.status === "submitDelete") {
			const deleteMovie = async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/movies/${state.selectedMovieId}`,
						{
							method: "DELETE",
							headers: { "Content-Type": "application/json" },
						},
					);

					if (!response.ok) {
						throw new Error("Could not delete movie");
					}

					dispatch({ type: "loading" });
				} catch (err) {
					dispatch({
						type: "error",
						payload:
							err instanceof Error ? err.message : "Could not delete movie",
					});
				}
			};

			deleteMovie();
		}

		if (state.status === "submitCreate") {
			const createMovie = async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/movies`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								title: state.formData?.title,
								price: state.formData?.price,
								rows: state.formData?.rows,
								columns: state.formData?.columns,
							}),
						},
					);

					if (!response.ok) {
						throw new Error("Could not create movie");
					}

					dispatch({ type: "loading" });
				} catch (err) {
					dispatch({
						type: "error",
						payload:
							err instanceof Error ? err.message : "Could not create movie",
					});
				}
			};

			createMovie();
		}
	}, [state.status]);

	const handleOnSelectMovie = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch({
			type: "selectMovie",
			payload: parseInt(e.target.value, 10),
		});
	};

	const handleOnToggleAdmin = () => {
		dispatch({
			type: "toggleAdmin",
		});
	};

	const handleOnTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updateTitle",
			payload: e.target.value,
		});
	};

	const handleOnPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updatePrice",
			payload: parseInt(e.target.value, 10),
		});
	};

	const handleOnRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updateRows",
			payload: parseInt(e.target.value, 10),
		});
	};

	const handleOnColumnsChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch({
			type: "updateColumns",
			payload: parseInt(e.target.value, 10),
		});
	};

	const handleOnUpdate = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (!validateForm(crudFormRef)) {
			return;
		}

		dispatch({ type: "submitUpdate" });
	};

	const handleOnDelete = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch({ type: "submitDelete" });
	};

	const handleOnToggleCreate = () => {
		dispatch({
			type: "create",
		});
	};

	const handleOnCancelCreate = () => {
		dispatch({
			type: "loading",
		});
	};

	const handleOnCreate = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (!validateForm(crudFormRef)) {
			return;
		}

		dispatch({ type: "submitCreate" });
	};

	return {
		status: state?.status,
		selectableMovies: state?.selectableMovies ?? [],
		selectedMovieId: state?.selectedMovieId,
		selectedMovieTitle: state?.selectedMovieTitle,
		selectedMoviePrice: state?.selectedMoviePrice,
		selectedMovieRows: state?.selectedMovieRows,
		selectedMovieColumns: state?.selectedMovieColumns,
		isAdmin: state?.isAdmin,
		formData: state?.formData ?? initialFormData,
		crudFormRef,
		errorMessage: state?.errorMessage,
		handleOnSelectMovie,
		handleOnToggleAdmin,
		handleOnTitleChange,
		handleOnPriceChange,
		handleOnRowsChange,
		handleOnColumnsChange,
		handleOnUpdate,
		handleOnDelete,
		handleOnToggleCreate,
		handleOnCancelCreate,
		handleOnCreate,
	};
};
