### Dva介绍  
[在线文档](https://dvajs.com/guide/introduce-class.html#react-%E6%B2%A1%E6%9C%89%E8%A7%A3%E5%86%B3%E7%9A%84%E9%97%AE%E9%A2%98)

dva 首先是一个基于 redux 和 redux-saga 的数据流方案，
``` javascript
// 简单示例
import dva from 'dva';
const App = () => <div>Hello dva</div>;

// 创建应用
const app = dva();
// 注册modal
app.model({
  namespace: 'count', // 命名空间，区分不同的modal，不能重复
  state: {            // 表示modal的状态数据
    record: 0,
    current: 0,
  },
  reducers: {      // Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: { // Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: { // Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。本项目中只引入了dva-core所以不支持。
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});
// 注册视图
app.router(() => <App />); // 本项目中只引入了dva-core，注册视图通过redux的Provider实现，下面会介绍
// 启动应用
app.start('#root'); // 本项目在局部使用，下面会介绍具体使用方法

```

### 为什么要引入Dva?

身处业务线，我们面临的是做不完的需求和修不完的bug，我们想的是高质量和快速的完成任务，但Redux的原始写法太过繁琐，不够简洁，由于项目微服务的架构，不能使用Redux的调试工具，进行辅助开发。

Redux原始写法带来的问题：
+ 编辑成本高，需要在 reducer, saga, action 之间来回切换
+ 不便于组织业务模型 (或者叫 domain model) 。比如我们写了一个 userlist 之后，要写一个 productlist，需要复制很多文件。
+ saga 书写太复杂，每监听一个 action 都需要走 fork -> watcher -> worker 的流程
+ entry 书写麻烦

Dva的解决方案：
+ dva 是基于现有应用架构 (redux + redux-saga 等)的一层轻量封装，没有引入任何新概念，使用过Redux的可快速切换
+ dva 是 framework，不是 library，类似 emberjs，会很明确地告诉你每个部件应该怎么写，这对于团队而言，会更可控
+ dva最核心的是提供了 app.model 方法，用于把 reducer, initialState, action, saga 封装到一起

Dva引入项目之后，我们可以跳过Redux的繁琐定义，快速进入开发状态，搭配Chrome的Redux调试工具，能够清晰的掌握数据的流向和变更，方便开发和后期的维护工作。

### 项目中的用法

#### 在原有模块中，新功能使用Dva

#### 新模块直接使用Dva
