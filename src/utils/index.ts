import _ from 'lodash'

export const setList = <T>(list: T[], newList: T[], push = false) => {
  if (!push) list.length = 0
  list.push(...newList)
}

export const toParse = (list: string[]) => {
  return list.map((ele) => JSON.parse(ele))
}

export const setObj = <T = any>(obj: T, newObj: T) => {
  if (_.isEmpty(newObj)) {
    for (const key in obj) {
      obj[key] = '' as any
    }
  } else {
    for (const key in obj) {
      obj[key] = '' as any
    }
    for (const key in newObj) {
      obj[key] = newObj[key]
    }
  }
}
