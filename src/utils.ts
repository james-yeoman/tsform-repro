import type { DeepKeys, DeepValue } from "@tanstack/react-form";

type SelfKeys<T> = {
	[K in keyof T]: K;
}[keyof T];

// Taken from https://github.com/TanStack/form/pull/825/files#diff-a5f2da5b97ba4f92cb17d93bb727f7dc52e032368a6bbbd8039885513b311645R153
// Once that PR is out of draft status and merged in, we won't need to define this util type
export type DeepKeyValueName<TFormData, TField> = SelfKeys<{
	[K in DeepKeys<TFormData> as DeepValue<TFormData, K> extends TField
		? K
		: never]: K;
}>;
