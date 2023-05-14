import { ActionReducerMapBuilder, CaseReducer } from "@reduxjs/toolkit";
export function newReducer<TActionCreator extends TypedActionCreator<string>, S>(
    builder: ActionReducerMapBuilder<S>,
    action: TActionCreator,
    reducer: CaseReducer<S, ReturnType<TActionCreator>>
): void {
    builder.addCase(action, reducer);
}
