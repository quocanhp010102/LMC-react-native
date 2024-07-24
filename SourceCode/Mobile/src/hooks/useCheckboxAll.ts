import { useCallback, useState } from "react"

export const useCheckboxAll = (listId: any[], defaultChecked: any[] = []) => {
  const [selected, setSelected] = useState<any[]>(defaultChecked)
  const [all, setAll] = useState<boolean>(false)

  const choose = useCallback(
    (id?: number) => {
      let newData = [...selected]
      if (selected.includes(id)) {
        newData = newData.filter((x) => x !== id)
      } else {
        newData.push(id)
      }
      setSelected(newData)
    },
    [selected]
  )
  const chooseAll = () => {
    if (!all) {
      setSelected([...listId])
    } else {
      setSelected([])
    }
    setAll(!all)
  }

  const getChecked = (id?: number) => {
    return selected.includes(id)
  }

  return {
    selected,
    chooseAll,
    choose,
    setSelected,
    all,
    getChecked,
  }
}
