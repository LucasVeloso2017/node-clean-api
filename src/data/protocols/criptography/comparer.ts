export interface Comparer{
  comparer: (value: string, hashedValue: string) => Promise<boolean>
}
