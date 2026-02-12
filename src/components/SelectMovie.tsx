import type { ChangeEvent } from "react";
import type { IMovie } from "../hooks/useMovies";

export const SelectMovie = ({
	selectedMovieId,
	handleOnSelectMovie,
	handleOnToggleCreate,
	selectableMovies,
	isAdmin,
}: {
	selectedMovieId: number | undefined;
	handleOnSelectMovie: (e: ChangeEvent<HTMLSelectElement>) => void;
	handleOnToggleCreate: () => void;
	selectableMovies: IMovie[];
	isAdmin: boolean;
}) => {
	const noMoviesText = isAdmin
		? "Please create a movie"
		: "No movies in the system";
	return (
		<div className="select-movie__wrapper">
			{selectableMovies.length === 0 && (
				<>
					<label htmlFor="movie" className="visually-hidden">
						{noMoviesText}
					</label>
					<select
						name="movie"
						id="movie"
						className="select-movie__select"
						onChange={handleOnSelectMovie}
						value={selectedMovieId ?? 0}
					>
						<option value={0} disabled hidden>
							{noMoviesText}
						</option>
					</select>
				</>
			)}
			{selectableMovies.length > 0 && (
				<>
					<label htmlFor="movie" className="visually-hidden">
						Select a movie
					</label>
					<select
						name="movie"
						id="movie"
						value={selectedMovieId}
						onChange={handleOnSelectMovie}
						className="select-movie__select"
					>
						{selectableMovies.map((movie) => (
							<option key={movie.id} value={movie.id}>
								{movie.title} ({movie.price} USD)
							</option>
						))}
					</select>
				</>
			)}
			{isAdmin && (
				<button
					className="button select-movie__button"
					data-type="primary"
					type="submit"
					onClick={handleOnToggleCreate}
				>
					Create
				</button>
			)}
		</div>
	);
};
