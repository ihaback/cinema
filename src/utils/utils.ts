import type { RefObject } from "react";

const validateField = (field: HTMLInputElement) => {
	const errorElement = field?.parentElement?.querySelector(
		".form__error-message",
	);
	if (!field.validity.valid) {
		if (errorElement) {
			errorElement.textContent = field?.title
				? field.title
				: "This field is required";
		}

		return false;
	}

	if (errorElement) {
		errorElement.textContent = null;
	}

	return true;
};

export const validateForm = (
	formRef: RefObject<HTMLFormElement | null>,
): boolean => {
	if (!formRef?.current) {
		return false;
	}

	let isValid = true;

	formRef.current.querySelectorAll("input").forEach((field) => {
		const fieldValid = validateField(field);

		if (!fieldValid) {
			isValid = false;
		}
	});

	return isValid;
};
