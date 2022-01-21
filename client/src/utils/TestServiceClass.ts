import { ApiService, IApiService } from "./ApiService";

export class TestService extends ApiService implements IApiService {

  public static getGifStyles(cssDeclaration: CSSStyleDeclaration): Record<"values", any> {
    let styleValues = {} as Record<"values", any>;
    Object.keys(cssDeclaration).forEach((key) => {
      // console.log("key", key, ":", gifStyleRef[key as keyof CSSStyleDeclaration]);
      if (key === "_values") {
        styleValues = {
          ...styleValues,
          values: cssDeclaration[key as any]
        };
      }
    });
    return styleValues;

  }
}