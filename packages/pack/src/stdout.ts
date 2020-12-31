export const stdout = {
  plain(m: string): void {
    process.stdout.write(m + '\n')
  },
  error(m: string): void {
    process.stdout.write(m + '\n')
  },
}
