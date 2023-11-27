declare module "tailwindcss/lib/util/color" {
  // @ts-ignore
  const parseColor = (value: string): { color: Array<string> } => {};
  export { parseColor };
}

declare module "tailwind-config" {
  import { Config } from 'tailwindcss'
  const config: Config;
  export default config;
}
