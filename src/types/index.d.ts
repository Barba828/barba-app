/**
 * 获取函数入参类型
 */
type GetType<T> = T extends (arg: infer P) => void ? P : string;
