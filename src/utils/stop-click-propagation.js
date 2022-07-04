export default function stopClickPropagation(event) {
    // In the `Thumbnail` component, necessary to prevent the link card component from catching the click event and navigating away
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
}