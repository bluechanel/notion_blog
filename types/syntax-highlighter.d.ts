// 文件路径: types/syntax-highlighter-override.d.ts

// 为了在我们的声明文件中使用 React.CSSProperties 类型，
// 需要先让这个文件知道 'react' 的类型定义。
// 注意：这个 import 只是为了类型系统，不会产生实际的运行时代码。
import 'react';

// 使用 declare module 来“打开”一个已存在的模块，以便增强它。
// 这里的模块路径必须和你组件中 import 的路径完全一致！
declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  
  // 我们在这里为 coldarkDark 导出一个新的、更精确的类型定义。
  // TypeScript 在编译时会优先使用我们在这里的定义。
  export const coldarkDark: { [key: string]: React.CSSProperties };

  // 如果你还用了其他主题，也可以在这里一并声明，例如：
  // export const coy: { [key: string]: React.CSSProperties };
  // export const dracula: { [key: string]: React.CSSProperties };
}

// (可选) 如果你尝试过 cjs 路径，也可以为它创建一个声明
// declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
//   export const coldarkDark: { [key: string]: React.CSSProperties };
// }