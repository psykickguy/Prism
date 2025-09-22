import { createContext, useContext } from "react";

/**
 * A helper function to create a React context that throws an error
 * if used outside of its corresponding provider.
 * @param {string} name - The name of the context for error messages.
 * @returns {[React.Provider, () => ContextValue]} A tuple with the Provider component and the context hook.
 */
export function getStrictContext(name) {
  const context = createContext(undefined);

  function useStrictContext() {
    const value = useContext(context);
    if (value === undefined) {
      throw new Error(`Hook for \`${name}\` must be used within its provider`);
    }
    return value;
  }

  return [context.Provider, useStrictContext];
}
