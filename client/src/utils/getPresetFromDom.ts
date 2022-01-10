export function getPresetFromDom(eventTarget: any): string {
  return eventTarget
    .parentElement
      .parentElement
        .parentElement
          .children[1]
            .firstChild
              .firstChild
              .className
              .split("led1-1")[1];
}