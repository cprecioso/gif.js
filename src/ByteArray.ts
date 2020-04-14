export default class ByteArray {
  page = 1
  pages: Uint8Array[] = []
  cursor = 0

  constructor() {
    this.newPage()
  }

  static pageSize = 4096
  static charMap = (() => {
    const obj: { [key: number]: string } = {}
    for (let i = 0; i < 256; i++) obj[i] = String.fromCharCode(i)
    return obj
  })()

  newPage() {
    this.pages[++this.page] = new Uint8Array(ByteArray.pageSize)
    this.cursor = 0
  }

  getData() {
    let rv = ""
    for (const page of this.pages) {
      for (let i = 0; i < ByteArray.pageSize; i++) {
        rv += ByteArray.charMap[page[i]]
      }
    }
    return rv
  }

  writeByte(val: number) {
    if (this.cursor >= ByteArray.pageSize) this.newPage()
    this.pages[this.page][this.cursor++] = val
  }

  writeUTFBytes(string: string) {
    for (let l = string.length, i = 0; i < l; i++)
      this.writeByte(string.charCodeAt(i))
  }

  writeBytes(array: number[], offset: number, length: number) {
    for (let l = length || array.length, i = offset || 0; i < l; i++)
      this.writeByte(array[i])
  }
}
