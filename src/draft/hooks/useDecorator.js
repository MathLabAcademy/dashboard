import { CompositeDecorator } from 'draft-js'
import { useMemo } from 'react'

function useDecorator(getStore, plugins) {
  const compositeDecorator = useMemo(() => {
    const decoratorProps = { props: { getStore } }

    const decoratorsList = plugins.reduce(
      (decoratorsList, { decorators = [] }) => {
        for (const decorator of decorators) {
          decoratorsList.push(Object.assign({}, decoratorProps, decorator))
        }

        return decoratorsList
      },
      []
    )

    return new CompositeDecorator(decoratorsList)
  }, [getStore, plugins])

  return compositeDecorator
}

export default useDecorator
