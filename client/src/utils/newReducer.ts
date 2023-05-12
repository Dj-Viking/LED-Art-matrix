import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
export function newReducer<TActionCreator extends TypedActionCreator<string>, S>(
    builder: ActionReducerMapBuilder<S>,
    action: TActionCreator,
    reducer: any
): void {
    builder.addCase(action, reducer);
}
