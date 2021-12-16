export const equal = (a, b) => {
  if(a && a.equal && b && b.equal)
    return a.equal(b) as boolean

  return a == b
}