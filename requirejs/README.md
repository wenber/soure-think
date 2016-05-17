# requirejs-bower

Bower packaging for [RequireJS](http://requirejs.org).

// 循环一定次数
context.enable()-->module.enable()
module.load()--->context.load() --->req.load()



//首次调用
req({}) 
=> 
//触发newContext，做首次初始化并返回给context对象
context = contexts[contextName] = req.s.newContext(contextName)
=>
//注意这里require函数其实处于了mackRequire函数的闭包环境
context.require = context.makeRequire();
=>
// 再次调用req(cfg),cfg的内容是data-main定义的入口函数，执行req，就会加载这个函数
=>
//首次调用newContext返回对象初始化变量
context.configure(config);

由于我们在业务中写了require.config


completeLoad是在script标签加载结束后调用的方法


所以我们这里来重新整理下requireJS的执行流程(可能有误)

① 引入requireJS标签后，首先执行一些初始化操作(变量声明，环境检测)

② 执行req({})初始化newContext，并且保存至contexts对象中

③ 执行req(cfg)，将读取的data-main属性并且封装为参数实例化模块

④ 执行main.js中的逻辑，执行require时候，会一次加载name与say

⑤ 调用依赖时候会根据define进行设置将加载好的标签引入键值对应关系，执行点是load事件

所以关键点再次回到了main.js加载之后做的事情

经过之前的学习，面对requireJS我们大概知道了以下事情

① require是先将依赖项加载结束，然后再执行后面的函数回调

首先第一个就是一个难点，因为require现在是采用script标签的方式引入各个模块，所以我们不能确定何时加载结束，所以这里存在一个复杂的判断以及缓存

② 依赖列表以映射的方式保存对应的模块，事实上返回的是一个执行后的代码，返回可能是对象可能是函数，可能什么也没有（不标准）

这个也是一块比较烦的地方，意味着，每一个define模块都会维护一个闭包，而且多数时候这个闭包是无法释放的，所以真正大模块的单页应用有可能越用越卡

面对这一问题，一般采用将大项目分频道的方式，以免首次加载过多的资源，防止内存占用过度问题

③ 加载模块时候会创建script标签，这里为其绑定了onload事件判断是否加载结束，若是加载结束，会在原来的缓存模块中找到对应模块并且为其赋值，这里又是一个复杂的过程

再说main模块的加载
经过之前的学习，main模块加载之前会经历如下步骤

① require调用req({})初始化一个上下文环境（newContext）

② 解析页面script标签，碰到具有data-main属性的标签便停下，并且解析他形成第一个配置项调用req(cfg)

③ 内部调用统一入口requirejs，并取出上文实例化后的上下文环境（context），执行其require方法

④ 内部调用localRequire(makeRequire)方法，这里干了比较重要的事情实例化模块

⑤ 模块的实例化发生在localRequire中，这里的步骤比较关键

首先，这里会调用nextTick实际去创建加载各个模块的操作，但是这里有一个settimeout就比较麻烦了，所有的操作会抛出主干流程之外


1,data-main入口实现：项目入口, 寻找有data-main的script. cripts()返回页面所有的script. 逆向遍历这些script直到有一个func返回true.如果config没有配置baseUrl, 则含有data-main 指定文件所在的目录为baseUrl.如果mainScript包括.js则去掉，让他表现的像一个module name.把data-main指向的script放入cfg.deps中, 作为第一个load

加载前的部分: 到nextTick结束
加载后的部分：从onScriptLoad开始

产生循环依赖时：如A->B->A:则B模块中的A为undefined,因为A还没有执行回调，B的函数体会执行
循环依赖时网络请求是正序。回调函数是逆序

depCount:初始为0  在defineDep中减1 ，在enable中加1


normalize在标准化模块名时，是以main.js路径为基准,如果main.js里面配置了baseurl，则以baseurl为基准，标准模块名没有./   ../  .js这些多余的描述







