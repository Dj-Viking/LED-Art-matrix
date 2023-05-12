import { ActionReducerMapBuilder, AnyAction } from "@reduxjs/toolkit";

function actionIsMatching<AC extends TypedActionCreator<string>>(actionToMatch: AnyAction) {
    return function (action: AnyAction): action is ReturnType<AC> {
        return actionToMatch.type === action.type;
    };
}

export function newReducer<AC extends TypedActionCreator<string>, S>(
    builder: ActionReducerMapBuilder<S>,
    action: AC,
    reducer: any
): void {
    builder.addMatcher(actionIsMatching(action), reducer);
}
