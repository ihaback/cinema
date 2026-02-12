import type { ChangeEvent, MouseEvent } from "react";

type CrudProps = {
	title: string;
	price: number;
	rows: number;
	columns: number;
	ref: React.RefObject<HTMLFormElement | null>;
	handleOnTitleChange: (_: ChangeEvent<HTMLInputElement>) => void;
	handleOnPriceChange: (_: ChangeEvent<HTMLInputElement>) => void;
	handleOnRowsChange: (_: ChangeEvent<HTMLInputElement>) => void;
	handleOnColumnsChange: (_: ChangeEvent<HTMLInputElement>) => void;
} & (
	| {
			handleOnUpdate: (_: MouseEvent<HTMLButtonElement>) => void;
			handleOnDelete: (_: MouseEvent<HTMLButtonElement>) => Promise<void>;
			handleOnCancelCreate?: undefined;
			handleOnCreate?: undefined;
	  }
	| {
			handleOnCancelCreate: (_: MouseEvent<HTMLButtonElement>) => void;
			handleOnCreate: (_: MouseEvent<HTMLButtonElement>) => Promise<void>;
			handleOnUpdate?: undefined;
			handleOnDelete?: undefined;
	  }
);

export const CrudForm = ({
	title,
	price,
	rows,
	columns,
	ref,
	handleOnTitleChange,
	handleOnPriceChange,
	handleOnRowsChange,
	handleOnColumnsChange,
	handleOnCreate,
	handleOnCancelCreate,
	handleOnDelete,
	handleOnUpdate,
}: CrudProps) => {
	return (
		<form className="form grid-auto-fit" ref={ref} noValidate>
			<div className="form__field">
				<label htmlFor="title" className="form__label">
					Title *
				</label>
				<input
					id="title"
					name="title"
					type="text"
					autoComplete="title"
					required
					value={title}
					onChange={handleOnTitleChange}
					className="form__input"
				/>
				<span className="form__error-message" />
			</div>
			<div className="form__field">
				<label htmlFor="price" className="form__label">
					Price *
				</label>
				<input
					id="price"
					name="price"
					type="number"
					required
					value={price}
					onChange={handleOnPriceChange}
					className="form__input"
					min={1}
				/>
				<span className="form__error-message" />
			</div>
			<div className="form__field">
				<label htmlFor="rows" className="form__label">
					Rows *
				</label>
				<input
					id="rows"
					name="rows"
					type="number"
					required
					value={rows}
					onChange={handleOnRowsChange}
					className="form__input"
					min={1}
				/>
				<span className="form__error-message" />
			</div>
			<div className="form__field">
				<label htmlFor="columns" className="form__label">
					Columns *
				</label>
				<input
					id="columns"
					name="columns"
					type="number"
					required
					value={columns}
					onChange={handleOnColumnsChange}
					className="form__input"
					min={1}
				/>
				<span className="form__error-message" />
			</div>

			{handleOnUpdate && (
				<button
					type="button"
					onClick={handleOnUpdate}
					className="button form__button"
					data-type="primary"
				>
					Update
				</button>
			)}
			{handleOnDelete && (
				<button
					type="button"
					onClick={handleOnDelete}
					className="button form__button"
					data-type="primary"
				>
					Delete
				</button>
			)}
			{handleOnCancelCreate && (
				<button
					type="button"
					onClick={handleOnCancelCreate}
					className="button form__button"
					data-type="primary"
				>
					Cancel
				</button>
			)}
			{handleOnCreate && (
				<button
					type="button"
					onClick={handleOnCreate}
					className="button form__button"
					data-type="primary"
				>
					Create
				</button>
			)}
		</form>
	);
};
