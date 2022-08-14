import React, { createContext, ReactNode } from 'react';

type UseExampleState = {
  checked: boolean,
}

type UseExampleActions = {
  handleToggleChecked: () => void,
}

type UseExampleReturnType = [UseExampleState, UseExampleActions]

const INITIAL_EXAMPLE_STATE: UseExampleState = {
  checked: false,
}

function useExample(): UseExampleReturnType {
  const [ state, setState ] = React.useState<UseExampleState>(INITIAL_EXAMPLE_STATE);

  const handleToggleChecked = () => {
    setState((prev) => {
      return {
        ...prev,
        checked: !prev.checked,
      }
    })
  }

  return [
    state,
    {
      handleToggleChecked,
    },
  ]
}

type AppContextType = {
  example: ReturnType<typeof useExample>,
}

type AppContextValue = {
  [K in keyof AppContextType]: AppContextType[K] | null
};

const AppContext = createContext<AppContextValue>({
  example: null,
});

function ContextProvider ({ children }: { children: ReactNode }): JSX.Element {
  const value: AppContextType = {
    example: useExample(),
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function AppContextProvider({ children }:  { children: React.ReactNode }): JSX.Element {
  return (
    <ContextProvider>
      {children}
    </ContextProvider>
  )
}

export function useAppContext(): AppContextType {
  return React.useContext(AppContext) as AppContextType
}

export function ExampleComponentThatUsesContext (): JSX.Element {
  const {
    example: [ exampleState, exampleActions ],
  } = useAppContext();

  return (
    <>
      <p>{`${exampleState.checked}`}</p>
      <button onClick={exampleActions.handleToggleChecked}>toggle exampleState checked</button>
    </>
  )
}