// 方法签名
interface IClient {
  // type：方法类型， 目前只有 login 
  // params: 方法参数
  // callback: 回调处理
  invokeClientMethod(request: IRequest<ILoginParams>, callback: (args: IResponse<ILoginResponse>)=>{}):void;
}
// 请求参数
interface IRequest<T> {
  type: string; // 方法类型， 目前只有 login 
  params?: T; // 方法参数, login 的参数格式
  callback: string; // callback name
}
// 请求参数，params的泛型
interface ILoginParams {
  type: 'Google'| 'Apple' | 'Telegram'; // 登录类型， 可选值：google, apple, telegram
}
// 回调参数args的类型
interface IResponse<T> {
  status: number; // 状态, 1代表成功， 0代表失败
  msg?: string; // 失败信息
  code?: number; // 失败代码
  data?: T;  // status为1时，获取到的数据
}
// 回调参数，data的泛型
interface ILoginResponse {
  token: string; // 登录成功的token值
}