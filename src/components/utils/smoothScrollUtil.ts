/**
 * Scrolls smoothly to a given position
 * @param viewportPositionDivisor used to devide the client height by it, thus calculating the viewport value to scroll to
 */
export const smoothScrollUtil = (viewportPositionDivisor = 2.5) => {
    const SCROLL_DOWN_RECIPE_CATALOGUE_VIEWPORT_VALUE = document.body.clientHeight / viewportPositionDivisor;

    window.scrollTo({
        top: SCROLL_DOWN_RECIPE_CATALOGUE_VIEWPORT_VALUE,
        behavior: "smooth"
    });
}