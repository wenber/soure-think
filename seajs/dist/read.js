Module.define = function (id, deps, factory) {
    // 获取代码中声明的依赖关系
    deps = parseDependencies(factory.toString());
    // 保存
    Module.save();
    // 匹配到url
    var url = Module.resolve(id);
    // 加载脚本
    script.url = url;
    loadScript();
    // 执行factory并保存模块的引用
    ...
};

seajs模块的六个状态。

var STATUS = { 
　　'FETCHING': 1, // The module file is fetching now. 模块正在下载中 
　　'FETCHED': 2, // The module file has been fetched. 模块已下载 
　　'SAVED': 3, // The module info has been saved. 模块信息已保存 
　　'READY': 4, // All dependencies and self are ready to compile. 模块的依赖项都已下载，等待编译 
　　'COMPILING': 5, // The module is in compiling now. 模块正在编译中 
　　'COMPILED': 6 // The module is compiled and module.exports is available. 模块已编译 
}


在a模块的回调函数中寻找a模块依赖的模块后（这时a模块的状态是SAVED了），会判断a模块所依赖的模块是否跟自己有循环依赖的关系，如果有，就不去下载，seajs是通过getPureDependencies方法进行判断的，由于这时b模块还不存在于cachedModules中，所以这里不会检查出a与b有循环依赖的关系。

因此，去下载b模块，下载好了之后，b模块的状态是FETCHED，然后解析b模块，这时就会从b模块的回调函数中寻找b模块依赖的模块，这里检查出来了是a模块，这时b模块的状态变成了SAVED的。然后判断a模块是否与自己（b模块）循环依赖。由于此时a模块存在，并且状态是SAVED，这时就会检查出来了有依赖，因此b模块的状态就会直接变成了READY。

这时，a模块的状态就会变成READY（如果a模块还依赖其他的模块，比如c模块，那么等c模块变成READY后，a模块才会变成READY状态）。这时，就会去编译a模块，a模块的状态是COMPILING，编译过程，其实就是执行a模块的回调函数，（如果这里a模块依赖的是c模块，这时，就会执行c模块的回调函数，也就是编译c模块，编译结束后，c模块变成了COMPILED），紧接着，a模块变成COMPILED。

但是，这里依赖的是b模块，因此，在执行a模块的回调函数时（在编译a模块时），会执行b模块的回调函数，也就是编译b模块，等编译结束，b模块变成了COMPILED，紧接着a模块就变成了COMPILED。