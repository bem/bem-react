export const log = {
  error(m: string): void {
    process.stdout.write(m + '\n')
  },
}
