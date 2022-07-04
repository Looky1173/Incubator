/**
 * Assign a react component with default properties.
 * @param {import("react").Component} Component The component to assign the defaults to.
 * @param {Object} defaults The default properties to assign to the component.
 */
export default function withDefaults(component, defaultProps) {
    component.defaultProps = defaultProps;
    return component;
};
