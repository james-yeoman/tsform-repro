import type { DeepKeyValueName } from "./utils";
import type { FieldOptions, ReactFormApi } from "@tanstack/react-form";
import type { InputHTMLAttributes } from "react";

import { useForm } from "@tanstack/react-form";

import style from "./App.module.css";

type TSTextFieldProps<
	TFormData,
	TName extends DeepKeyValueName<TFormData, string>
> = FieldOptions<TFormData, TName> & {
	form: ReactFormApi<TFormData, any>;
	inputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"value" | "onBlur" | "onChange"
	>;
};

function TSTextField<
	TFormData,
	TName extends DeepKeyValueName<TFormData, string>
>(props: TSTextFieldProps<TFormData, TName>) {
	const { form, name, inputProps } = props;
	return (
		// Don't need to worry about validator types, and string
		// data requirement is handled by deepkeyvaluename
		<form.Field<TName, any, any> name={name}>
			{field => (
				<>
					<input
						{...inputProps}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={e => field.handleChange(e.target.value)}
						className={style.input}
						data-lpignore
						autoComplete="off"
					/>
				</>
			)}
		</form.Field>
	);
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
	const form = useForm({
		defaultValues: { a: "", b: "" },
		onSubmit: async ({ value, formApi }) => {
			await wait(1000);

			console.group("Before setState");
			console.dir({ value, state: formApi.store.state });
			console.groupEnd();

			// This setState resets the values to blank for some reason???
			formApi.store.setState(prev => ({
				...prev,
				fieldMeta: formApi.resetFieldMeta(formApi.store.state.fieldMeta)
			}));

			console.group("After the store batch");
			console.dir(formApi.store.state);
			console.groupEnd();
		}
	});

	return (
		<form
			onSubmit={e => {
				e.stopPropagation();
				e.preventDefault();
				form.handleSubmit();
			}}>
			<TSTextField form={form} name="a" />

			<button
				type="button"
				onClick={() => {
					console.dir(form.store.state);
				}}>
				Log Form Info
			</button>
			<button type="submit">Submit</button>
		</form>
	);
}

export default App;
