export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
    $tm: (key: string) => []|{[p: string]: any};
    $d: (date: Date, format: string) => string;
  }
}
