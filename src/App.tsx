import { Suspense } from "react";
import { Booking } from "./components/Booking";
import { CrudForm } from "./components/CrudForm";
import { ErrorMessage } from "./components/ErrorMessage";
import { SelectMovie } from "./components/SelectMovie";
import { SiteHeader } from "./components/SiteHeader";
import { SiteMain } from "./components/SiteMain";
import { useMovies } from "./hooks/useMovies";

export const App = () => {
	const {
		isAdmin,
		selectableMovies,
		status,
		selectedMovieId,
		selectedMovieRows,
		selectedMovieColumns,
		selectedMoviePrice,
		formData,
		crudFormRef,
		errorMessage,
		handleOnSelectMovie,
		handleOnToggleAdmin,
		handleOnTitleChange,
		handleOnPriceChange,
		handleOnRowsChange,
		handleOnColumnsChange,
		handleOnCreate,
		handleOnCancelCreate,
		handleOnUpdate,
		handleOnDelete,
		handleOnToggleCreate,
	} = useMovies();

	return (
		<>
			<SiteHeader
				isAdmin={status !== "error" ? isAdmin : null}
				handleOnToggleAdmin={handleOnToggleAdmin}
			/>
			<SiteMain>
				<section className="section">
					<div className="container container--narrow flow">
						{status === "error" && errorMessage && (
							<ErrorMessage
								errorMessage={errorMessage}
								infoText="Reload application"
							/>
						)}
						<Suspense>
							{status === "noMovies" && (
								<SelectMovie
									selectedMovieId={selectedMovieId}
									handleOnSelectMovie={handleOnSelectMovie}
									handleOnToggleCreate={handleOnToggleCreate}
									selectableMovies={selectableMovies}
									isAdmin={isAdmin}
								/>
							)}
							{status === "success" && (
								<>
									<SelectMovie
										selectedMovieId={selectedMovieId}
										handleOnSelectMovie={handleOnSelectMovie}
										handleOnToggleCreate={handleOnToggleCreate}
										selectableMovies={selectableMovies}
										isAdmin={isAdmin}
									/>
									{!isAdmin &&
										selectedMovieId &&
										selectedMovieRows &&
										selectedMovieColumns &&
										selectedMoviePrice && (
											<Booking
												selectedMovieId={selectedMovieId}
												selectedMovieRows={selectedMovieRows}
												selectedMovieColumns={selectedMovieColumns}
												selectedMoviePrice={selectedMoviePrice}
											/>
										)}
								</>
							)}
							{isAdmin && status === "success" && (
								<CrudForm
									title={formData.title}
									price={formData.price}
									rows={formData.rows}
									columns={formData.columns}
									handleOnTitleChange={handleOnTitleChange}
									handleOnPriceChange={handleOnPriceChange}
									handleOnRowsChange={handleOnRowsChange}
									handleOnColumnsChange={handleOnColumnsChange}
									handleOnUpdate={handleOnUpdate}
									handleOnDelete={handleOnDelete}
									ref={crudFormRef}
								/>
							)}
							{isAdmin && status === "create" && (
								<CrudForm
									title={formData.title}
									price={formData.price}
									rows={formData.rows}
									columns={formData.columns}
									handleOnTitleChange={handleOnTitleChange}
									handleOnPriceChange={handleOnPriceChange}
									handleOnRowsChange={handleOnRowsChange}
									handleOnColumnsChange={handleOnColumnsChange}
									handleOnCreate={handleOnCreate}
									handleOnCancelCreate={handleOnCancelCreate}
									ref={crudFormRef}
								/>
							)}
						</Suspense>
					</div>
				</section>
			</SiteMain>
		</>
	);
};
