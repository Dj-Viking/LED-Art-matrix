import { ApiService, IApiService } from "./ApiService";
import { ISignTestTokenArgs } from "../types";
import jwt from "jsonwebtoken";

/**
 * helper class for the testing environment
 * most helper methods are static on this class so no need to instantiate the class to use the methods
 */
export class TestService extends ApiService implements IApiService {

  /**
   * 
   * @param cssDeclaration style object of the selected element from the virtual DOM 
   * @returns a simple object as { values: string } with the style values object containing the css rules of the selected element
   */
  public static getStyles(cssDeclaration: CSSStyleDeclaration): Record<"values", any> {
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

  /**
   * 
   * @param type string key of the global event handlers event map type like "click" or "change"
   * @param props optional object to pass parameters to the new event object
   * @returns a new bubbled event with optional parameters
   */
  public static createBubbledEvent(
    type: keyof GlobalEventHandlersEventMap, 
    props = {} as Record<string, any>
  ): Event {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, props);
    return event;
  };

  public static signTestToken(args: ISignTestTokenArgs): string {
    const { 
      uuid: someUuid,
      username,
      email,
      _id,
    } = args;
    const token = jwt.sign(
      {
        someUuid,
        username,
        email,
        _id,
        role: void 0,
      },
      "BLAHBLAHBLAH" as string,
      { expiresIn: "24h" }
    );
    return token;
  }
}