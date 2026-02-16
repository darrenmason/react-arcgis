import React from 'react';

/**
 * Clone children and inject props
 */
export const cloneChildrenWithProps = (
  children: React.ReactNode,
  props: Record<string, any>
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, props);
    }
    return child;
  });
};
