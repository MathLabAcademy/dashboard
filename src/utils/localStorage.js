export const loadState = key => {
  try {
    const serializedState = localStorage.getItem(key)
    return serializedState !== null ? JSON.parse(serializedState) : undefined
  } catch (err) {
    console.error(err)
  }
}

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    console.error(err)
  }
}
